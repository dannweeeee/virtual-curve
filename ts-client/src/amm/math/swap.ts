import BN from "bn.js";
import Decimal from "decimal.js";
import { SafeMath } from "./safeMath";
import { MAX_CURVE_POINT } from "./constants";
import {
  getDeltaAmountBaseUnsigned,
  getDeltaAmountQuoteUnsigned,
  getNextSqrtPriceFromInput,
} from "./curve";
import { FeeMode, FeeOnAmountResult, getFeeOnAmount } from "./feeMath";
import { Rounding, bnToDecimal, decimalToBN, batchBnToDecimal } from "./utilsMath";

/**
 * Trade direction
 */
export enum TradeDirection {
  BaseToQuote = 0,
  QuoteToBase = 1,
}

/**
 * Swap amount result
 */
export interface SwapAmount {
  outputAmount: BN;
  nextSqrtPrice: BN;
}

/**
 * Swap result
 */
export interface SwapResult {
  actualInputAmount: BN;
  outputAmount: BN;
  nextSqrtPrice: BN;
  tradingFee: BN;
  protocolFee: BN;
  referralFee: BN;
}

/**
 * Get swap result
 * @param poolState Pool state
 * @param configState Config state
 * @param amountIn Input amount
 * @param feeMode Fee mode
 * @param tradeDirection Trade direction
 * @param currentPoint Current point
 * @returns Swap result
 */
export function getSwapResult(
  poolState: {
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
    };
    sqrtPrice: BN;
    activationPoint: BN;
  },
  configState: {
    curve: Array<{
      sqrtPrice: BN;
      liquidity: BN;
    }>;
  },
  amountIn: BN,
  feeMode: FeeMode,
  tradeDirection: TradeDirection,
  currentPoint: BN
): SwapResult {
  let actualProtocolFee = new BN(0);
  let actualTradingFee = new BN(0);
  let actualReferralFee = new BN(0);

  // Apply fees on input if needed
  let actualAmountIn: BN;
  if (feeMode.feesOnInput) {
    const feeResult: FeeOnAmountResult = getFeeOnAmount(
      amountIn,
      poolState.poolFees,
      feeMode.hasReferral,
      currentPoint,
      poolState.activationPoint
    );

    actualProtocolFee = feeResult.protocolFee;
    actualTradingFee = feeResult.tradingFee;
    actualReferralFee = feeResult.referralFee;
    actualAmountIn = feeResult.amount;
  } else {
    actualAmountIn = amountIn;
  }

  // Calculate swap amount
  const swapAmount: SwapAmount =
    tradeDirection === TradeDirection.BaseToQuote
      ? getSwapAmountFromBaseToQuote(
          configState,
          poolState.sqrtPrice,
          actualAmountIn
        )
      : getSwapAmountFromQuoteToBase(
          configState,
          poolState.sqrtPrice,
          actualAmountIn
        );

  // Apply fees on output if needed
  let actualAmountOut: BN;
  if (feeMode.feesOnInput) {
    actualAmountOut = swapAmount.outputAmount;
  } else {
    const feeResult: FeeOnAmountResult = getFeeOnAmount(
      swapAmount.outputAmount,
      poolState.poolFees,
      feeMode.hasReferral,
      currentPoint,
      poolState.activationPoint
    );

    actualProtocolFee = feeResult.protocolFee;
    actualTradingFee = feeResult.tradingFee;
    actualReferralFee = feeResult.referralFee;
    actualAmountOut = feeResult.amount;
  }

  return {
    actualInputAmount: actualAmountIn,
    outputAmount: actualAmountOut,
    nextSqrtPrice: swapAmount.nextSqrtPrice,
    tradingFee: actualTradingFee,
    protocolFee: actualProtocolFee,
    referralFee: actualReferralFee,
  };
}

/**
 * Get swap amount from base to quote
 * @param configState Config state
 * @param currentSqrtPrice Current sqrt price
 * @param amountIn Input amount
 * @returns Swap amount
 */
