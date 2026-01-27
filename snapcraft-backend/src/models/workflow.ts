export interface Workflow {
  name: string;
  steps: string[];
  timestamp: string;
  rootHash?: string;
}