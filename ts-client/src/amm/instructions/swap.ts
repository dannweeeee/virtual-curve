import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
} from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";
import { derivePoolAuthority } from "../utils/account";
import { fetchPoolConfig } from "../utils/fetcher";
import { wrapSOLInstruction, unwrapSOLInstruction } from "../utils/token";
import { SwapParams } from "../types";

export const swap = async (
  connection: Connection,
  program: Program,
  payer: PublicKey,
  params: SwapParams
): Promise<Transaction> => {
  const {
    config,
    pool,
    inputTokenMint,
    outputTokenMint,
    amountIn,
    minimumAmountOut,
    referralTokenAccount,
  } = params;

  // referralTokenAccount is optional
  const validReferralTokenAccount: PublicKey | null =
    referralTokenAccount instanceof PublicKey ? referralTokenAccount : null;

  console.log(
    `Preparing to swap ${amountIn.toString()} input tokens for a minimum of ${minimumAmountOut.toString()} output tokens`
  );

  // Get pool authority
  const poolAuthority = derivePoolAuthority();

  // Fetch pool state
  let poolState;
  try {
    console.log(`Fetching pool state from address: ${pool.toString()}`);
    poolState = await (program.account as any).virtualPool.fetch(pool);
    console.log("Got pool state");
  } catch (error) {
    console.warn("Error fetching pool state:", error);
    throw new Error(`Failed to fetch pool state: ${error}`);
  }

  // Fetch config state
  let configState;
  try {
    console.log(`Fetching config state from address: ${config.toString()}`);
    configState = await fetchPoolConfig(connection, program, config);
    console.log("Got config state");
  } catch (error) {
    console.warn("Error fetching config state:", error);
    throw new Error(`Failed to fetch config state: ${error}`);
  }

  // Determine token programs based on config state
  const tokenBaseProgram =
    configState?.tokenType === 0 ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID;

  // Determine if input is base mint
  const isInputBaseMint = inputTokenMint.equals(poolState.baseMint);

  // Set quote mint based on which token is base
  const quoteMint = isInputBaseMint ? outputTokenMint : inputTokenMint;

  // Determine program for each token type
  const [inputTokenProgram, outputTokenProgram] = isInputBaseMint
    ? [tokenBaseProgram, TOKEN_PROGRAM_ID]
    : [TOKEN_PROGRAM_ID, tokenBaseProgram];

  // Create a new transaction
  const transaction = new Transaction();

  // Pre-instructions to run before the swap
  const preInstructions: TransactionInstruction[] = [];

  // Post-instructions to run after the swap
  const postInstructions: TransactionInstruction[] = [];

  // Get or create the associated token accounts
  const inputTokenAccount = getAssociatedTokenAddressSync(
    inputTokenMint,
    payer,
    true
  );

  // Get or create the associated token account for the output token
  const outputTokenAccount = getAssociatedTokenAddressSync(
    outputTokenMint,
    payer,
    true
  );

  console.log("Input token account:", inputTokenAccount.toString());
  console.log("Output token account:", outputTokenAccount.toString());

  // Check if input token account exists
  const inputTokenAccountInfo = await connection.getAccountInfo(
    inputTokenAccount
  );
  if (!inputTokenAccountInfo && !inputTokenMint.equals(NATIVE_MINT)) {
    console.log("Creating input token account");
    preInstructions.push(
      createAssociatedTokenAccountInstruction(
        payer,
        inputTokenAccount,
        payer,
        inputTokenMint
      )
    );
  }

  // Check if output token account exists
  const outputTokenAccountInfo = await connection.getAccountInfo(
    outputTokenAccount
  );
  if (!outputTokenAccountInfo) {
    console.log("Creating output token account");
    preInstructions.push(
      createAssociatedTokenAccountInstruction(
        payer,
        outputTokenAccount,
        payer,
        outputTokenMint
      )
    );
  }

  // Wrap SOL if input is SOL
  if (inputTokenMint.equals(NATIVE_MINT) && !amountIn.isZero()) {
    console.log("Wrapping SOL for the swap");

    // If the account doesn't exist, create it
    if (!inputTokenAccountInfo) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          payer,
          inputTokenAccount,
          payer,
          NATIVE_MINT
        )
      );
    }

    // Add wrap SOL instructions
    const wrapSOLIxs = wrapSOLInstruction(
      payer,
      inputTokenAccount,
      BigInt(amountIn.toString())
    );
    preInstructions.push(...wrapSOLIxs);
  }

  // If output is SOL, add unwrap instruction for after the swap
  if (outputTokenMint.equals(NATIVE_MINT)) {
    console.log("Adding unwrap SOL instruction for after the swap");
    const unwrapSOLIx = unwrapSOLInstruction(payer);
    if (unwrapSOLIx) {
      postInstructions.push(unwrapSOLIx);
    }
  }

  // Define the accounts object
  const accountsObj = {
    poolAuthority,
    config,
    pool,
    inputTokenAccount,
    outputTokenAccount,
    baseVault: poolState.baseVault,
    quoteVault: poolState.quoteVault,
    baseMint: poolState.baseMint,
    quoteMint,
    payer,
    tokenBaseProgram,
    tokenQuoteProgram: TOKEN_PROGRAM_ID,
    referralTokenAccount: validReferralTokenAccount,
  };

  console.log("Swap accounts:", accountsObj);

  try {
    // Create swap instruction
    const ix = await (program.methods as any)
      .swap({ amountIn, minimumAmountOut })
      .accounts(accountsObj)
      .instruction();

    // Add all instructions in the correct order
    if (preInstructions.length > 0) {
      transaction.add(...preInstructions);
    }

    // Add the main swap instruction
    transaction.add(ix);

    // Add post-instructions if any
    if (postInstructions.length > 0) {
      transaction.add(...postInstructions);
    }

    console.log(
      `Swap transaction created with ${transaction.instructions.length} instructions`
    );
  } catch (error) {
    console.error("Error creating swap instruction:", error);
    throw error;
  }

  return transaction;
};
