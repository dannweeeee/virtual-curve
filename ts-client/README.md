# Virtual Curve SDK (Assignment)

Virtual Curve SDK is a TypeScript library that allows you to interact with Meteora's Virtual Curve program via a Virtual Curve client.

## Features

### Client

- Virtual Curve client

### Instructions

- Create a new configuration
- Create a new pool
- Calculate the quotation of a user's swap
- Perform a swap

## For Building and Testing Locally

### Install Dependencies

```bash
cd ts-client
npm install
```

### Build SDK

```bash
cd ts-client
npm run build
```

### Run Tests

**This SDK contains the following unit tests on devnet:**

- Create a new configuration: `src/amm/tests/devnet/createConfig.test.ts`
- Create a new pool: `src/amm/tests/devnet/createPool.test.ts`
- Perform a swap: `src/amm/tests/devnet/swap.test.ts`

**Things to note:**

- Before running the unit tests, make sure to set the `PRIVATE_KEY` environment variable in your `.env` file.
- Also ensure that your `PRIVATE_KEY` has minimum 10 to 20 devnet SOL.

```bash
cp .env.example .env
```

To run the unit tests, use the following command:

```bash
# Create a new configuration
cd ts-client
npm run test:createConfig
```

```bash
# Create a new configuration and new pool
cd ts-client
npm run test:createPool
```

```bash
# Create a new configuration and new pool and perform a swap
cd ts-client
npm run test:swap
```

## Additional Features

- Drew inspiration from [DLMM SDK](https://github.com/MeteoraAg/dlmm-sdk) and [DAMM SDK](https://github.com/MeteoraAg/damm-sdk).
- Configured the SDK to contain ESM and CJS compatible code.
- Added Jest unit tests for the SDK.
- Did the Swap Quote calculation using the Virtual Curve math. (To the best of my ability and understanding)
- Unit and Integration Tests are on testnet
- Added a few enhancements to the suggested VirtualCurveClient interface for more functionality

```typescript
export interface VirtualCurveClient {
  createConfig(
    params: CreateConfigParams
  ): Promise<{ transaction: Transaction; configKeypair: Keypair }>;
  createPool(
    params: CreatePoolParams
  ): Promise<{ transaction: Transaction; baseMintKeypair: Keypair }>;
  swapQuote(
    params: SwapParams
  ): Promise<{ swapOutAmount: BN; minSwapOutAmount: BN }>;
  swap(params: SwapParams): Promise<Transaction>;
}
```

## Example Usage (when SDK deployed live)

```typescript
import { VirtualCurveClient } from "@meteora-labs/virtual-curve-sdk";

const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed"
);
const wallet = Keypair.fromSecretKey(/* user's secret key */);
const client = new VirtualCurve(connection, undefined, wallet);

async function createNewConfig() {
  // ... config params
  const { transaction, configKeypair } = await client.createConfig(
    configParams
  );
}

async function createNewPool() {
  // ... pool params
  const { transaction, baseMintKeypair } = await client.createPool(poolParams);
}

async function swapQuote() {
  // ... swap params
  const quote = await client.swapQuote(swapParams);
}

async function swap() {
  // ... swap params
  const transaction = await client.swap(swapParams);
}
```

## Concluding Thoughts

- Had a lot of fun working on this SDK assignment!
- Hope to get some feedback on areas of improvements and hopefully bring this SDK to production!
- Thank you for the opportunity! @Sam and @Shane 😊
