use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub participant: Signer<'info>,

    #[account(mut)]
    pub survey: Account<'info, Survey>,

    #[account(
        mut,
        seeds = [STAKE_SEED, survey.key().as_ref(), participant.key().as_ref()],
        bump = stake.bump,
        has_one = participant,
    )]
    pub stake: Account<'info, Stake>,

    /// CHECK: Vault PDA validated by seeds.
    #[account(
        mut,
        seeds = [VAULT_SEED, survey.key().as_ref()],
        bump = survey.vault_bump,
    )]
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<ClaimReward>) -> Result<()> {
    // TODO(MVP-1):
    // 1. require!(stake.verdict == Honest, StakeNotSettled / wrong verdict)
    // 2. require!(!stake.claimed, AlreadyClaimed)
    // 3. Calculate reward share: survey.reward_pool_lamports / honest_count
    //    (honest_count = survey.settled_participants - spam_count; tracked on-chain)
    // 4. CPI vault -> participant for (stake.locked_lamports + reward_share)
    // 5. stake.claimed = true
    Ok(())
}
