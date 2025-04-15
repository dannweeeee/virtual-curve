import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";
import BN from "bn.js";
import { expect } from "chai";
import { VirtualCurve } from "../../../index";
import {
  MAX_SQRT_PRICE,
  MIN_SQRT_PRICE,
  MAX_CURVE_POINT,
  U64_MAX,
} from "../../constants";
import bs58 from "bs58";
import dotenv from "dotenv";

import { describe, test, beforeAll, jest } from "@jest/globals";

dotenv.config();

describe("VirtualCurve SDK - Create Config (Devnet)", () => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  let payer: Keypair;
  let client: VirtualCurve;

  jest.setTimeout(120000);

  beforeAll(async () => {
    // Load private key from environment variables
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

  test("should create a config account successfully", async () => {
    // Setup test parameters
    const owner = payer.publicKey;
    const feeClaimer = payer.publicKey;
    const quoteMint = NATIVE_MINT;

    const baseFee = {
      cliffFeeNumerator: new BN(2_500_000),
      numberOfPeriod: 0,
      reductionFactor: new BN(0),
      periodFrequency: new BN(0),
      feeSchedulerMode: 0,
    };

    // Create virtual curve array
    const curves = [];
    for (let i = 1; i <= MAX_CURVE_POINT; i++) {
      // The last point must be MAX_SQRT_PRICE
      const isLastPoint = i === MAX_CURVE_POINT;
      const sqrtPrice = isLastPoint
        ? MAX_SQRT_PRICE
        : MAX_SQRT_PRICE.muln(i * 5).divn(100);

      curves.push({
        sqrtPrice: sqrtPrice,
        liquidity: U64_MAX.shln(30 + i),
      });
    }

    const instructionParams = {
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

    console.log("Creating config transaction...");

    try {
      // Use client.createConfig to get both transaction and configKeypair
      const { transaction, configKeypair } = await client.createConfig({
        owner,
        feeClaimer,
        quoteMint,
        instructionParams,
      });

      console.log(
        "Transaction created successfully. Config pubkey:",
        configKeypair.publicKey.toString()
      );

      // Verify the transaction has instructions
      expect(transaction.instructions?.length || 0).to.be.greaterThan(0);

      console.log("Sending transaction to devnet...");
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer, configKeypair],
        {
          commitment: "confirmed",
          skipPreflight: false,
        }
      );

      console.log(`Config created successfully with signature: ${signature}`);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Verify and check transaction status
      const status = await connection.getSignatureStatus(signature);
      expect(status?.value?.confirmationStatus).to.not.equal("failed");

      // Verify the config account exists on-chain
      const accountInfo = await connection.getAccountInfo(
        configKeypair.publicKey
      );
      expect(accountInfo).to.not.be.null;

      console.log(
        "Config account created and verified on-chain",
        configKeypair.publicKey.toString()
      );
    } catch (error) {
      console.error("Error creating config:", error);
      throw error;
    }
  });
});
