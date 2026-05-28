//! Survey: stake-and-slash escrow program.
//!
//! See `docs/on-chain-program.md` for the account layouts and the lifecycle of
//! a survey. This file is the program entrypoint — handlers live in
//! `instructions/`, accounts in `state/`, and error codes in `errors.rs`.

use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("SurveyProgram111111111111111111111111111111");

#[program]
pub mod survey {
    use super::*;

    pub fn create_survey(
        ctx: Context<CreateSurvey>,
        params: CreateSurveyParams,
    ) -> Result<()> {
        instructions::create_survey::handler(ctx, params)
    }

    pub fn stake_and_commit(
        ctx: Context<StakeAndCommit>,
        commitment_hash: [u8; 32],
    ) -> Result<()> {
        instructions::stake_and_commit::handler(ctx, commitment_hash)
    }

    pub fn settle(ctx: Context<Settle>, verdicts: Vec<Verdict>) -> Result<()> {
        instructions::settle::handler(ctx, verdicts)
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        instructions::claim_reward::handler(ctx)
    }

    pub fn claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
        instructions::claim_refund::handler(ctx)
    }
}
