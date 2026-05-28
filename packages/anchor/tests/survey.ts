import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';

describe('survey program', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // TODO(MVP-1): once IDL is generated, import the Survey type and exercise:
  //   - happy path: create -> stake -> settle -> claim
  //   - failures: double-stake (AlreadyStaked), wrong validator (UnauthorizedValidator)
  //   - edge: survey full (SurveyFull), claim before settle (StakeNotSettled)

  it('placeholder — replace once instructions are implemented', () => {
    expect(provider.connection.rpcEndpoint).to.be.a('string');
  });
});
