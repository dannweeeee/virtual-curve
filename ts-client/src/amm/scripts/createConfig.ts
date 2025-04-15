import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { NATIVE_MINT } from "@solana/spl-token";
import BN from "bn.js";
import dotenv from "dotenv";
import { VirtualCurve } from "../client";
import { MAX_SQRT_PRICE } from "../constants";
import bs58 from "bs58";

dotenv.config();

async function createConfig() {
  // Initialize connection to devnet
  const connection = new Connection(
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  // Partner public key
  const partnerPublicKey = new PublicKey("ENTER_PARTNER_PUBLIC_KEY_HERE");

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error(
      "Please provide your private key in the PRIVATE_KEY variable"
    );
  }

  const secretKey = bs58.decode(PRIVATE_KEY);
  const payer = Keypair.fromSecretKey(secretKey);

  // Initialize the client
  const client = new VirtualCurve(connection, undefined, payer);

  // Create base fee configuration
  const baseFee = {
    cliffFeeNumerator: new BN(2_500_000),
    numberOfPeriod: 0,
    reductionFactor: new BN(0),
    periodFrequency: new BN(0),
    feeSchedulerMode: 0,
  };

  const curves = [
    {
      sqrtPrice: MAX_SQRT_PRICE,
      liquidity: new BN("103301766812773489049600000000000"),
    },
  ];

  // Create config instruction parameters
  const instructionParams = {
    poolFees: {
      baseFee,
      dynamicFee: null,
    },
    collectFeeMode: 0,
    migrationOption: 0,
    activationType: 0,
    tokenType: 0,
    tokenDecimal: 6,
    migrationQuoteThreshold: new BN(1_000_000_000),
    partnerLpPercentage: 0,
    partnerLockedLpPercentage: 50,
    creatorLpPercentage: 0,
    creatorLockedLpPercentage: 50,
    sqrtStartPrice: new BN("97539491880527374"),
    padding: [],
    curve: curves,
  };

  try {
    console.log("Creating config for partner:", partnerPublicKey.toString());

    // Create the config
    const { transaction, configKeypair } = await client.createConfig({
      owner: partnerPublicKey,
      feeClaimer: partnerPublicKey,
      quoteMint: NATIVE_MINT,
      instructionParams,
    });

    console.log("Config keypair created:", configKeypair.publicKey.toString());

    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, configKeypair],
      { commitment: "confirmed" }
    );

    console.log("Config created successfully!");
    console.log("Transaction signature:", signature);
    console.log("Config address:", configKeypair.publicKey.toString());

    // Verify the config account exists
    const accountInfo = await connection.getAccountInfo(
      configKeypair.publicKey
    );
    if (accountInfo) {
      console.log("Config account verified on-chain");
    } else {
      console.error("Config account not found on-chain");
    }
  } catch (error) {
    console.error("Error creating config:", error);
    throw error;
  }
}

createConfig().catch((error) => {
  console.error(error);
  process.exit(1);
});