export function getSwapAmountFromBaseToQuote(
  configState: {
    curve: Array<{
      sqrtPrice: BN;
      liquidity: BN;
    }>;
  },
  currentSqrtPrice: BN,
  amountIn: BN
): SwapAmount {
  // Early return for zero amount
  if (amountIn.isZero()) {
    return {
      outputAmount: new BN(0),
      nextSqrtPrice: currentSqrtPrice,
    };
  }

  // Using Decimal.js for tracking total output with higher precision
  let totalOutputAmountDecimal = new Decimal(0);
  let sqrtPrice = currentSqrtPrice;
  let amountLeft = amountIn;

  // Iterate through the curve points in reverse order
  for (let i = MAX_CURVE_POINT - 1; i >= 0; i--) {
    if (i >= configState.curve.length) continue;
    
    if (configState.curve[i].sqrtPrice.lt(sqrtPrice)) {
      // Get the current liquidity
      const currentLiquidity = i + 1 < configState.curve.length 
        ? configState.curve[i + 1].liquidity 
        : configState.curve[i].liquidity;
      
      // Skip if liquidity is zero
      if (currentLiquidity.isZero()) continue;
      
      const maxAmountIn = getDeltaAmountBaseUnsigned(
        configState.curve[i].sqrtPrice,
        sqrtPrice,
        currentLiquidity,
        Rounding.Up
      );

      if (amountLeft.lt(maxAmountIn)) {
        const nextSqrtPrice = getNextSqrtPriceFromInput(
          sqrtPrice,
          currentLiquidity,
          amountLeft,
          true
        );

        const outputAmount = getDeltaAmountQuoteUnsigned(
          nextSqrtPrice,
          sqrtPrice,
          currentLiquidity,
          Rounding.Down
        );

        // Add to total using Decimal.js
        totalOutputAmountDecimal = totalOutputAmountDecimal.add(bnToDecimal(outputAmount));
        sqrtPrice = nextSqrtPrice;
        amountLeft = new BN(0);
        break;
      } else {
        const nextSqrtPrice = configState.curve[i].sqrtPrice;
        const outputAmount = getDeltaAmountQuoteUnsigned(
          nextSqrtPrice,
          sqrtPrice,
          currentLiquidity,
          Rounding.Down
        );

        // Add to total using Decimal.js
        totalOutputAmountDecimal = totalOutputAmountDecimal.add(bnToDecimal(outputAmount));
        sqrtPrice = nextSqrtPrice;
        amountLeft = SafeMath.sub(amountLeft, maxAmountIn);
      }
    }
  }

  // Process remaining amount
  if (!amountLeft.isZero() && !configState.curve[0].liquidity.isZero()) {
    const nextSqrtPrice = getNextSqrtPriceFromInput(
      sqrtPrice,
      configState.curve[0].liquidity,
      amountLeft,
      true
    );

    const outputAmount = getDeltaAmountQuoteUnsigned(
      nextSqrtPrice,
      sqrtPrice,
      configState.curve[0].liquidity,
      Rounding.Down
    );

    // Add to total using Decimal.js
    totalOutputAmountDecimal = totalOutputAmountDecimal.add(bnToDecimal(outputAmount));
    sqrtPrice = nextSqrtPrice;
  }

  // Convert final Decimal result back to BN
  const totalOutputAmount = decimalToBN(totalOutputAmountDecimal, Rounding.Down);

  return {
    outputAmount: totalOutputAmount,
    nextSqrtPrice: sqrtPrice,
  };
}

/**
 * Get swap amount from quote to base
 * @param configState Config state
 * @param currentSqrtPrice Current sqrt price
 * @param amountIn Input amount
 * @returns Swap amount
 * @throws Error if not enough liquidity
 */
