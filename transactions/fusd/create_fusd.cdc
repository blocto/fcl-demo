import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xd284f03bf25ea331

transaction {
    prepare(acct: AuthAccount) {

        // Second, check to see if an AniqueCredit vault already exists
        if acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {

            // create a new vault instance with an initial balance of 0
            let vaultA <- FUSD.createEmptyVault() as! @FUSD.Vault

            // Store the vault in the account storage
            acct.save(<-vaultA, to: /storage/fusdVault)

            // Create a public Receiver capability to the Vault
            acct.link<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance, target: /storage/fusdVault)
        }
    }
}
