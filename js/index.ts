const {
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection
} = require('@solana/web3.js');

const main = async () => {
  const fromKeypair = Keypair.generate();
  const toKeypair = Keypair.generate();
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: LAMPORTS_PER_SOL / 2
    })
  );
  const connection = new Connection(clusterApiUrl('testnet'));
  if (!(await airdrop(connection, fromKeypair.publicKey))) return;
  await showBalance(connection, fromKeypair.publicKey);
  await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
  await showBalance(connection, toKeypair.publicKey);
};

const airdrop = async (connection: any, publicKey: any) => {
  try {
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const showBalance = async (connection: any, publicKey: any) => {
  console.log(await connection.getBalance(publicKey));
};

main();
