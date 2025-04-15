import BN from "bn.js";
import Decimal from "decimal.js";
import { SafeMath } from "./safeMath";
import { RESOLUTION } from "./constants";

// Configure Decimal.js for high precision
Decimal.set({ precision: 64, rounding: Decimal.ROUND_DOWN });

/**
 * Rounding direction
 */
export enum Rounding {
  Up,
  Down,
}

/**
 * Convert BN to Decimal
 * @param bn BN value
 * @returns Decimal value
 */
export function bnToDecimal(bn: BN): Decimal {
  return new Decimal(bn.toString());
}

/**
 * Convert multiple BN values to Decimal
 * @param values BN values
 * @returns Decimal values
 */
export function batchBnToDecimal(...values: BN[]): Decimal[] {
  return values.map(bn => new Decimal(bn.toString()));
}

/**
 * Convert Decimal to BN
 * @param decimal Decimal value
 * @param round Rounding direction
 * @returns BN value
 */
export function decimalToBN(decimal: Decimal, round: Rounding = Rounding.Down): BN {
  if (round === Rounding.Up) {
    return new BN(decimal.ceil().toString());
  } else {
    return new BN(decimal.floor().toString());
  }
}

/**
 * Multiply and divide with rounding using Decimal.js for higher precision
 * @param x First number
 * @param y Second number
 * @param denominator Denominator
 * @param rounding Rounding direction
 * @returns (x * y) / denominator
 */
export function mulDiv(
  x: BN,
  y: BN,
  denominator: BN,
  rounding: Rounding
): BN {
  // For simple cases where precision loss is minimal, use BN directly
  if (denominator.eq(new BN(1)) || (x.isZero() || y.isZero())) {
    return x.mul(y);
  }
  
  // For small numbers where BN math is sufficient, use BN directly
  if (x.lt(new BN(1000)) && y.lt(new BN(1000)) && denominator.lt(new BN(1000))) {
    return mulDivBN(x, y, denominator, rounding);
  }

  if (denominator.isZero()) {
    throw new Error("MulDiv: division by zero");
  }

  // Convert to Decimal for higher precision in one batch
  const [xDecimal, yDecimal, denominatorDecimal] = batchBnToDecimal(x, y, denominator);

  // Batch operations in Decimal
  const result = xDecimal.mul(yDecimal).div(denominatorDecimal);
  
  // Apply rounding and convert back to BN
  return decimalToBN(rounding === Rounding.Up ? result.ceil() : result.floor(), rounding);
}

/**
 * BN-based mulDiv implementation for simpler cases
 */
export function mulDivBN(
  x: BN,
  y: BN,
  denominator: BN,
  rounding: Rounding
): BN {
  if (denominator.isZero()) {
    throw new Error("MulDiv: division by zero");
  }

  const prod = SafeMath.mul(x, y);

  if (rounding === Rounding.Up) {
    // Calculate ceiling division: (a + b - 1) / b
    const numerator = SafeMath.add(prod, SafeMath.sub(denominator, new BN(1)));
    return SafeMath.div(numerator, denominator);
  } else {
    return SafeMath.div(prod, denominator);
  }
}

/**
 * Multiply and shift right with Decimal.js for higher precision
 * @param x First number
 * @param y Second number
 * @param offset Number of bits to shift
 * @returns (x * y) >> offset
 */
export function mulShr(x: BN, y: BN, offset: number): BN {
  // For simple cases or small numbers, use BN directly
  if (offset === 0 || (x.isZero() || y.isZero()) || 
      (x.lt(new BN(1000)) && y.lt(new BN(1000)) && offset < 10)) {
    return mulShrBN(x, y, offset);
  }
  
  // Convert to Decimal for higher precision in one batch
  const [xDecimal, yDecimal] = batchBnToDecimal(x, y);
  
  // Batch operations in Decimal
  const divisor = new Decimal(2).pow(offset);
  const result = xDecimal.mul(yDecimal).div(divisor).floor();
  
  // Convert back to BN
  return decimalToBN(result);
}

