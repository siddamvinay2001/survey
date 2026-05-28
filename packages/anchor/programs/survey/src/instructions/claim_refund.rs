use anchor_lang::prelude::*;

use crate::state::*;

/// Used after a survey closes WITHOUT being settled (e.g. timeout), allowing
/// participants to recover their stake. Spam-verdict stakes never refund; their
/// lamports stay in the reward pool to be distributed by `claim_reward`.
#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    #[account(mut)]
    pub participant: Signer<'info>,

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

pub fn handler(_ctx: Context<ClaimRefund>) -> Result<()> {
    // TODO(MVP-1):
    // 1. require!(stake.verdict == Pending && survey.state == Closed, StakeNotSettled)
    //    (or honest-without-reward in degraded cases; see threat model)
    // 2. require!(!stake.claimed, AlreadyClaimed)
    // 3. CPI vault -> participant for stake.locked_lamports
    // 4. stake.claimed = true
    Ok(())
}
