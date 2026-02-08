// SPDX-License-Identifier: MIT

pub mod errors;
pub mod operations;
pub mod state;

use errors::Error;
use linera_sdk::{
    base::{ContractRuntime, ServiceRuntime},
    contract::{Contract, ContractRuntime as _},
    service::{Service, ServiceRuntime as _},
};
use operations::{Operation, Query};
use state::TokenState;

linera_sdk::contract!(TokenState);
linera_sdk::service!(TokenState);