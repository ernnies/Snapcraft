import { Request, Response } from "express";
import { Workflow } from "../models/workflow";
import * as crypto from "crypto"; // For fake hashes

// Mock in-memory storage
const storedWorkflows: { [rootHash: string]: Workflow } = {};

// Mock upload - simulates 0G Storage
export const uploadWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflow, fileName = "workflow.json" } = req.body as {
      workflow: Workflow;
      fileName?: string;
    };

    // Generate fake root hash (simulate Merkle tree)
    const fakeRootHash = "0x" + crypto.randomBytes(32).toString("hex").substring(0, 64);
    const fakeTxHash = "0x" + crypto.randomBytes(32).toString("hex").substring(0, 66);

    // "Store" in mock storage
    storedWorkflows[fakeRootHash] = workflow;

    // Simulate delay for upload
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`Mock upload: ${workflow.name} → ${fakeRootHash}`);
    res.status(200).json({ rootHash: fakeRootHash, txHash: fakeTxHash });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Mock download - retrieves from in-memory storage
export const downloadWorkflow = async (req: Request, res: Response) => {
  try {
    const { rootHash } = req.params;

    const workflow = storedWorkflows[rootHash];
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    // Simulate download delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(`Mock download: ${rootHash}`);
    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};