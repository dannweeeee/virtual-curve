import BN from "bn.js";
import Decimal from "decimal.js";
import { SafeMath } from "./safeMath";
import { 
  Rounding, 
  safeMulDivCastU64, 
  bnToDecimal, 
  decimalToBN, 
  batchBnToDecimal,
  mulDivBN
} from "./utilsMath";
import {
  BASIS_POINT_MAX,
  FEE_DENOMINATOR,
  MAX_FEE_NUMERATOR,
} from "./constants";

/**
 * Fee scheduler mode
 */
export enum FeeSchedulerMode {
  // fee = cliff_fee_numerator - passed_period * reduction_factor
  Linear = 0,
  // fee = cliff_fee_numerator * (1-reduction_factor/10_000)^passed_period
  Exponential = 1,
}

/**
 * Fee mode
 */
export interface FeeMode {
  feesOnInput: boolean;
  feesOnBaseToken: boolean;
  hasReferral: boolean;
}

/**
 * Fee on amount result
 */
export interface FeeOnAmountResult {
  amount: BN;
  tradingFee: BN;
  protocolFee: BN;
  referralFee: BN;
}

/**
 * Get fee in period for exponential fee scheduler
 * @param cliffFeeNumerator Cliff fee numerator
 * @param reductionFactor Reduction factor
 * @param period Period
 * @returns Fee numerator
 */
export function getFeeInPeriod(
  cliffFeeNumerator: BN,
  reductionFactor: BN,
  period: number
): BN {
  // Early return for period 0
  if (period === 0) {
    return cliffFeeNumerator;
  }
  
  // Early return for period 1 with simple calculation
  if (period === 1) {
    const basisPointMax = new BN(BASIS_POINT_MAX);
    return mulDivBN(
      cliffFeeNumerator,
      basisPointMax.sub(reductionFactor),
      basisPointMax,
      Rounding.Down
    );
  }

  // Convert to Decimal for higher precision in one batch
  const [cliffFeeDecimal, reductionFactorDecimal] = 
    batchBnToDecimal(cliffFeeNumerator, reductionFactor);
  const basisPointMaxDecimal = new Decimal(BASIS_POINT_MAX);
  
  // Batch operations in Decimal
  // Calculate (1 - reduction_factor/10_000)
  const multiplier = basisPointMaxDecimal.sub(reductionFactorDecimal).div(basisPointMaxDecimal);
  
  // Calculate (1 - reduction_factor/10_000)^period in one operation
  const feeNumeratorDecimal = cliffFeeDecimal.mul(multiplier.pow(period));
  
  // Convert back to BN
  return decimalToBN(feeNumeratorDecimal, Rounding.Down);
}

/**
 * Get current base fee numerator
 * @param baseFee Base fee parameters
 * @param currentPoint Current point
 * @param activationPoint Activation point
 * @returns Current base fee numerator
 */
export function getCurrentBaseFeeNumerator(
  baseFee: {
    cliffFeeNumerator: BN;
    feeSchedulerMode: number;
    numberOfPeriod: number;
    periodFrequency: BN;
    reductionFactor: BN;
  },
  currentPoint: BN,
  activationPoint: BN
): BN {
  // Early return for zero period frequency
  if (baseFee.periodFrequency.isZero()) {
    return baseFee.cliffFeeNumerator;
  }

  // Convert to Decimal for higher precision in one batch
  const [currentPointDecimal, activationPointDecimal, periodFrequencyDecimal, 
         cliffFeeNumeratorDecimal, reductionFactorDecimal] = 
    batchBnToDecimal(
      currentPoint, 
      activationPoint, 
      baseFee.periodFrequency, 
      baseFee.cliffFeeNumerator, 
      baseFee.reductionFactor
    );
  
  // Calculate period
  let periodDecimal: Decimal;
  if (currentPointDecimal.lt(activationPointDecimal)) {
    // Before activation point, use max period (min fee)
    periodDecimal = new Decimal(baseFee.numberOfPeriod);
  } else {
    // Calculate elapsed periods
    periodDecimal = currentPointDecimal.sub(activationPointDecimal)
      .div(periodFrequencyDecimal)
      .floor();
    
    // Cap at max number of periods
    if (periodDecimal.gt(new Decimal(baseFee.numberOfPeriod))) {
      periodDecimal = new Decimal(baseFee.numberOfPeriod);
    }
  }

  const feeSchedulerMode = baseFee.feeSchedulerMode;

  if (feeSchedulerMode === FeeSchedulerMode.Linear) {
    // Calculate with Decimal.js in one operation
    const feeNumeratorDecimal = cliffFeeNumeratorDecimal.sub(
      periodDecimal.mul(reductionFactorDecimal)
    );
    
    // Convert back to BN
    return decimalToBN(feeNumeratorDecimal, Rounding.Down);
  } else if (feeSchedulerMode === FeeSchedulerMode.Exponential) {
    // For exponential mode, use the optimized getFeeInPeriod function
    return getFeeInPeriod(
      baseFee.cliffFeeNumerator,
      baseFee.reductionFactor,
      periodDecimal.toNumber()
    );
  } else {
    throw new Error("Invalid fee scheduler mode");
  }
}

