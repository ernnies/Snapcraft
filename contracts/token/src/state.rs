use linera_sdk::{
    base::{AccountOwner, ContractRuntime, ServiceRuntime},
    views::{MapView, RegisterView, ViewStorageContext},
};
use linera_views::views::ViewError;
use serde::{Deserialize, Serialize};

use super::errors::Error;
use super::operations::{Operation, Query};

const NAME: &str = "C0mrad";
const SYMBOL: &str = "CMR";
const DECIMALS: u8 = 18;
const INITIAL_SUPPLY: u128 = 1_000_000 * 10u128.pow(DECIMALS as u32);

#[derive(linera_sdk::views::ViewStorage)]
pub struct TokenState {
    pub balances: MapView<AccountOwner, u128>,
    pub total_supply: RegisterView<u128>,
    // For voting power, add: voting_power: MapView<AccountOwner, u128>,
}

#[contract]
impl Contract for TokenState {
    type Error = Error;
    type Operation = Operation;
    type ApplicationCall = ();
    type SessionState = ();

    async fn new(runtime: ContractRuntime<Self>) -> Result<Self, Self::Error> {
        let context = ViewStorageContext::from(runtime.root_view_storage_context());
        let mut state = Self {
            balances: MapView::load(context.clone().sub("balances"))?,
            total_supply: RegisterView::load(context.sub("total_supply"))?,
        };
        // Initial mint to creator
        let creator = runtime.authenticated_signer();
        state.total_supply.set(INITIAL_SUPPLY);
        state.balances.insert(&creator, INITIAL_SUPPLY)?;
        Ok(state)
    }

    async fn execute_operation(&mut self, operation: Operation) -> Result<(), Self::Error> {
        let caller = self.runtime().authenticated_signer();

        match operation {
            Operation::Transfer { to, amount } => {
                let mut from_balance = self.balances.get(&caller).await?.unwrap_or(0);
                if from_balance < amount {
                    return Err(Error::InsufficientBalance);
                }
                from_balance -= amount;
                self.balances.insert(&caller, from_balance)?;

                let mut to_balance = self.balances.get(&to).await?.unwrap_or(0);
                to_balance += amount;
                self.balances.insert(&to, to_balance)?;
            }
            Operation::Mint { to, amount } => {
                // Restrict to caller == admin in production
                let mut total = self.total_supply.get().await?;
                total += amount;
                self.total_supply.set(total);

                let mut balance = self.balances.get(&to).await?.unwrap_or(0);
                balance += amount;
                self.balances.insert(&to, balance)?;
            }
            Operation::Burn { from, amount } => {
                if from != caller {
                    return Err(Error::Unauthorized);
                }
                let mut balance = self.balances.get(&from).await?.unwrap_or(0);
                if balance < amount {
                    return Err(Error::InsufficientBalance);
                }
                balance -= amount;
                self.balances.insert(&from, balance)?;

                let mut total = self.total_supply.get().await?;
                total -= amount;
                self.total_supply.set(total);
            }
        }
        Ok(())
    }
}

#[service]
impl Service for TokenState {
    type Error = Error;
    type Query = Query;

    async fn new(runtime: ServiceRuntime<Self>) -> Result<Self, Self::Error> {
        let context = ViewStorageContext::from(runtime.root_view_storage_context());
        Ok(Self {
            balances: MapView::load(context.clone().sub("balances"))?,
            total_supply: RegisterView::load(context.sub("total_supply"))?,
        })
    }

    async fn query(&self, query: Query) -> Result<String, Self::Error> {
        match query {
            Query::GetBalance { owner } => {
                let balance = self.balances.get(&owner).await?.unwrap_or(0);
                Ok(serde_json::to_string(&balance)?)
            }
            Query::GetTotalSupply => {
                let supply = self.total_supply.get().await?;
                Ok(serde_json::to_string(&supply)?)
            }
        }
    }
}