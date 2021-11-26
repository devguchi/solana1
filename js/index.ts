import {
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  SystemProgram,
  Connection
} from '@solana/web3.js';
import { airdrop } from './lib';
import {
  PublicKeyType,
  KeypairType,
  counterAccount,
  serializeCounterAccount
} from './model';

const PROGRAM_ID = '7ok8UsKfTd82h3D3CybnVjnchFs9vEtSVYhhLYoYPVyK';
const SEED = 'test';
const connection = new Connection(clusterApiUrl('devnet'));

const createAccountKey = async (
  pubkey: PublicKeyType
): Promise<PublicKeyType> => {
  const programId = new PublicKey(PROGRAM_ID);
  return await PublicKey.createWithSeed(pubkey, SEED, programId);
};

const createAccount = async (
  keypair: KeypairType,
  accountKey: PublicKeyType
) => {
  const account = await connection.getAccountInfo(accountKey);
  if (account !== null) return;
  const dataSize = serializeCounterAccount(counterAccount).length;
  const minBalance = await connection.getMinimumBalanceForRentExemption(
    dataSize
  );
  const txInstruction = SystemProgram.createAccountWithSeed({
    fromPubkey: keypair.publicKey,
    basePubkey: keypair.publicKey,
    seed: SEED,
    newAccountPubkey: accountKey,
    lamports: minBalance,
    space: dataSize,
    programId: new PublicKey(PROGRAM_ID)
  });
  const createAccountTx = new Transaction().add(txInstruction);
  const tx = await sendAndConfirmTransaction(connection, createAccountTx, [
    keypair
  ]);
  console.log(`created account: ${tx}`);
};

const main = async () => {
  const keypair = Keypair.generate();
  await airdrop(connection, keypair.publicKey);
  const accountKey = await createAccountKey(keypair.publicKey);
  await createAccount(keypair, accountKey);
  const transaction = new Transaction();
  const txInstruction = new TransactionInstruction({
    keys: [{ pubkey: accountKey, isSigner: false, isWritable: true }],
    programId: new PublicKey(PROGRAM_ID),
    data: Buffer.from('')
  });
  transaction.add(txInstruction);
  const tx = await sendAndConfirmTransaction(connection, transaction, [
    keypair
  ]).catch((e) => {
    console.log(e);
  });
  console.log(tx);
};

main();
