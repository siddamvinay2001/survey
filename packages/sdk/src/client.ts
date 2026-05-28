import { AnchorProvider, Program, type Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey, type Keypair } from '@solana/web3.js';

import type { SurveyIdl } from './idl/index.js';

export interface SurveyClientConfig {
  rpcUrl: string;
  programId: string;
  walletPublicKey: PublicKey;
  signTransaction: AnchorProvider['wallet']['signTransaction'];
  signAllTransactions: AnchorProvider['wallet']['signAllTransactions'];
}

export class SurveyClient {
  readonly program: Program<SurveyIdl>;
  readonly connection: Connection;
  readonly programId: PublicKey;

  constructor(config: SurveyClientConfig, idl: Idl) {
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    this.programId = new PublicKey(config.programId);

    const provider = new AnchorProvider(
      this.connection,
      {
        publicKey: config.walletPublicKey,
        signTransaction: config.signTransaction,
        signAllTransactions: config.signAllTransactions,
      },
      { commitment: 'confirmed' },
    );

    this.program = new Program(idl, provider) as unknown as Program<SurveyIdl>;
  }

  // TODO(MVP-1): wrap instructions with typed args + PDA derivation:
  //   createSurvey(params) -> tx
  //   stakeAndCommit(surveyPda, commitmentHash) -> tx
  //   settle(surveyPda, verdicts, validatorKeypair) -> tx (server-only)
  //   claimReward(surveyPda) -> tx
  //   claimRefund(surveyPda) -> tx

  static serverClient(
    _rpcUrl: string,
    _programId: string,
    _validator: Keypair,
    _idl: Idl,
  ): SurveyClient {
    throw new Error('TODO(MVP-1): implement server-side client with validator keypair');
  }
}
