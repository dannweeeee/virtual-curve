import { PublicKey, Transaction, Keypair } from "@solana/web3.js";
import BN from "bn.js";

/**
 * Configuration for the Virtual Curve liquidity pool
 */
export interface CreateConfigParams {
  owner: PublicKey;
  feeClaimer: PublicKey;
  quoteMint: PublicKey;
  instructionParams: ConfigParameters;
}

/**
 * Base fee parameters
 */
export interface BaseFee {
  cliffFeeNumerator: BN;
  numberOfPeriod: number;
  periodFrequency: BN;
  reductionFactor: BN;
  feeSchedulerMode: number;
}

/**
 * Dynamic fee parameters
 */
export interface DynamicFee {
  binStep: number;
  binStepU128: BN;
  filterPeriod: number;
  decayPeriod: number;
  reductionFactor: number;
  maxVolatilityAccumulator: number;
  variableFeeControl: number;
}

/**
 * Liquidity distribution parameters
 */
export interface LiquidityDistributionParameters {
  sqrtPrice: BN;
  liquidity: BN;
}

/**
 * Configuration parameters
 */
export interface ConfigParameters {
  poolFees: {
    baseFee: BaseFee;
    dynamicFee: DynamicFee | null;
  };
  collectFeeMode: number;
  migrationOption: number;
  activationType: number;
  tokenType: number;
  tokenDecimal: number;
  migrationQuoteThreshold: BN;
  partnerLpPercentage: number;
  partnerLockedLpPercentage: number;
  creatorLpPercentage: number;
  creatorLockedLpPercentage: number;
  sqrtStartPrice: BN;
  padding: any[];
  curve: Array<LiquidityDistributionParameters>;
}

/**
 * Create pool parameters
 */
export interface CreatePoolParams {
  quoteMint: PublicKey;
  config: PublicKey;
  instructionParams: {
    name: string;
    symbol: string;
    uri: string;
  };
}

/**
 * Swap parameters
 */
export interface SwapParams {
  config: PublicKey;
  pool: PublicKey;
  inputTokenMint: PublicKey;
  outputTokenMint: PublicKey;
  amountIn: BN;
  minimumAmountOut: BN;
  referralTokenAccount?: PublicKey | null;
}

/**
 * Interface for the Virtual Curve client
 */
export interface VirtualCurveClient {
  createConfig(
    params: CreateConfigParams
  ): Promise<{ transaction: Transaction; configKeypair: Keypair }>;
  createPool(
    params: CreatePoolParams
  ): Promise<{ transaction: Transaction; baseMintKeypair: Keypair }>;
  swapQuote(
    params: SwapParams
  ): Promise<{ swapOutAmount: BN; minSwapOutAmount: BN }>;
  swap(params: SwapParams): Promise<Transaction>;
}

/**
 * Interface for the Virtual Curve config state
 */
export interface ConfigState {
  poolFees: {
    baseFee: {
      cliffFeeNumerator: BN;
      feeSchedulerMode: number;
      numberOfPeriod: number;
      periodFrequency: BN;
      reductionFactor: BN;
    };
    dynamicFee: {
      initialized: number;
      maxVolatilityAccumulator: number;
      variableFeeControl: number;
      binStep: number;
      filterPeriod: number;
      decayPeriod: number;
      reductionFactor: number;
      binStepU128: BN;
    };
    protocolFeePercent: number;
    referralFeePercent: number;
  };
  quoteMint: PublicKey;
  feeClaimer: PublicKey;
  owner: PublicKey;
  activationType: number;
  tokenType: number;
  tokenDecimal: number;
  partnerLockedLpPercentage: number;
  partnerLpPercentage: number;
  creatorLockedLpPercentage: number;
  creatorLpPercentage: number;
  curve: Array<{
    sqrtPrice: BN;
    liquidity: BN;
  }>;
  collectFeeMode: number;
}

/**
 * Interface for the Virtual Curve pool state
 */
export interface PoolState {
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
  config: PublicKey;
  creator: PublicKey;
  baseMint: PublicKey;
  baseVault: PublicKey;
  quoteVault: PublicKey;
  baseReserve: BN;
  quoteReserve: BN;
  protocolBaseFee: BN;
  protocolQuoteFee: BN;
  tradingBaseFee: BN;
  tradingQuoteFee: BN;
  sqrtPrice: BN;
  activationPoint: BN;
  poolType: number;
  isMigrated: number;
  isPartnerWithdrawSurplus: number;
  isProcotolWithdrawSurplus: number;
  metrics: {
    totalProtocolBaseFee: BN;
    totalProtocolQuoteFee: BN;
    totalTradingBaseFee: BN;
    totalTradingQuoteFee: BN;
  };
}
