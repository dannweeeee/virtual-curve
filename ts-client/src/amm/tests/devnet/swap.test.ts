import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";
import BN from "bn.js";
import { expect } from "chai";
import { VirtualCurve } from "../../client";
import bs58 from "bs58";
import dotenv from "dotenv";
import { MAX_SQRT_PRICE, MIN_SQRT_PRICE, U64_MAX } from "../../constants";
import {
  derivePoolAddress,
  deriveTokenVaultAddress,
} from "../../utils/account";

import { describe, test, beforeAll, jest } from "@jest/globals";
import { fetchPoolConfig } from "../../utils/fetcher";

dotenv.config();

describe("VirtualCurve SDK - Swap (Devnet)", () => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  let payer: Keypair;
  let client: VirtualCurve;
  let configAddress: PublicKey;
  let poolAddress: PublicKey;
  let baseMintAddress: PublicKey;
  let configKeypair: Keypair;
  let baseMintKeypair: Keypair;

  jest.setTimeout(300000);

  beforeAll(async () => {
    // Load private key from environment variable
    const privateKeyBase58 = process.env.PRIVATE_KEY;
    if (privateKeyBase58) {
      const secretKey = bs58.decode(privateKeyBase58);
      payer = Keypair.fromSecretKey(secretKey);
    } else {
      // Create new keypair if no private key provided
      payer = Keypair.generate();

      // Request airdrop for the new keypair
      try {
        const signature = await connection.requestAirdrop(
          payer.publicKey,
          2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(signature, "confirmed");
        console.log(`Airdrop successful: ${signature}`);
      } catch (err) {
        console.error("Failed to request airdrop:", err);
        throw new Error("Test requires SOL. Please fund the keypair manually.");
      }
    }

    console.log(`Using keypair: ${payer.publicKey.toString()}`);

    // Check balance
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Keypair balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    if (balance < LAMPORTS_PER_SOL) {
      throw new Error(
        "Insufficient SOL balance for tests. Need at least 1 SOL."
      );
    }

    // Initialize client
    client = new VirtualCurve(connection, undefined, payer);
    console.log("Client initialized successfully");
  }, 60000); // 60 second timeout for setup

  test("should create config, pool, and execute swap with SOL", async () => {
    // Create curve configuration
    const curves = [];
    for (let i = 1; i <= 20; i++) {
      curves.push({
        sqrtPrice: MAX_SQRT_PRICE.muln(i * 5).divn(100),
        liquidity: U64_MAX.shln(30 + i),
      });
    }

    // Create base fee configuration
    const baseFee = {
      cliffFeeNumerator: new BN(2_500_000),
      numberOfPeriod: 0,
      reductionFactor: new BN(0),
      periodFrequency: new BN(0),
      feeSchedulerMode: 0,
    };

    // Create config instruction parameters
    const configInstructionParams = {
      poolFees: {
        baseFee,
        dynamicFee: null,
      },
      collectFeeMode: 0,
      migrationOption: 0,
      activationType: 0,
      tokenType: 0,
      tokenDecimal: 6,
      migrationQuoteThreshold: new BN(LAMPORTS_PER_SOL * 5),
      partnerLpPercentage: 0,
      creatorLpPercentage: 0,
      partnerLockedLpPercentage: 95,
      creatorLockedLpPercentage: 5,
      sqrtStartPrice: MIN_SQRT_PRICE.shln(32),
      padding: [],
      curve: curves,
    };

    console.log("Creating config...");
    const { transaction: configTx, configKeypair: configKp } =
      await client.createConfig({
        owner: payer.publicKey,
        feeClaimer: payer.publicKey,
        quoteMint: NATIVE_MINT,
        instructionParams: configInstructionParams,
      });

    // Sign with both payer and config keypair
    configTx.partialSign(payer);
    configTx.partialSign(configKp);

    // Send and confirm the config transaction
    const configSignature = await sendAndConfirmTransaction(
      connection,
      configTx,
      [payer, configKp],
      { commitment: "confirmed" }
    );
    console.log(`Config created with signature: ${configSignature}`);

    // Store the config keypair and address
    configKeypair = configKp;
    configAddress = configKeypair.publicKey;
    console.log(`Config address: ${configAddress.toString()}`);

    // Create the liquidity pool
    console.log("Creating pool...");
    const poolInstructionParams = {
      name: "Swap Test Token",
      symbol: "SWAPTEST",
      uri: "https://example.com/metadata/swap-test-token",
    };

    const { transaction: poolTx, baseMintKeypair: baseKp } =
      await client.createPool({
        config: configAddress,
        quoteMint: NATIVE_MINT,
        instructionParams: poolInstructionParams,
      });

    // Sign the transaction with both payer and baseMint keypair
    poolTx.partialSign(payer);
    poolTx.partialSign(baseKp);

    // Send and confirm the pool transaction
    const poolSignature = await sendAndConfirmTransaction(
      connection,
      poolTx,
      [payer, baseKp],
      { commitment: "confirmed" }
    );
    console.log(`Pool created with signature: ${poolSignature}`);

    // Store the baseMint keypair and address
    baseMintKeypair = baseKp;
    baseMintAddress = baseMintKeypair.publicKey;
    console.log(`Base mint address: ${baseMintAddress.toString()}`);

    // Derive the pool address using the derivePoolAddress utility function
    poolAddress = derivePoolAddress(
      configAddress,
      baseMintAddress,
      NATIVE_MINT
    );
    console.log(`Pool address: ${poolAddress.toString()}`);

    console.log("Waiting for transactions to confirm...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Verify accounts exist on-chain
    const configInfo = await connection.getAccountInfo(configAddress);
    expect(configInfo).to.not.be.null;
    console.log(`Config account exists: ${configInfo !== null}`);

    const poolInfo = await connection.getAccountInfo(poolAddress);
    expect(poolInfo).to.not.be.null;
    console.log(`Pool account exists: ${poolInfo !== null}`);

    const baseMintInfo = await connection.getAccountInfo(baseMintAddress);
    expect(baseMintInfo).to.not.be.null;
    console.log(`Base mint account exists: ${baseMintInfo !== null}`);

    // Fetch config state using the fetchPoolConfig utility function
    console.log("Fetching config state...");
    const configState = await fetchPoolConfig(
      connection,
      client["program"],
      configAddress
    );

    // Check if configState is null
    if (!configState) {
      throw new Error(
        "Failed to fetch config state. Cannot proceed with swap test."
      );
    }

    console.log("Config state tokenType:", configState.tokenType);

    // Derive vault addresses based on the pool
    const baseVault = deriveTokenVaultAddress(baseMintAddress, poolAddress);
    const quoteVault = deriveTokenVaultAddress(NATIVE_MINT, poolAddress);
    console.log(`Base vault: ${baseVault.toString()}`);
    console.log(`Quote vault: ${quoteVault.toString()}`);

    // Prepare the swap
    console.log("\nPreparing to execute swap...");
    const swapAmount = new BN(LAMPORTS_PER_SOL * 3);
    console.log(
      `Swap amount: ${swapAmount.toString()} lamports (${
        swapAmount.toNumber() / LAMPORTS_PER_SOL
      } SOL)`
    );

    // Define swap parameters
    const swapParams = {
      config: configAddress,
      pool: poolAddress,
      inputTokenMint: NATIVE_MINT,
      outputTokenMint: baseMintAddress,
      amountIn: swapAmount,
      minimumAmountOut: new BN(0),
    };

    console.log(`Using token type: ${configState.tokenType}`);
    console.log(`Using base vault: ${baseVault.toString()}`);
    console.log(`Using quote vault: ${quoteVault.toString()}`);
    console.log(
      `Using token program: ${
        configState.tokenType === 0
          ? "TOKEN_PROGRAM_ID"
          : "TOKEN_2022_PROGRAM_ID"
      }`
    );

    // Get a swap quote
    console.log("Getting swap quote...");
    try {
      // Use the swapQuote method with virtual curve math
      const quote = await client.swapQuote(swapParams);
      console.log(
        `Swap quote: ${quote.swapOutAmount.toString()} tokens for ${
          swapAmount.toNumber() / LAMPORTS_PER_SOL
        } SOL`
      );

      // Calculate minimum output amount with 50% slippage
      const minSwapOutAmount = quote.swapOutAmount
        .mul(new BN(50))
        .div(new BN(100));
      console.log(
        `Minimum output amount (with 50% slippage): ${minSwapOutAmount.toString()}`
      );

      // Execute the swap
      console.log("Executing swap...");
      const swapTx = await client.swap({
        ...swapParams,
        minimumAmountOut: minSwapOutAmount,
      });

      // Log transaction details
      console.log(
        `Swap transaction has ${swapTx.instructions.length} instructions`
      );

      // Validate the transaction structure
      expect(swapTx.instructions.length).to.be.greaterThan(0);

      // Look for the swap instruction (should be the main instruction)
      const swapInstruction = swapTx.instructions.find(
        (ix) =>
          ix.programId.toString() === client["program"].programId.toString()
      );

      expect(swapInstruction).to.not.be.undefined;
      console.log("Swap instruction found in transaction");

      // Set recentBlockhash before signing
      swapTx.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      swapTx.feePayer = payer.publicKey;

      // Sign the transaction
      swapTx.partialSign(payer);

      // Sign and send the transaction
      try {
        const swapSignature = await sendAndConfirmTransaction(
          connection,
          swapTx,
          [payer],
          {
            commitment: "confirmed",
            skipPreflight: true,
          }
        );
        console.log(`Swap completed with signature: ${swapSignature}`);

        // Verify the transaction was successful
        const txDetails = await connection.getTransaction(swapSignature, {
          commitment: "confirmed",
        });

        expect(txDetails).to.not.be.null;
        expect(txDetails?.meta?.err).to.be.null;

        console.log("Swap transaction verified as successful!");
      } catch (err) {
        console.error("Error executing swap transaction:", err);
        throw new Error(JSON.stringify(err));
      }
    } catch (err) {
      console.error("Error in swap quote or execution:", err);
      throw new Error(JSON.stringify(err));
    }
  });
});
