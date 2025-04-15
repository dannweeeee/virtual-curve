import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Program, AnchorProvider, Idl as AnchorIdl } from "@coral-xyz/anchor";
import BN from "bn.js";
import { Idl } from "./idl";
import { VirtualCurve as VirtualCurveIdl } from "./idl-type";

import {
  CreateConfigParams,
  CreatePoolParams,
  SwapParams,
  VirtualCurveClient,
} from "./types";
import { PROGRAM_ID } from "./constants";
import { createConfig } from "./instructions/createConfig";
import { createPool } from "./instructions/createPool";
import { swapQuote } from "./instructions/swapQuote";
import { swap } from "./instructions/swap";

export class VirtualCurve implements VirtualCurveClient {
  private connection: Connection;
  private program: Program<any>;
  private payer: Keypair;

  /**
   * Virtual Curve client
   * @param connection Solana connection
   * @param provider AnchorProvider
   * @param payer Payer keypair (optional if provider is passed)
   * @param programId Program ID
   * @param idl IDL
   */
  constructor(
    connection: Connection,
    provider?: AnchorProvider,
    payer?: Keypair,
    programId: PublicKey = PROGRAM_ID,
    idl?: VirtualCurveIdl
  ) {
    this.connection = connection;

    if (provider) {
      if (payer) {
        this.payer = payer;
      } else {
        const wallet = provider.wallet as any;
        if (wallet && wallet.payer) {
          this.payer = wallet.payer;
        } else {
          throw new Error(
            "Cannot extract payer from provider. Please provide payer explicitly."
          );
        }
      }
    } else {
      // No provider, so payer is required
      if (!payer) {
        throw new Error("Either provider or payer is required");
      }

      this.payer = payer;

      provider = new AnchorProvider(
        this.connection,
        {
          publicKey: payer.publicKey,
          signTransaction: async (tx: Transaction) => {
            tx.sign(payer);
            return tx;
          },
          signAllTransactions: async (txs: Transaction[]) => {
            return txs.map((tx) => {
              tx.sign(payer);
              return tx;
            });
          },
        } as any,
        { commitment: "confirmed" }
      );
    }

    const programIdl = idl || Idl;

    this.program = new Program(programIdl as unknown as AnchorIdl, provider);
  }

  /**
   * Function to create a new configuration for the Virtual Curve program
   * @param params Parameters for creating the configuration
   * @returns Promise that resolves to the transaction and config keypair
   */
  async createConfig(params: CreateConfigParams): Promise<{
    transaction: Transaction;
    configKeypair: Keypair;
  }> {
    const { transaction, configKeypair } = await createConfig(
      this.connection,
      this.program,
      this.payer,
      params
    );

    return { transaction, configKeypair };
  }

  /**
   * Function to create a new pool
   * @param params Parameters for creating the pool
   * @returns Promise that resolves to the transaction and baseMint keypair
   */
  async createPool(params: CreatePoolParams): Promise<{
    transaction: Transaction;
    baseMintKeypair: Keypair;
  }> {
    const { transaction, baseMintKeypair } = await createPool(
      this.connection,
      this.program,
      this.payer,
      params
    );

    return { transaction, baseMintKeypair };
  }

  /**
   * Function to calculate the quotation of user's swap
   * @param params Parameters for the swap
   * @returns The swap out amount and minimum swap out amount
   */
  async swapQuote(
    params: SwapParams
  ): Promise<{ swapOutAmount: BN; minSwapOutAmount: BN }> {
    // Use the accurate version that fetches on-chain data
    return swapQuote(params, this.connection, this.program);
  }

  /**
   * Function to perform a swap
   * @param params Parameters for the swap
   * @returns Promise that resolves to the transaction
   */
  async swap(params: SwapParams): Promise<Transaction> {
    // If referralTokenAccount is not provided, set it to null
    const swapParams = {
      ...params,
      referralTokenAccount: params.referralTokenAccount ?? null,
    };
    return swap(
      this.connection,
      this.program,
      this.payer.publicKey,
      swapParams
    );
  }
}