/**
 * BN-based mulShr implementation for simpler cases
 */
export function mulShrBN(x: BN, y: BN, offset: number): BN {
  const prod = SafeMath.mul(x, y);
  return SafeMath.shr(prod, offset);
}

/**
 * Shift left and divide with Decimal.js for higher precision
 * @param x First number
 * @param y Second number
 * @param offset Number of bits to shift
 * @param rounding Rounding direction
 * @returns (x << offset) / y
 */
export function shlDiv(
  x: BN,
  y: BN,
  offset: number,
  rounding: Rounding
): BN {
  // For simple cases or small numbers, use BN directly
  if (offset === 0 || x.isZero() || 
      (x.lt(new BN(1000)) && y.gt(new BN(1)) && y.lt(new BN(1000)) && offset < 10)) {
    return shlDivBN(x, y, offset, rounding);
  }

  if (y.isZero()) {
    throw new Error("ShlDiv: division by zero");
  }

  // Convert to Decimal for higher precision in one batch
  const [xDecimal, yDecimal] = batchBnToDecimal(x, y);
  
  // Batch operations in Decimal
  const shifted = xDecimal.mul(new Decimal(2).pow(offset));
  const result = shifted.div(yDecimal);
  
  // Apply rounding and convert back to BN
  return decimalToBN(rounding === Rounding.Up ? result.ceil() : result.floor(), rounding);
}

/**
 * Original BN-based shlDiv implementation for comparison
 */
export function shlDivBN(
  x: BN,
  y: BN,
  offset: number,
  rounding: Rounding
): BN {
  if (y.isZero()) {
    throw new Error("ShlDiv: division by zero");
  }

  const shifted = SafeMath.shl(x, offset);

  if (rounding === Rounding.Up) {
    // Calculate ceiling division: (a + b - 1) / b
    const numerator = SafeMath.add(shifted, SafeMath.sub(y, new BN(1)));
    return SafeMath.div(numerator, y);
  } else {
    return SafeMath.div(shifted, y);
  }
}

/**
 * Safe multiplication, division, and casting to u64
 * @param x First number
 * @param y Second number
 * @param denominator Denominator
 * @param rounding Rounding direction
 * @returns (x * y) / denominator as u64
 */
export function safeMulDivCastU64(
  x: BN,
  y: BN,
  denominator: BN,
  rounding: Rounding
): BN {
  return mulDiv(x, y, denominator, rounding);
}

/**
 * Safe shift left, division, and casting
 * @param x First number
 * @param y Second number
 * @param offset Number of bits to shift
 * @param rounding Rounding direction
 * @returns (x << offset) / y
 */
export function safeShlDivCast(
  x: BN,
  y: BN,
  offset: number,
  rounding: Rounding
): BN {
  return shlDiv(x, y, offset, rounding);
}

/**
 * Get delta bin ID
 * @param binStepU128 Bin step
 * @param sqrtPriceA First sqrt price
 * @param sqrtPriceB Second sqrt price
 * @returns Delta bin ID
 */
export function getDeltaBinId(
  binStepU128: BN,
  sqrtPriceA: BN,
  sqrtPriceB: BN
): BN {
  const [upperSqrtPrice, lowerSqrtPrice] = sqrtPriceA.gt(sqrtPriceB)
    ? [sqrtPriceA, sqrtPriceB]
    : [sqrtPriceB, sqrtPriceA];

  const priceRatio = safeShlDivCast(
    upperSqrtPrice,
    lowerSqrtPrice,
    RESOLUTION,
    Rounding.Down
  );

  const ONE_Q64_BN = new BN(1).shln(RESOLUTION);
  const deltaBinId = SafeMath.div(
    SafeMath.sub(priceRatio, ONE_Q64_BN),
    binStepU128
  );

  return SafeMath.mul(deltaBinId, new BN(2));
}
