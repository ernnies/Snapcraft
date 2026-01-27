export interface Workflow {
  name: string;
  steps: string[];
  timestamp: string;
  rootHash?: string; // Optional, set after upload
}