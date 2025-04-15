import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export const PROGRAM_ID = new PublicKey(
  "virEFLZsQm1iFAs8py1XnziJ67gTzW2bfCWhxNPfccD"
);

export const METAPLEX_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Program constants
export const MIN_SQRT_PRICE = new BN("4295048016");
export const MAX_SQRT_PRICE = new BN("79226673521066979257578248091");
export const U64_MAX = new BN("18446744073709551615");
export const BASIS_POINT_MAX = 10000;
export const MAX_CURVE_POINT = 20;
