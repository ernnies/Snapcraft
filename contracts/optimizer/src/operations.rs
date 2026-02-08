use linera_sdk::base::ApplicationId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Operation {
    AutoRebalance {
        token_in: ApplicationId,  // Fungible token app ID
        token_out: ApplicationId,
        amount_in: u128,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Query {
    GetDexRouter,  // Placeholder
}