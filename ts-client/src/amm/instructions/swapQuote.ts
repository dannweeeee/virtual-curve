import BN from "bn.js";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { ConfigState, PoolState, SwapParams } from "../types";
import { getFeeMode, getSwapResult, TradeDirection } from "../math/swap";
import { fetchVirtualPool, fetchPoolConfig } from "../utils/fetcher";

/**
 * Calculate the quotation of user's swap
 * @param params The parameters for the swap
 * @param connection Solana connection
 * @param program Anchor program
 * @returns The swap out amount and minimum swap out amount
 */
export async function swapQuote(
  params: SwapParams,
  connection: Connection,
  program: Program<any>
): Promise<{
  swapOutAmount: BN;
  minSwapOutAmount: BN;
}> {
  const {
    config,
    pool,
    inputTokenMint,
    outputTokenMint,
    amountIn,
    referralTokenAccount = null,
  } = params;

  try {
    // Create pool and config variables
    let poolState: PoolState;
    let configState: ConfigState;

    // Fetch pool state
    const fetchedPoolState = await fetchVirtualPool(connection, program, pool);
    if (fetchedPoolState) {
      poolState = fetchedPoolState;
    } else {
      console.warn("Could not fetch pool state");
      throw new Error("Could not fetch pool state");
    }

    // Fetch config state
    const fetchedConfigState = await fetchPoolConfig(
      connection,
      program,
      config
    );
    if (fetchedConfigState) {
      configState = fetchedConfigState;
    } else {
      console.warn("Could not fetch config state");
      throw new Error("Could not fetch config state");
    }

    // Determine if the input is the base mint
    const isInputBaseMint = inputTokenMint.equals(poolState.baseMint);

    // Determine the trade direction
    const tradeDirection = isInputBaseMint
      ? TradeDirection.BaseToQuote
      : TradeDirection.QuoteToBase;

    // Get the current timestamp
    const currentPoint = new BN(Math.floor(Date.now() / 1000));

    // Get the fee mode
    const feeMode = getFeeMode(
      configState.collectFeeMode,
      tradeDirection,
      referralTokenAccount !== null
    );

    try {
      // Calculate the swap result
      const swapResult = getSwapResult(
        poolState,
        configState,
        amountIn,
        feeMode,
        tradeDirection,
        currentPoint
      );

      console.log(
        "Calculated output amount:",
        swapResult.outputAmount.toString()
      );

      // Calculate minimum amount out with 1% slippage by default
      const minSwapOutAmount = swapResult.outputAmount
        .mul(new BN(99))
        .div(new BN(100));

      return {
        swapOutAmount: swapResult.outputAmount,
        minSwapOutAmount,
      };
    } catch (mathError) {
      console.warn(
        "Error in swap math calculation, falling back to simple calculation",
        mathError
      );
      throw new Error(JSON.stringify(mathError));
    }
  } catch (error) {
    console.error("Error calculating swap quote:", error);
    throw new Error(JSON.stringify(error));
  }
}
