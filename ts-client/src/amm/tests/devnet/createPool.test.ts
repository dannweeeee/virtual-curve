import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";
import { expect } from "chai";
import { VirtualCurve } from "../../client";
import bs58 from "bs58";
import dotenv from "dotenv";
import BN from "bn.js";
import {
  MAX_CURVE_POINT,
  MAX_SQRT_PRICE,
  MIN_SQRT_PRICE,
  U64_MAX,
} from "../../constants";

import { describe, test, beforeAll, jest } from "@jest/globals";

dotenv.config();

describe("VirtualCurve SDK - Create Pool (Devnet)", () => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  let payer: Keypair;
  let client: VirtualCurve;

  // Create config address variable
  let configAddress: PublicKey;

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
  }, 60000);

  test("should create a config and then a new pool", async () => {
    console.log("Step 1: Creating config...");

    try {
      // Create a curve configuration
      const curves = [];
      for (let i = 1; i <= MAX_CURVE_POINT; i++) {
        curves.push({
          sqrtPrice: MAX_SQRT_PRICE.muln(i * 5).divn(100),
          liquidity: U64_MAX.shln(30 + i),
        });
      }

      const baseFee = {
        cliffFeeNumerator: new BN(2_500_000), // 0.25%
        numberOfPeriod: 0,
        reductionFactor: new BN(0),
        periodFrequency: new BN(0),
        feeSchedulerMode: 0,
      };

      const configInstructionParams = {
        poolFees: {
          baseFee,
          dynamicFee: null,
        },
        collectFeeMode: 0,
        migrationOption: 0,
        activationType: 0,
        tokenType: 0,
        tokenDecimal: 9,
        migrationQuoteThreshold: new BN(LAMPORTS_PER_SOL * 5),
        partnerLpPercentage: 0,
        partnerLockedLpPercentage: 95,
        creatorLpPercentage: 0,
        creatorLockedLpPercentage: 5,
        sqrtStartPrice: MIN_SQRT_PRICE.shln(32),
        padding: [],
        curve: curves,
      };

      // Create the config using the client
      const { transaction: configTx, configKeypair } =
        await client.createConfig({
          owner: payer.publicKey,
          feeClaimer: payer.publicKey,
          quoteMint: NATIVE_MINT,
          instructionParams: configInstructionParams,
        });

      configAddress = configKeypair.publicKey;

      console.log("Config transaction created", configAddress);

      // Send the config transaction
      const configSig = await sendAndConfirmTransaction(
        connection,
        configTx,
        [payer, configKeypair],
        { commitment: "confirmed" }
      );

      console.log(`Config created with signature: ${configSig}`);
      console.log(`Config address: ${configAddress.toString()}`);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create the pool using the newly created config
      console.log("Creating pool with the new config...");

      // Define the pool parameters
      const poolParams = {
        quoteMint: NATIVE_MINT,
        config: configAddress,
        instructionParams: {
          name: "Create Pool Test Token",
          symbol: "CPTEST",
          uri: "https://example.com/metadata/create-pool-test-token",
        },
      };

      console.log("Creating pool with params:", {
        config: poolParams.config.toString(),
        quoteMint: poolParams.quoteMint.toString(),
        name: poolParams.instructionParams.name,
        symbol: poolParams.instructionParams.symbol,
      });

      // Create the pool using the client
      const { transaction, baseMintKeypair } = await client.createPool(
        poolParams
      );

      console.log(
        `Generated base mint: ${baseMintKeypair.publicKey.toString()}`
      );

      // Make sure there are instructions in the transaction
      expect(transaction.instructions.length).to.be.greaterThan(0);

      console.log(
        "Transaction created with instructions:",
        transaction.instructions.length
      );

      // Log the instruction details for verification
      if (transaction.instructions.length > 0) {
        const lastIx =
          transaction.instructions[transaction.instructions.length - 1];
        console.log("Pool creation instruction accounts:", lastIx.keys.length);
        // Key accounts
        lastIx.keys.slice(0, 7).forEach((key, index) => {
          console.log(`  Account ${index}: ${key.pubkey.toString()}`);
        });
      }

      // Send and confirm the transaction with both signers
      console.log("Sending pool creation transaction...");
      try {
        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [payer, baseMintKeypair],
          {
            commitment: "confirmed",
            skipPreflight: true,
          }
        );

        console.log(`Pool created with signature: ${signature}`);

        // Verify transaction was successful
        const txInfo = await connection.getTransaction(signature, {
          commitment: "confirmed",
        });

        expect(txInfo).to.not.be.null;
        if (txInfo?.meta?.err) {
          console.error("Transaction error:", txInfo.meta.err);
        }
        expect(txInfo?.meta?.err).to.be.null;

        // Extract the pool address from logs if possible
        const logs = txInfo?.meta?.logMessages || [];
        console.log("First few transaction logs:");
        logs.slice(0, 5).forEach((log) => console.log(log));

        console.log("Pool creation test completed successfully!");
      } catch (error: any) {
        console.error("Error in pool creation:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in test:", error);
      throw error;
    }
  });
});
