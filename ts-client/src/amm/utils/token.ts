import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

/**
 * Get or create an associated token account
 * @param connection The Solana connection
 * @param payer The payer keypair
 * @param mint The mint public key
 * @param owner The owner public key
 * @param tokenProgram The token program ID
 * @returns The associated token account and the instruction to create it if needed
 */
export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  owner: PublicKey,
  tokenProgram: PublicKey = TOKEN_PROGRAM_ID
): Promise<{ ata: PublicKey; ix: TransactionInstruction | null }> {
  const ata = getAssociatedTokenAddressSync(
    mint,
    owner,
    true,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  try {
    await connection.getTokenAccountBalance(ata);
    return { ata, ix: null };
  } catch (e) {
    // if account doesnt exist, then create it
    const ix = createAssociatedTokenAccountInstruction(
      payer.publicKey,
      ata,
      owner,
      mint,
      tokenProgram
    );
    return { ata, ix };
  }
}

/**
 * Create an associated token account instruction
 * @param payer The payer public key
 * @param associatedToken The associated token account public key
 * @param owner The owner public key
 * @param mint The mint public key
 * @param tokenProgram The token program ID
 * @returns The instruction to create the associated token account
 */
export function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  tokenProgram: PublicKey = TOKEN_PROGRAM_ID
): TransactionInstruction {
  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedToken, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: tokenProgram, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      {
        pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
}

/**
 * Create a wrap SOL instruction
 * @param owner The owner public key
 * @param tokenAccount The token account public key
 * @param amount The amount to wrap
 * @returns The instructions to wrap SOL
 */
export function wrapSOLInstruction(
  owner: PublicKey,
  tokenAccount: PublicKey,
  amount: bigint
): TransactionInstruction[] {
  const instructions: TransactionInstruction[] = [];

  // Transfer SOL to the token account
  instructions.push(
    SystemProgram.transfer({
      fromPubkey: owner,
      toPubkey: tokenAccount,
      lamports: amount,
    })
  );

  // Sync native instruction
  instructions.push(
    new TransactionInstruction({
      keys: [{ pubkey: tokenAccount, isSigner: false, isWritable: true }],
      programId: TOKEN_PROGRAM_ID,
      data: Buffer.from([17]), // SyncNative instruction
    })
  );

  return instructions;
}

/**
 * Create an unwrap SOL instruction
 * @param owner The owner public key
 * @returns The instruction to unwrap SOL
 */
export function unwrapSOLInstruction(
  owner: PublicKey
): TransactionInstruction | null {
  return new TransactionInstruction({
    keys: [
      {
        pubkey: getAssociatedTokenAddressSync(
          new PublicKey("So11111111111111111111111111111111111111112"),
          owner,
          true
        ),
        isSigner: false,
        isWritable: true,
      },
      { pubkey: owner, isSigner: true, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: TOKEN_PROGRAM_ID,
    data: Buffer.from([20]), // CloseAccount instruction
  });
}
