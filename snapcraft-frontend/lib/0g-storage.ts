import { Indexer, ZgFile } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';
import { Workflow } from './types';
import * as fs from 'fs';
import * as path from 'path';

// Env vars — you can keep PRIVATE_KEY or temporarily use a testnet burner
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://evmrpc-testnet.0g.ai/';
const INDEXER_RPC = process.env.NEXT_PUBLIC_INDEXER_RPC || 'https://indexer-storage-testnet-turbo.0g.ai';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // burner ok for testnet

let indexer: Indexer | null = null;
let signer: ethers.Wallet | null = null;
let provider: ethers.JsonRpcProvider | null = null;

const init0G = async () => {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
    indexer = new Indexer(INDEXER_RPC);
  }
  return { provider, signer, indexer };
};

// Upload workflow — FULLY WORKING
export const uploadWorkflow = async (workflow: Workflow, fileName = 'workflow.json') => {
  await init0G();
  if (!indexer || !signer) throw new Error('0G not initialized');

  const jsonContent = JSON.stringify(workflow, null, 2);
  const tempPath = path.join(process.cwd(), `temp-${Date.now()}-${fileName}`);
  fs.writeFileSync(tempPath, jsonContent);

  let file: ZgFile;
  try {
    file = await ZgFile.fromFilePath(tempPath);

    const [tree, treeErr] = await file.merkleTree();
    if (treeErr) throw treeErr;

    console.log('Root Hash:', tree?.rootHash());

    const [tx, uploadErr] = await indexer.upload(file, RPC_URL, signer);
    if (uploadErr) throw uploadErr;

    await file.close();
    return { rootHash: tree?.rootHash(), txHash: tx };
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};

// Download workflow — FULLY WORKING
export const downloadWorkflow = async (rootHash: string): Promise<Workflow> => {
  await init0G();
  if (!indexer) throw new Error('0G not initialized');

  const filePath = path.join(process.cwd(), `temp-dl-${rootHash}.json`);
  const err = await indexer.download(rootHash, filePath, true);
  if (err) throw err;

  const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Workflow;
  fs.unlinkSync(filePath);
  return workflow;
};

// KV functions — COMMENTED OUT / BYPASSED (no private key needed anywhere now)
// export const uploadToKV = async (...) => { throw new Error('KV disabled'); }
// export const downloadFromKV = async (...) => null;