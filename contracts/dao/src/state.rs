use linera_sdk::{
    base::{AccountOwner, ContractRuntime, ServiceRuntime, Timestamp},
    views::{MapView, RegisterView, SetView, ViewStorageContext},
};
use linera_views::views::ViewError;
use serde::{Deserialize, Serialize};

use super::errors::Error;
use super::operations::{Operation, Query};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct Workflow {
    pub owner: AccountOwner,
    pub name: String,
    pub steps: Vec<String>,
    pub created_at: Timestamp,
    pub last_executed: Timestamp,
    pub is_active: bool,
    pub risk_score: u8,
    pub sustainability_score: u8,
}

#[derive(linera_sdk::views::ViewStorage)]
pub struct DaoState {
    pub workflow_count: RegisterView<u64>,
    pub workflows: MapView<u64, Workflow>,
    pub user_workflows: MapView<AccountOwner, SetView<u64>>,
}

#[contract]
impl Contract for DaoState {
    type Error = Error;
    type Operation = Operation;
    type ApplicationCall = ();
    type SessionState = ();

    async fn new(runtime: ContractRuntime<Self>) -> Result<Self, Self::Error> {
        let context = ViewStorageContext::from(runtime.root_view_storage_context());
        Ok(Self {
            workflow_count: RegisterView::load(context.clone().sub("count"))?,
            workflows: MapView::load(context.clone().sub("workflows"))?,
            user_workflows: MapView::load(context.sub("user_workflows"))?,
        })
    }

    async fn execute_operation(&mut self, operation: Operation) -> Result<(), Self::Error> {
        let caller = self.runtime().authenticated_signer();

        match operation {
            Operation::CreateWorkflow { name, steps } => {
                let mut count = self.workflow_count.get().await?;
                count += 1;
                self.workflow_count.set(count);

                let workflow = Workflow {
                    owner: caller,
                    name,
                    steps,
                    created_at: self.runtime().system_time(),
                    last_executed: Timestamp::from(0),
                    is_active: true,
                    risk_score: 0,
                    sustainability_score: 0,
                };
                self.workflows.insert(&count, workflow)?;

                let mut user_set = self.user_workflows.get_or_insert(&caller, SetView::default()).await?;
                user_set.insert(&count)?;
            }
            Operation::ExecuteWorkflow { workflow_id } => {
                if workflow_id == 0 || workflow_id > self.workflow_count.get().await? {
                    return Err(Error::InvalidWorkflowId);
                }
                let mut workflow = self.workflows.get(&workflow_id).await?.ok_or(Error::WorkflowNotFound)?;
                if !workflow.is_active {
                    return Err(Error::WorkflowInactive);
                }
                if workflow.owner != caller {
                    return Err(Error::NotOwner);
                }
                workflow.last_executed = self.runtime().system_time();
                self.workflows.insert(&workflow_id, workflow)?;
            }
            Operation::DeactivateWorkflow { workflow_id } => {
                if workflow_id == 0 || workflow_id > self.workflow_count.get().await? {
                    return Err(Error::InvalidWorkflowId);
                }
                let mut workflow = self.workflows.get(&workflow_id).await?.ok_or(Error::WorkflowNotFound)?;
                if workflow.owner != caller {
                    return Err(Error::NotOwner);
                }
                workflow.is_active = false;
                self.workflows.insert(&workflow_id, workflow)?;
            }
        }
        Ok(())
    }
}

#[service]
impl Service for DaoState {
    type Error = Error;
    type Query = Query;

    async fn new(runtime: ServiceRuntime<Self>) -> Result<Self, Self::Error> {
        let context = ViewStorageContext::from(runtime.root_view_storage_context());
        Ok(Self {
            workflow_count: RegisterView::load(context.clone().sub("count"))?,
            workflows: MapView::load(context.clone().sub("workflows"))?,
            user_workflows: MapView::load(context.sub("user_workflows"))?,
        })
    }

    async fn query(&self, query: Query) -> Result<String, Self::Error> {
        match query {
            Query::GetWorkflow { id } => {
                let workflow = self.workflows.get(&id).await?.ok_or(Error::WorkflowNotFound)?;
                Ok(serde_json::to_string(&workflow)?)
            }
            Query::GetWorkflowCount => {
                let count = self.workflow_count.get().await?;
                Ok(serde_json::to_string(&count)?)
            }
            Query::GetUserWorkflows { owner } => {
                let set = self.user_workflows.get(&owner).await?.ok_or(Error::WorkflowNotFound)?;
                let ids: Vec<u64> = set.iter().await?.collect::<Result<_, _>>()?;
                Ok(serde_json::to_string(&ids)?)
            }
            Query::GetAllWorkflowIds => {
                let count = self.workflow_count.get().await?;
                let mut ids = Vec::new();
                for i in 1..=count {
                    if self.workflows.contains_key(&i).await? {
                        ids.push(i);
                    }
                }
                Ok(serde_json::to_string(&ids)?)
            }
        }
    }
}