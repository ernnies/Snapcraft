import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadWorkflow } from '../../lib/0g-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflow, fileName } = req.body;
    const result = await uploadWorkflow(workflow, fileName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}