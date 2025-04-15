import BN from "bn.js";
import Decimal from "decimal.js";
import { SafeMath } from "./safeMath";
import { Rounding, mulDiv, bnToDecimal, decimalToBN, batchBnToDecimal } from "./utilsMath";
import { RESOLUTION } from "./constants";

/**
 * Gets the delta amount_base for given liquidity and price range
 * Formula: Δa = L * (1 / √P_lower - 1 / √P_upper)
 * i.e. L * (√P_upper - √P_lower) / (√P_upper * √P_lower)
 * @param lowerSqrtPrice Lower sqrt price
 * @param upperSqrtPrice Upper sqrt price
 * @param liquidity Liquidity
 * @param round Rounding direction
 * @returns Delta amount base
 */
export function getDeltaAmountBaseUnsigned(
  lowerSqrtPrice: BN,
  upperSqrtPrice: BN,
  liquidity: BN,
  round: Rounding
): BN {
  // Skip calculation for zero liquidity
  if (liquidity.isZero()) {
    return new BN(0);
  }

  // Convert to Decimal for higher precision in one batch
  const [lowerSqrtPriceDecimal, upperSqrtPriceDecimal, liquidityDecimal] = 
    batchBnToDecimal(lowerSqrtPrice, upperSqrtPrice, liquidity);

  // Batch operations in Decimal
  const numerator = upperSqrtPriceDecimal.sub(lowerSqrtPriceDecimal);
  const denominator = lowerSqrtPriceDecimal.mul(upperSqrtPriceDecimal);

  if (denominator.isZero()) {
    throw new Error("Denominator cannot be zero");
  }

  // Calculate with Decimal.js in one operation
  const result = liquidityDecimal.mul(numerator).div(denominator);
  
  // Convert back to BN with appropriate rounding
  return decimalToBN(result, round);
}

/**
 * Gets the delta amount_quote for given liquidity and price range
 * Formula: Δb = L (√P_upper - √P_lower)
 * @param lowerSqrtPrice Lower sqrt price
 * @param upperSqrtPrice Upper sqrt price
 * @param liquidity Liquidity
 * @param round Rounding direction
 * @returns Delta amount quote
 */
export function getDeltaAmountQuoteUnsigned(
  lowerSqrtPrice: BN,
  upperSqrtPrice: BN,
  liquidity: BN,
  round: Rounding
): BN {
  // Skip calculation for zero liquidity
  if (liquidity.isZero()) {
    return new BN(0);
  }

  // Convert to Decimal for higher precision in one batch
  const [lowerSqrtPriceDecimal, upperSqrtPriceDecimal, liquidityDecimal] = 
    batchBnToDecimal(lowerSqrtPrice, upperSqrtPrice, liquidity);

  // Batch operations in Decimal
  const deltaSqrtPrice = upperSqrtPriceDecimal.sub(lowerSqrtPriceDecimal);
  const denominator = new Decimal(2).pow(RESOLUTION * 2);
  
  // Calculate with Decimal.js in one operation
  const result = liquidityDecimal.mul(deltaSqrtPrice).div(denominator);
  
  // Convert back to BN with appropriate rounding
  return decimalToBN(result, round);
}

/**
 * Gets the next sqrt price given an input amount of token_a or token_b
 * @param sqrtPrice Current sqrt price
 * @param liquidity Liquidity
 * @param amountIn Input amount
 * @param baseForQuote Whether the input is base token for quote token
 * @returns Next sqrt price
 */
export function getNextSqrtPriceFromInput(
  sqrtPrice: BN,
  liquidity: BN,
  amountIn: BN,
  baseForQuote: boolean
): BN {
  if (sqrtPrice.isZero() || liquidity.isZero()) {
    throw new Error("Price or liquidity cannot be zero");
  }

  // Round off to make sure that we don't pass the target price
  if (baseForQuote) {
    return getNextSqrtPriceFromAmountBaseRoundingUp(
      sqrtPrice,
      liquidity,
      amountIn
    );
  } else {
    return getNextSqrtPriceFromAmountQuoteRoundingDown(
      sqrtPrice,
      liquidity,
      amountIn
    );
  }
}

