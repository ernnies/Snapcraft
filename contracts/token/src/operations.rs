use linera_sdk::base::AccountOwner;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Operation {
    Transfer {
        to: AccountOwner,
        amount: u128,
    },
    Mint {
        to: AccountOwner,
        amount: u128,
    },
    Burn {
        from: AccountOwner,
        amount: u128,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Query {
    GetBalance { owner: AccountOwner },
    GetTotalSupply,
}