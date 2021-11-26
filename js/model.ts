import * as borsh from 'borsh';
import { PublicKey, Keypair } from '@solana/web3.js';

const pubkey = new PublicKey(123);
export type PublicKeyType = typeof pubkey;

const keypair = Keypair.generate();
export type KeypairType = typeof keypair;

export type CounterAccount = {
  count: number;
};
export const counterAccount = {
  count: 0
};
const counterAccountSchema = new Map([
  [
    Object,
    {
      kind: 'struct',
      fields: [['count', 'u32']]
    }
  ]
]);
export const serializeCounterAccount = (
  counterAccount: CounterAccount
): Uint8Array => {
  return borsh.serialize(counterAccountSchema, counterAccount);
};
export const deserializeCounterAccount = (data: Buffer): CounterAccount => {
  return borsh.deserialize(
    counterAccountSchema,
    Object,
    data
  ) as CounterAccount;
};
