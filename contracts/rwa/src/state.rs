use linera_sdk::{
    base::{AccountOwner, ContractRuntime, ServiceRuntime},
    views::{MapView, RegisterView, ViewStorageContext},
};
use linera_views::views::ViewError;
use serde::{Deserialize, Serialize};

use super::errors::Error;
use super::operations::{Operation, Query};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Asset {
    pub owner: AccountOwner,
    pub metadata_uri: String,
    pub asset_type: String,
}

#[derive(linera_sdk::views::ViewStorage)]
pub struct RwaState {
    pub next_token_id: RegisterView<u64>,
    pub assets: MapView<u64, Asset>,
    pub owner_tokens: MapView<AccountOwner, Vec<u64>>,  // Use SetView for production
}

#[contract]
impl Contract for RwaState {
    type Error = Error;
    type Operation = Operation;
    type ApplicationCall = ();
    type SessionState = ();

    async fn new(runtime: ContractRuntime<Self>) -> Result<Self, Self::Error> {
        let context = ViewStorageContext::from(runtime.root_view_storage_context());
        Ok(Self {
            next_token_id: RegisterView::load(context.clone().sub("next_id"))?,
            assets: MapView::load(context.clone().sub("assets"))?,
            owner_tokens: MapView::load(context.sub("owner_tokens"))?,
        })
    }

    async fn execute_operation(&mut self, operation: Operation) -> Result<(), Self::Error> {
        let caller = self.runtime().authenticated_signer();

        match operation {
            Operation::TokenizeAsset { to, metadata_uri, asset_type } => {
                let mut id = self.next_token_id.get().await?;
                id += 1;
                self.next_token_id.set(id);

                let asset = Asset {
                    owner: to,
                    metadata_uri,
                    asset_type,
                };
                self.assets.insert(&id, asset)?;

                let mut tokens = self.owner_tokens.get(&to).await?.unwrap_or_default();
                tokens.push(id);
                self.owner_tokens.insert(&to, tokens)?;
            }
            Operation::Transfer { token_id, to } => {
                let mut asset = self.assets.get(&token_id).await?.ok_or(Error::TokenNotFound)?;
                let from = asset.owner;
                if from != caller {
                    return Err(Error::NotOwner);
                }
                asset.owner = to;
                self.assets.insert(&token_id, asset)?;

                // Update owner_tokens (remove from from, add to to)
                if let Some(mut from_tokens) = self.owner_tokens.get(&from).await? {
                    from_tokens.retain(|&x| x != token_id);
                    self.owner_tokens.insert(&from, from_tokens)?;
                }
                let mut to_tokens = self.owner_tokens.get(&to).await?.unwrap_or_default();
                to_tokens.push(token_id);
                self.owner_tokens.insert(&to, to_tokens)?;
            }
        }
        Ok(())
    }
}

#[service]
impl Service for RwaState {
    type Error = Error;
    type Query = Query;

    async fn new(runtime: ServiceRuntime<Self>) -> Result<Self, Self::Error> {
        let context = ViewStorageContext::from(runtime.root_view_storage_context());
        Ok(Self {
            next_token_id: RegisterView::load(context.clone().sub("next_id"))?,
            assets: MapView::load(context.clone().sub("assets"))?,
            owner_tokens: MapView::load(context.sub("owner_tokens"))?,
        })
    }

    async fn query(&self, query: Query) -> Result<String, Self::Error> {
        match query {
            Query::GetAsset { token_id } => {
                let asset = self.assets.get(&token_id).await?.ok_or(Error::TokenNotFound)?;
                Ok(serde_json::to_string(&asset)?)
            }
            Query::GetOwnerTokens { owner } => {
                let tokens = self.owner_tokens.get(&owner).await?.unwrap_or_default();
                Ok(serde_json::to_string(&tokens)?)
            }
            Query::GetTokenURI { token_id } => {
                let asset = self.assets.get(&token_id).await?.ok_or(Error::TokenNotFound)?;
                Ok(serde_json::to_string(&asset.metadata_uri)?)
            }
        }
    }
}