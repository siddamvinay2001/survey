use anchor_lang::prelude::*;

use crate::state::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct CreateSurveyParams {
    pub survey_id: [u8; 32],
    pub content_hash: [u8; 32],
    pub stake_lamports: u64,
    pub reward_pool_lamports: u64,
    pub max_participants: u32,
    pub validator: Pubkey,
}

#[derive(Accounts)]
#[instruction(params: CreateSurveyParams)]
pub struct CreateSurvey<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Survey::INIT_SPACE,
        seeds = [SURVEY_SEED, params.survey_id.as_ref()],
        bump,
    )]
    pub survey: Account<'info, Survey>,

    /// CHECK: PDA holding the reward pool lamports; validated by seeds + bump.
    #[account(
        mut,
        seeds = [VAULT_SEED, survey.key().as_ref()],
        bump,
    )]
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<CreateSurvey>, _params: CreateSurveyParams) -> Result<()> {
    // TODO(MVP-1):
    // 1. Initialize Survey account fields from params (state = Open, counts = 0).
    // 2. CPI System::transfer from creator → vault for reward_pool_lamports.
    // 3. Emit SurveyCreated event.
    Ok(())
}