export function getSwapAmountFromQuoteToBase(
  configState: {
    curve: Array<{
      sqrtPrice: BN;
      liquidity: BN;
    }>;
  },
  currentSqrtPrice: BN,
  amountIn: BN
): SwapAmount {
  // Early return for zero amount
  if (amountIn.isZero()) {
    return {
      outputAmount: new BN(0),
      nextSqrtPrice: currentSqrtPrice,
    };
  }

  // Using Decimal.js for tracking total output with higher precision
  let totalOutputAmountDecimal = new Decimal(0);
  let sqrtPrice = currentSqrtPrice;
  let amountLeft = amountIn;

  // Iterate through the curve points
  for (let i = 0; i < MAX_CURVE_POINT; i++) {
    if (i >= configState.curve.length) continue;
    
    // Skip if liquidity is zero
    if (configState.curve[i].liquidity.isZero()) continue;
    
    if (configState.curve[i].sqrtPrice.gt(sqrtPrice)) {
      const maxAmountIn = getDeltaAmountQuoteUnsigned(
        sqrtPrice,
        configState.curve[i].sqrtPrice,
        configState.curve[i].liquidity,
        Rounding.Up
      );

      if (amountLeft.lt(maxAmountIn)) {
        const nextSqrtPrice = getNextSqrtPriceFromInput(
          sqrtPrice,
          configState.curve[i].liquidity,
          amountLeft,
          false
        );

        const outputAmount = getDeltaAmountBaseUnsigned(
          sqrtPrice,
          nextSqrtPrice,
          configState.curve[i].liquidity,
          Rounding.Down
        );

        // Add to total using Decimal.js
        totalOutputAmountDecimal = totalOutputAmountDecimal.add(bnToDecimal(outputAmount));
        sqrtPrice = nextSqrtPrice;
        amountLeft = new BN(0);
        break;
      } else {
        const nextSqrtPrice = configState.curve[i].sqrtPrice;
        const outputAmount = getDeltaAmountBaseUnsigned(
          sqrtPrice,
          nextSqrtPrice,
          configState.curve[i].liquidity,
          Rounding.Down
        );

        // Add to total using Decimal.js
        totalOutputAmountDecimal = totalOutputAmountDecimal.add(bnToDecimal(outputAmount));
        sqrtPrice = nextSqrtPrice;
        amountLeft = SafeMath.sub(amountLeft, maxAmountIn);
      }
    }
  }

  // Check if all amount was processed
  if (!amountLeft.isZero()) {
    throw new Error("Not enough liquidity to process the entire amount");
  }

  // Convert final Decimal result back to BN
  const totalOutputAmount = decimalToBN(totalOutputAmountDecimal, Rounding.Down);

  return {
    outputAmount: totalOutputAmount,
    nextSqrtPrice: sqrtPrice,
  };
}

/**
 * Get fee mode
 * @param collectFeeMode Collect fee mode
 * @param tradeDirection Trade direction
 * @param hasReferral Whether referral is used
 * @returns Fee mode
 */
export function getFeeMode(
  collectFeeMode: number,
  tradeDirection: TradeDirection,
  hasReferral: boolean
): FeeMode {
  let feesOnInput: boolean;
  let feesOnBaseToken: boolean;

  if (collectFeeMode === 0) { // QuoteToken
    if (tradeDirection === TradeDirection.BaseToQuote) {
      feesOnInput = false;
      feesOnBaseToken = false;
    } else {
      feesOnInput = true;
      feesOnBaseToken = false;
    }
  } else if (collectFeeMode === 1) { // OutputToken
    if (tradeDirection === TradeDirection.BaseToQuote) {
      feesOnInput = false;
      feesOnBaseToken = false;
    } else {
      feesOnInput = false;
      feesOnBaseToken = true;
    }
  } else {
    throw new Error("Invalid collect fee mode");
  }

  return {
    feesOnInput,
    feesOnBaseToken,
    hasReferral,
  };
}
