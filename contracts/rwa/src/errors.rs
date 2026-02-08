use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Token not found")]
    TokenNotFound,

    #[error("Not owner")]
    NotOwner,

    #[error("View error: {0}")]
    ViewError(#[from] linera_views::views::ViewError),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Other error: {0}")]
    Other(#[from] anyhow::Error),
}