/**
 * Get fee on amount
 * @param amount Amount
 * @param poolFees Pool fees
 * @param isReferral Whether referral is used
 * @param currentPoint Current point
 * @param activationPoint Activation point
 * @returns Fee on amount result
 */
export function getFeeOnAmount(
  amount: BN,
  poolFees: {
    baseFee: {
      cliffFeeNumerator: BN;
      feeSchedulerMode: number;
      numberOfPeriod: number;
      periodFrequency: BN;
      reductionFactor: BN;
    };
    protocolFeePercent: number;
    referralFeePercent: number;
    dynamicFee: {
      initialized: number;
      maxVolatilityAccumulator: number;
      variableFeeControl: number;
      binStep: number;
      filterPeriod: number;
      decayPeriod: number;
      reductionFactor: number;
      lastUpdateTimestamp: BN;
      binStepU128: BN;
      sqrtPriceReference: BN;
      volatilityAccumulator: BN;
      volatilityReference: BN;
    };
  },
  isReferral: boolean,
  currentPoint: BN,
  activationPoint: BN
): FeeOnAmountResult {
  // Get total trading fee
  const baseFeeNumerator = getCurrentBaseFeeNumerator(
    poolFees.baseFee,
    currentPoint,
    activationPoint
  );

  // Add dynamic fee if enabled
  let totalFeeNumerator = baseFeeNumerator;
  if (poolFees.dynamicFee.initialized !== 0) {
    const variableFee = getVariableFee(poolFees.dynamicFee);
    totalFeeNumerator = SafeMath.add(totalFeeNumerator, variableFee);
  }

  // Cap at MAX_FEE_NUMERATOR
  if (totalFeeNumerator.gt(new BN(MAX_FEE_NUMERATOR))) {
    totalFeeNumerator = new BN(MAX_FEE_NUMERATOR);
  }

  // Calculate trading fee
  const tradingFee = safeMulDivCastU64(
    amount,
    totalFeeNumerator,
    new BN(FEE_DENOMINATOR),
    Rounding.Up
  );

  // Update amount
  const amountAfterFee = SafeMath.sub(amount, tradingFee);

  // Calculate protocol fee
  const protocolFee = safeMulDivCastU64(
    tradingFee,
    new BN(poolFees.protocolFeePercent),
    new BN(100),
    Rounding.Down
  );

  // Update trading fee
  const tradingFeeAfterProtocol = SafeMath.sub(tradingFee, protocolFee);

  // Calculate referral fee
  let referralFee = new BN(0);
  if (isReferral) {
    referralFee = safeMulDivCastU64(
      protocolFee,
      new BN(poolFees.referralFeePercent),
      new BN(100),
      Rounding.Down
    );
  }

  // Update protocol fee
  const protocolFeeAfterReferral = SafeMath.sub(protocolFee, referralFee);

  return {
    amount: amountAfterFee,
    tradingFee: tradingFeeAfterProtocol,
    protocolFee: protocolFeeAfterReferral,
    referralFee,
  };
}

/**
 * Get variable fee from dynamic fee
 * @param dynamicFee Dynamic fee parameters
 * @returns Variable fee
 */
export function getVariableFee(dynamicFee: {
  initialized: number;
  maxVolatilityAccumulator: number;
  variableFeeControl: number;
  binStep: number;
  filterPeriod: number;
  decayPeriod: number;
  reductionFactor: number;
  lastUpdateTimestamp: BN;
  binStepU128: BN;
  sqrtPriceReference: BN;
  volatilityAccumulator: BN;
  volatilityReference: BN;
}): BN {
  // Early return if not initialized
  if (dynamicFee.initialized === 0) {
    return new BN(0);
  }

  // Early return if volatility accumulator is zero
  if (dynamicFee.volatilityAccumulator.isZero()) {
    return new BN(0);
  }

  // Convert to Decimal for higher precision
  const volatilityAccumulatorDecimal = bnToDecimal(dynamicFee.volatilityAccumulator);
  const binStepDecimal = new Decimal(dynamicFee.binStep);
  const variableFeeControlDecimal = new Decimal(dynamicFee.variableFeeControl);
  
  // Batch operations in Decimal
  // Calculate (volatilityAccumulator * binStep)^2 * variableFeeControl
  const volatilityTimesBinStep = volatilityAccumulatorDecimal.mul(binStepDecimal);
  const vFee = volatilityTimesBinStep.pow(2).mul(variableFeeControlDecimal);
  
  // Scale down to 1e9 unit with ceiling
  const scaleFactor = new Decimal(100_000_000_000);
  const scaledVFee = vFee.add(scaleFactor.sub(new Decimal(1))).div(scaleFactor).floor();
  
  // Convert back to BN
  return decimalToBN(scaledVFee, Rounding.Down);
}
