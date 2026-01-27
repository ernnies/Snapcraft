import { Indexer } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.RPC_URL!;
const INDEXER_RPC = process.env.INDEXER_RPC!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY missing in .env");

export const init0G = async () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const indexer = new Indexer(INDEXER_RPC);
  return { provider, signer, indexer };
};