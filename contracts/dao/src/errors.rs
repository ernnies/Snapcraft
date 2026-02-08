use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Workflow not found")]
    WorkflowNotFound,

    #[error("Workflow is inactive")]
    WorkflowInactive,

    #[error("Not the owner of this workflow")]
    NotOwner,

    #[error("Invalid workflow ID")]
    InvalidWorkflowId,

    #[error("View error: {0}")]
    ViewError(#[from] linera_views::views::ViewError),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Other error: {0}")]
    Other(#[from] anyhow::Error),
}