/**
 * Gets the next sqrt price from amount base rounding up
 * Formula: √P' = √P * L / (L + Δx * √P)
 * @param sqrtPrice Current sqrt price
 * @param liquidity Liquidity
 * @param amount Input amount
 * @returns Next sqrt price
 */
export function getNextSqrtPriceFromAmountBaseRoundingUp(
  sqrtPrice: BN,
  liquidity: BN,
  amount: BN
): BN {
  // Early return for zero amount
  if (amount.isZero()) {
    return sqrtPrice;
  }

  // Convert to Decimal for higher precision in one batch
  const [sqrtPriceDecimal, liquidityDecimal, amountDecimal] = 
    batchBnToDecimal(sqrtPrice, liquidity, amount);

  // Batch operations in Decimal
  const product = amountDecimal.mul(sqrtPriceDecimal);
  const denominator = liquidityDecimal.add(product);
  
  // Calculate with Decimal.js in one operation
  const result = liquidityDecimal.mul(sqrtPriceDecimal).div(denominator);
  
  // Convert back to BN with ceiling rounding
  return decimalToBN(result, Rounding.Up);
}

/**
 * Gets the next sqrt price given a delta of token_quote
 * Formula: √P' = √P + Δy / L
 * @param sqrtPrice Current sqrt price
 * @param liquidity Liquidity
 * @param amount Input amount
 * @returns Next sqrt price
 */
export function getNextSqrtPriceFromAmountQuoteRoundingDown(
  sqrtPrice: BN,
  liquidity: BN,
  amount: BN
): BN {
  // Early return for zero amount
  if (amount.isZero()) {
    return sqrtPrice;
  }

  // Convert to Decimal for higher precision in one batch
  const [sqrtPriceDecimal, liquidityDecimal, amountDecimal] = 
    batchBnToDecimal(sqrtPrice, liquidity, amount);

  // Batch operations in Decimal
  const scaleFactor = new Decimal(2).pow(RESOLUTION * 2);
  
  // Calculate with Decimal.js in one operation
  const result = sqrtPriceDecimal.add(
    amountDecimal.mul(scaleFactor).div(liquidityDecimal)
  );
  
  // Convert back to BN with floor rounding
  return decimalToBN(result, Rounding.Down);
}

/**
 * Gets the initial liquidity from delta quote
 * Formula: L = Δb / (√P_upper - √P_lower)
 * @param quoteAmount Quote amount
 * @param sqrtMinPrice Minimum sqrt price
 * @param sqrtPrice Current sqrt price
 * @returns Initial liquidity
 */
export function getInitialLiquidityFromDeltaQuote(
  quoteAmount: BN,
  sqrtMinPrice: BN,
  sqrtPrice: BN
): BN {
  const priceDelta = SafeMath.sub(sqrtPrice, sqrtMinPrice);
  const quoteAmountShifted = SafeMath.shl(quoteAmount, 128);

  return SafeMath.div(quoteAmountShifted, priceDelta);
}

/**
 * Gets the initialize amounts
 * @param sqrtMinPrice Minimum sqrt price
 * @param sqrtMaxPrice Maximum sqrt price
 * @param sqrtPrice Current sqrt price
 * @param liquidity Liquidity
 * @returns [base amount, quote amount]
 */
export function getInitializeAmounts(
  sqrtMinPrice: BN,
  sqrtMaxPrice: BN,
  sqrtPrice: BN,
  liquidity: BN
): [BN, BN] {
  // BASE TOKEN
  const amountBase = getDeltaAmountBaseUnsigned(
    sqrtPrice,
    sqrtMaxPrice,
    liquidity,
    Rounding.Up
  );

  // QUOTE TOKEN
  const amountQuote = getDeltaAmountQuoteUnsigned(
    sqrtMinPrice,
    sqrtPrice,
    liquidity,
    Rounding.Up
  );

  return [amountBase, amountQuote];
}
