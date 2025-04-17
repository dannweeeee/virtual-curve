use std::u64;

use crate::{
    constants::seeds::POOL_AUTHORITY_PREFIX,
    state::{MigrationProgress, VirtualPool},
    *,
};
use anchor_spl::token::{transfer, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct MigrateMeteoraDammClaimLpTokenCtx<'info> {
    pub virtual_pool: AccountLoader<'info, VirtualPool>,

    /// migration metadata
    #[account(mut, has_one = lp_mint, has_one = virtual_pool)]
    pub migration_metadata: AccountLoader<'info, MeteoraDammMigrationMetadata>,

    /// CHECK: pool authority
    #[account(
        mut,
        seeds = [
            POOL_AUTHORITY_PREFIX.as_ref(),
        ],
        bump,
    )]
    pub pool_authority: UncheckedAccount<'info>,

    /// CHECK: lp_mint
    pub lp_mint: UncheckedAccount<'info>,

    /// CHECK:
    #[account(
        mut,
        associated_token::mint = migration_metadata.load()?.lp_mint,
        associated_token::authority = pool_authority.key()
    )]
    pub source_token: Box<Account<'info, TokenAccount>>,

    /// CHECK: destination token account
    #[account(
        mut,
        associated_token::mint = migration_metadata.load()?.lp_mint,
        associated_token::authority = owner.key()
    )]
    pub destination_token: Box<Account<'info, TokenAccount>>,

    /// CHECK: owner of lp token, must be creator or partner
    pub owner: UncheckedAccount<'info>,

    /// CHECK: signer
    pub sender: Signer<'info>,

    /// token_program
    pub token_program: Program<'info, Token>,
}

impl<'info> MigrateMeteoraDammClaimLpTokenCtx<'info> {
    fn transfer(&self, bump: u8, amount: u64) -> Result<()> {
        let pool_authority_seeds = pool_authority_seeds!(bump);

        transfer(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                Transfer {
                    from: self.source_token.to_account_info(),
                    to: self.destination_token.to_account_info(),
                    authority: self.pool_authority.to_account_info(),
                },
                &[&pool_authority_seeds[..]],
            ),
            amount,
        )?;

        Ok(())
    }
}
pub fn handle_migrate_meteora_damm_claim_lp_token<'info>(
    ctx: Context<'_, '_, '_, 'info, MigrateMeteoraDammClaimLpTokenCtx<'info>>,
) -> Result<()> {
    let virtual_pool = ctx.accounts.virtual_pool.load()?;

    require!(
        virtual_pool.get_migration_progress()? == MigrationProgress::CreatedPool,
        PoolError::NotPermitToDoThisAction
    );

    let mut migration_metadata = ctx.accounts.migration_metadata.load_mut()?;

    if ctx.accounts.owner.key() == migration_metadata.partner {
        require!(
            !migration_metadata.is_partner_claim_lp(),
            PoolError::NotPermitToDoThisAction
        );
        require!(
            migration_metadata.partner_lp != 0,
            PoolError::NotPermitToDoThisAction
        );
        migration_metadata.set_partner_claim_status();
        ctx.accounts
            .transfer(ctx.bumps.pool_authority, migration_metadata.partner_lp)?;
    } else if ctx.accounts.owner.key() == migration_metadata.pool_creator {
        require!(
            !migration_metadata.is_creator_claim_lp(),
            PoolError::NotPermitToDoThisAction
        );
        require!(
            migration_metadata.creator_lp != 0,
            PoolError::NotPermitToDoThisAction
        );

        migration_metadata.set_creator_claim_status();
        ctx.accounts
            .transfer(ctx.bumps.pool_authority, migration_metadata.creator_lp)?;
    } else {
        return Err(PoolError::InvalidOwnerAccount.into());
    }

    Ok(())
}
