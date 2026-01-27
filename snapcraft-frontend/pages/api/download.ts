import type { NextApiRequest, NextApiResponse } from 'next';
import { downloadWorkflow } from '../../lib/0g-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rootHash } = req.query;
    const workflow = await downloadWorkflow(rootHash as string);
    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}