use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Stake {
    pub survey: Pubkey,
    pub participant: Pubkey,
    pub locked_lamports: u64,
    pub commitment_hash: [u8; 32],
    pub verdict: StakeVerdict,
    pub claimed: bool,
    pub bump: u8,
    pub committed_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug)]
pub enum StakeVerdict {
    Pending,
    Honest,
    Spam,
}
