import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";

import { CreatePoolParams } from "../types";
import { METAPLEX_PROGRAM_ID } from "../constants";
import {
  deriveMetadataAccount,
  derivePoolAddress,
  derivePoolAuthority,
  deriveTokenVaultAddress,
} from "../utils/account";
import { fetchPoolConfig } from "../utils/fetcher";

/**
 * Create a new pool
 * @param connection Solana connection
 * @param program Anchor program
 * @param payer Keypair
 * @param params Parameters for creating the pool
 * @returns A promise that resolves to the transaction and baseMint keypair
 */
export async function createPool(
  connection: Connection,
  program: Program<any>,
  payer: Keypair,
  params: CreatePoolParams
): Promise<{ transaction: Transaction; baseMintKeypair: Keypair }> {
  const { quoteMint, config, instructionParams } = params;

  // Get the config state to determine the token type
  let tokenType: number;
  try {
    const configState = await fetchPoolConfig(connection, program, config);
    if (configState?.tokenType === undefined) {
      throw new Error("Config state does not contain tokenType");
    }
    tokenType = configState.tokenType;
  } catch (error) {
    console.error("Failed to fetch config state:", error);
    throw new Error(`Unable to determine token type from config: ${error}`);
  }

  // Generate a new keypair for the base mint
  const baseMintKeypair = Keypair.generate();

  // Derive the pool address
  const pool = derivePoolAddress(config, baseMintKeypair.publicKey, quoteMint);

  // Derive the pool authority
  const poolAuthority = derivePoolAuthority();

  // Derive the token vaults
  const baseVault = deriveTokenVaultAddress(baseMintKeypair.publicKey, pool);
  const quoteVault = deriveTokenVaultAddress(quoteMint, pool);

  // Determine the token program based on the token type
  const isToken2022 = tokenType !== 0;

  // Create the transaction
  const transaction = new Transaction();

  // Add the appropriate initialize pool instruction based on token type
  if (isToken2022) {
    // Use Token2022 initialization
    transaction.add(
      await (program.methods as any)
        .initializeVirtualPoolWithToken2022(instructionParams)
        .accounts({
          config,
          baseMint: baseMintKeypair.publicKey,
          quoteMint,
          pool,
          payer: payer.publicKey,
          creator: payer.publicKey,
          poolAuthority,
          baseVault,
          quoteVault,
          tokenQuoteProgram: TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .instruction()
    );
  } else {
    // Derive the metadata account (only needed for SPL token)
    const mintMetadata = deriveMetadataAccount(baseMintKeypair.publicKey);

    // Use SPL Token initialization
    transaction.add(
      await (program.methods as any)
        .initializeVirtualPoolWithSplToken(instructionParams)
        .accounts({
          config,
          baseMint: baseMintKeypair.publicKey,
          quoteMint,
          pool,
          payer: payer.publicKey,
          creator: payer.publicKey,
          poolAuthority,
          baseVault,
          quoteVault,
          mintMetadata,
          metadataProgram: METAPLEX_PROGRAM_ID,
          tokenQuoteProgram: TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction()
    );
  }

  // Set the recent blockhash and fee payer
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = payer.publicKey;

  // Return both transaction and baseMintKeypair
  return { transaction, baseMintKeypair };
}
