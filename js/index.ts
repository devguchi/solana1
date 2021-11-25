import {
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection
} from '@solana/web3.js';
import { airdrop } from './lib';

const PROGRAM_ID = '7ok8UsKfTd82h3D3CybnVjnchFs9vEtSVYhhLYoYPVyK';

const main = async () => {
  const keypair = Keypair.generate();
  const connection = new Connection(clusterApiUrl('devnet'));
  const transaction = new Transaction();
  const instruction = new TransactionInstruction({
    keys: [],
    programId: new PublicKey(PROGRAM_ID),
    data: Buffer.from('')
  });
  transaction.add(instruction);
  await airdrop(connection, keypair.publicKey);
  const tx = await sendAndConfirmTransaction(connection, transaction, [
    keypair
  ]).catch((e) => {
    console.log(e);
  });
  console.log(tx);
};

main();
