use linera_sdk::base::AccountOwner;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Operation {
    CreateWorkflow {
        name: String,
        steps: Vec<String>,
    },
    ExecuteWorkflow {
        workflow_id: u64,
    },
    DeactivateWorkflow {
        workflow_id: u64,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Query {
    GetWorkflow { id: u64 },
    GetWorkflowCount,
    GetUserWorkflows { owner: AccountOwner },
    GetAllWorkflowIds,
}