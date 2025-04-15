import { Connection, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "../constants";
import { Program } from "@coral-xyz/anchor";

/**
 * Derive the pool authority address
 * @returns The pool authority public key
 */
export function derivePoolAuthority(): PublicKey {
  const [poolAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("pool_authority")],
    PROGRAM_ID
  );
  return poolAuthority;
}

/**
 * Derive the pool address
 * @param config The configuration public key
 * @param baseMint The base mint public key
 * @param quoteMint The quote mint public key
 * @returns The pool public key
 */
export function derivePoolAddress(
  config: PublicKey,
  baseMint: PublicKey,
  quoteMint: PublicKey
): PublicKey {
  console.log("derivePoolAddress inputs:");
  console.log("config:", config.toString());
  console.log("baseMint:", baseMint.toString());
  console.log("quoteMint:", quoteMint.toString());

  // Directly compare the PublicKeys as the Rust program does
  const baseBuffer = baseMint.toBuffer();
  const quoteBuffer = quoteMint.toBuffer();

  // Determine max and min keys using Buffer.compare
  // If baseBuffer > quoteBuffer, baseBuffer is max, quoteBuffer is min
  // Otherwise, quoteBuffer is max, baseBuffer is min
  const isBaseGreater = Buffer.compare(baseBuffer, quoteBuffer) > 0;
  const maxMintKey = isBaseGreater ? baseMint : quoteMint;
  const minMintKey = isBaseGreater ? quoteMint : baseMint;

  console.log("minKey:", minMintKey.toString());
  console.log("maxKey:", maxMintKey.toString());

  const [pool] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("pool"),
      config.toBuffer(),
      maxMintKey.toBuffer(),
      minMintKey.toBuffer(),
    ],
    PROGRAM_ID
  );

  console.log("derived poolAddress:", pool.toString());
  return pool;
}

/**
 * Derive the token vault address
 * @param mint The mint public key
 * @param pool The pool public key
 * @returns The token vault public key
 */
export function deriveTokenVaultAddress(
  mint: PublicKey,
  pool: PublicKey
): PublicKey {
  const [tokenVault] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault"), mint.toBuffer(), pool.toBuffer()],
    PROGRAM_ID
  );
  return tokenVault;
}

/**
 * Derive the metadata account address
 * @param mint The mint public key
 * @returns The metadata account public key
 */
export function deriveMetadataAccount(mint: PublicKey): PublicKey {
  const METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const [metadataAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID
  );
  return metadataAccount;
}

/**
 * Utility function to fetch and decode config account data
 * @param connection Solana connection
 * @param program Anchor program
 * @param configAddress Public key of the config to fetch
 * @returns The decoded config state or null if not found
 */
export async function deriveTokenAccount(
  connection: Connection,
  program: Program<any>,
  configAddress: any
): Promise<{ tokenType: number }> {
  try {
    // First try the normal Anchor method
    return await (program.account as any).config.fetch(configAddress);
  } catch (error) {
    // If that fails, try direct account fetching and decoding
    try {
      const accountInfo = await connection.getAccountInfo(configAddress);
      if (!accountInfo) {
        throw new Error("Config account not found");
      }
      // Skip the 8-byte discriminator and try to decode
      return program.coder.accounts.decode("poolConfig", accountInfo.data);
    } catch (fallbackError) {
      console.warn(
        "Failed to fetch config state, using default tokenType=0:",
        fallbackError
      );
      // Return a default config state as fallback
      return { tokenType: 0 };
    }
  }
}
