use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction(commitment_hash: [u8; 32])]
pub struct StakeAndCommit<'info> {
    #[account(mut)]
    pub participant: Signer<'info>,

    #[account(
        mut,
        seeds = [SURVEY_SEED, /* survey_id derivation — caller passes survey PDA */ &[]],
        bump = survey.bump,
    )]
    pub survey: Account<'info, Survey>,

    #[account(
        init,
        payer = participant,
        space = 8 + Stake::INIT_SPACE,
        seeds = [STAKE_SEED, survey.key().as_ref(), participant.key().as_ref()],
        bump,
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

pub fn handler(
    _ctx: Context<StakeAndCommit>,
    _commitment_hash: [u8; 32],
) -> Result<()> {
    // TODO(MVP-1):
    // 1. require!(survey.state == Open, InvalidSurveyState)
    // 2. require!(survey.current_participants < survey.max_participants, SurveyFull)
    // 3. CPI System::transfer participant → vault for survey.stake_lamports
    // 4. Initialize Stake { commitment_hash, verdict = Pending, claimed = false }
    // 5. survey.current_participants += 1 (checked)
    // 6. Emit StakeCommitted event
    Ok(())
}
