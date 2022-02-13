# EVM compatible ERC-20 tokens bridge

This dApp provides a basic UI for interacting with the [Bridge Contract](https://github.com/R-Santev/evm-bridge).  
Users can transfer ERC-20 tokens between all the provided networks by connecting to the source chain, selecting a token (add the address of the token in the input form), the amount they want to bridge and the target chain.

## There are three steps you have to complete:

1. Approve the the amount of tokens.
2. Bridge the tokens from the native chain (Lock or Burn function).
3. Claim the bridged tokens to the target chain (Unlock or Mint function).

**Note!** You cannot bridge native tokens on the selected network.

## Visit the app

There is a working version of the app [here](https://evm-bridge.pages.dev).

## To run the app locally

1. Install packages

```bash
npm install

# OR

yarn
```

2. Start the app

```bash
npm run start

# OR

yarn start
```
