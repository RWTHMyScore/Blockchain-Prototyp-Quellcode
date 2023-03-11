# Credit Mobility Backend

These smart contracts provide the business logic required on the underlying blockchain. Additionally, this repository
contains a Dockerfile that runs a chain emulator instance (ganache) to make development easy. This Docker container
will not be used in any production-like setting. The chain emulator does not retain any state in between restarts.

## Initial Setup

Note: At the time of writing, pnpm is not able to install truffle and ganache globally without producing errors.

```
pnpm install
npm install -g truffle@5.4.30 ganache@7.0.0
```

## Command Reference

### Test all contracts

```
truffle test
```

### Start Chain

Uses pre-defined accounts. These are only for easier local development!

```
./startanddeploy.sh
```

### Deploy to Goerli testnet

This requires an account with sufficient funds and and an Infura project key. Should ideally only be done once.

You might want to adjust values in the deployment script.

```
pnpm deploy
```
