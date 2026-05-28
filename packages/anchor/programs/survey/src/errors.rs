use anchor_lang::prelude::*;

#[error_code]
pub enum SurveyError {
    #[msg("Survey is not in the expected state for this action")]
    InvalidSurveyState,
    #[msg("Participant has already staked for this survey")]
    AlreadyStaked,
    #[msg("Maximum participant count reached")]
    SurveyFull,
    #[msg("Caller is not the authorized validator for this survey")]
    UnauthorizedValidator,
    #[msg("Caller is not the survey creator")]
    UnauthorizedCreator,
    #[msg("Verdict list size does not match committed stake count")]
    VerdictCountMismatch,
    #[msg("Numerical overflow")]
    MathOverflow,
    #[msg("Reward pool would be exceeded by this payout")]
    InsufficientRewardPool,
    #[msg("This stake has already been settled")]
    StakeAlreadySettled,
    #[msg("Stake has not been settled yet")]
    StakeNotSettled,
}
