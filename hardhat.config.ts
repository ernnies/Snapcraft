import { HardhatUserConfig } from "hardhat/config";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";   // keep if you use upgradeable contracts

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY && !process.env.HARDHAT_NETWORK) {
  console.warn("⚠️  PRIVATE_KEY not set – deployments will fail on real networks");
}
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
      evmVersion: "paris",
      metadata: { bytecodeHash: "none" },
    },
  },

  networks: {
    hardhat: {
      chainId: 31337,
    },

    // Polygon Amoy Testnet
    amoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts,
      chainId: 80002,
      gasPrice: 35_000_000_000,   // 35 gwei
      timeout: 120_000,
    },

    // Polygon Mainnet
    polygon: {
      url: process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-rpc.com",
      accounts,
      chainId: 137,
      // gasPrice: "auto" works fine, or leave undefined to let wallet/node decide
    },
  },

  // ← Completely removed etherscan block → no API key needed, no warnings
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  mocha: {
    timeout: 200000,
  },
};

export default config;