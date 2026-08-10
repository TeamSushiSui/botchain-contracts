# Payfrica Botchain Smart Contracts

This folder contains the smart contract codebases for Payfrica's integration with Botchain.

## Contracts

### `PayfricaLedger.sol`
A decentralized transaction ledger that records cryptographic transaction summaries of all utility payments and offramps processed through the platform.

* **Audit Records**: Stores users, crypto assets used, amounts, fiat values, and external transaction proof references.
* **Exchange Rate Oracle**: Records NGN/USD transaction exchange rates on-chain.
* **Loyalty Volume Tracking**: Tracks total USD volume processed per user on-chain to enable loyalty benefits.

---

## Getting Started

### 1. Installation
Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
```

### 2. Compile
Compile the Solidity contracts:
```bash
npx hardhat compile
```

### 3. Deploy
Update your `hardhat.config.js` to include the Botchain RPC details:
```javascript
export default {
  solidity: "0.8.20",
  networks: {
    botchain: {
      url: "https://rpc.botchain.ai", // Replace with current Botchain RPC url
      accounts: [process.env.ETH_PRIVATE_KEY]
    }
  }
};
```

Deploy using a Hardhat script:
```bash
npx hardhat run scripts/deploy.js --network botchain
```
