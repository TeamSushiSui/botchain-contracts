import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    'bot-chain': {
      url: process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai",
      accounts: process.env.ETH_PRIVATE_KEY ? [process.env.ETH_PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      'bot-chain': 'empty'
    },
    customChains: [
      {
        network: "bot-chain",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai"
        }
      }
    ]
  }
};

