use anchor_lang::prelude::*;

use crate::state::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug)]
pub struct Verdict {
    pub participant: Pubkey,
    pub is_honest: bool,
}

#[derive(Accounts)]
pub struct Settle<'info> {
    pub validator: Signer<'info>,

    #[account(
        mut,
        has_one = validator,
    )]
    pub survey: Account<'info, Survey>,
    // Stake accounts and the vault are passed via `remaining_accounts`. Each
    // verdict's participant pubkey is used to derive its Stake PDA which must
    // appear at the matching index in remaining_accounts.
}

pub fn handler(_ctx: Context<Settle>, _verdicts: Vec<Verdict>) -> Result<()> {
    // TODO(MVP-1):
    // 1. require validator signature matches survey.validator (has_one already does this)
    // 2. require!(survey.state == Open || Closed, InvalidSurveyState)
    // 3. For each verdict:
    //    a. Find Stake PDA in remaining_accounts at the same index
    //    b. require stake.survey == survey.key()
    //    c. require stake.verdict == Pending
    //    d. set stake.verdict = if is_honest { Honest } else { Spam }
    // 4. survey.settled_participants += len(verdicts)
    // 5. If settled_participants == current_participants -> survey.state = Settled
    // 6. Emit SurveySettled event with counts
    Ok(())
}
