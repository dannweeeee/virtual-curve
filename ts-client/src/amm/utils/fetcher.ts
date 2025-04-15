import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { ConfigState, PoolState } from "../types";

/**
 * Fetches the virtual pool account data directly from the connection.
 * This bypasses Anchor's account fetching which can sometimes fail in tests.
 * @param connection Solana connection
 * @param program Anchor program
 * @param poolAddress Public key of the pool to fetch
 * @returns The decoded pool state or null if not found
 */
export async function fetchVirtualPool(
  connection: Connection,
  program: Program<any>,
  poolAddress: PublicKey
): Promise<PoolState | null> {
  try {
    // Fetch account data directly
    const accountInfo = await connection.getAccountInfo(poolAddress);
    if (!accountInfo || !accountInfo.data || accountInfo.data.length === 0) {
      console.warn(`No account data found for pool: ${poolAddress.toString()}`);
      return null;
    }

    // Decode the account data using the program coder
    try {
      return program.coder.accounts.decode("virtualPool", accountInfo.data);
    } catch (e) {
      console.error("Failed to decode pool account data:", e);
      return null;
    }
  } catch (error) {
    console.error("Error fetching virtual pool:", error);
    return null;
  }
}

/**
 * Fetches the config account data first using direct connection, then falls back to AnchorProvider if that fails.
 * @param connection Solana connection
 * @param program Anchor program
 * @param configAddress Public key of the config to fetch
 * @returns The decoded config state or null if not found
 */
export async function fetchPoolConfig(
  connection: Connection,
  program: Program<any>,
  configAddress: PublicKey
): Promise<ConfigState | null> {
  try {
    // First attempt: Fetch account data directly through connection
    const accountInfo = await connection.getAccountInfo(configAddress);
    if (accountInfo && accountInfo.data && accountInfo.data.length > 0) {
      try {
        const decodedData = program.coder.accounts.decode(
          "poolConfig",
          accountInfo.data
        );
        console.log("Successfully fetched config via direct connection");
        return decodedData;
      } catch (e) {
        console.warn(
          "Failed to decode config account data via direct connection, trying provider next..."
        );
      }
    } else {
      console.warn(
        `No account data found via direct connection for config: ${configAddress.toString()}, trying provider next...`
      );
    }

    // Second attempt: Try using AnchorProvider if available
    if (program.provider && program.provider instanceof AnchorProvider) {
      try {
        console.log("Attempting to fetch config using AnchorProvider...");
        // Use program's account namespace with a type assertion
        const config = await (program.account as any).poolConfig.fetch(
          configAddress
        );
        console.log("Successfully fetched config via AnchorProvider");
        return config as ConfigState;
      } catch (providerError) {
        console.error(
          "Failed to fetch config using AnchorProvider:",
          providerError
        );
      }
    } else {
      console.warn("No AnchorProvider available for fallback fetch");
    }

    return null;
  } catch (error) {
    console.error("Error fetching config:", error);
    return null;
  }
}
