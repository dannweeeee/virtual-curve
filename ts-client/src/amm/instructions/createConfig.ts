import { Connection, Keypair, Transaction, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

import { CreateConfigParams } from "../types";

/**
 * Create a new configuration for the Virtual Curve program
 * @param connection Solana connection
 * @param program Anchor program
 * @param payer Keypair
 * @param params Parameters for creating the configuration
 * @returns A promise that resolves to the transaction and config keypair
 */
export async function createConfig(
  connection: Connection,
  program: Program<any>,
  payer: Keypair,
  params: CreateConfigParams
): Promise<{ transaction: Transaction; configKeypair: Keypair }> {
  const { owner, feeClaimer, quoteMint, instructionParams } = params;

  // Generate a new keypair for the config account
  const configKeypair = Keypair.generate();

  // Create the transaction using the transaction() method
  const transaction = await (program.methods as any)
    .createConfig(instructionParams)
    .accounts({
      config: configKeypair.publicKey,
      feeClaimer,
      owner,
      quoteMint,
      payer: payer.publicKey,
    })
    .transaction();

  // Set the recent blockhash and fee payer
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = payer.publicKey;

  // Return both the transaction and the configKeypair
  return { transaction, configKeypair };
}
