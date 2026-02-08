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
use state::RwaState;

linera_sdk::contract!(RwaState);
linera_sdk::service!(RwaState);