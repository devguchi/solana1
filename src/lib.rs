use solana_program:: {
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program_error::ProgramError
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    pub count: u32
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8]
) -> ProgramResult {
    msg!("Counter");
    let account = next_account_info(&mut accounts.iter())?;
    if account.owner != program_id {
        msg!("invalid account");
        return Err(ProgramError::IncorrectProgramId);
    }
    let mut counter_account = CounterAccount::try_from_slice(&account.data.borrow())?;
    counter_account.count += 1;
    counter_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
    msg!("Counter: {}", counter_account.count);
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;
    use std::mem;

    #[test]
    fn test1() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let mut data = vec![0; mem::size_of::<u32>()];
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default()
        );
        let instruction_data: Vec<u8> = vec![];
        let accounts = vec![account];
        let result = process_instruction(&program_id, &accounts, &instruction_data);
        assert_eq!(Ok(()), result);
    }
}