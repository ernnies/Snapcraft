use linera_sdk::base::AccountOwner;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Operation {
    TokenizeAsset {
        to: AccountOwner,
        metadata_uri: String,
        asset_type: String,
    },
    Transfer {
        token_id: u64,
        to: AccountOwner,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Query {
    GetAsset { token_id: u64 },
    GetOwnerTokens { owner: AccountOwner },
    GetTokenURI { token_id: u64 },
}