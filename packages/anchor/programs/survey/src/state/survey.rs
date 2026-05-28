use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Survey {
    pub creator: Pubkey,
    pub validator: Pubkey,
    pub content_hash: [u8; 32],
    pub stake_lamports: u64,
    pub reward_pool_lamports: u64,
    pub max_participants: u32,
    pub current_participants: u32,
    pub settled_participants: u32,
    pub state: SurveyState,
    pub bump: u8,
    pub vault_bump: u8,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug)]
pub enum SurveyState {
    Open,
    Closed,
    Settled,
}
