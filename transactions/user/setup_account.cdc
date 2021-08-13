import Anique from 0xANIQUEADDRESS
import AniqueCredit from 0xANIQUEADDRESS

// This transaction sets up an account to use Anique
// by storing an empty Collectible collection and creating
// a public capability for it

transaction {

    prepare(acct: AuthAccount) {

        // First, check to see if a CollectibleData collection already exists
        if acct.borrow<&Anique.Collection>(from: /storage/CollectibleCollection) == nil {

            // create a new Anique Collection
            let collection <- Anique.createEmptyCollection() as! @Anique.Collection

            // Put the new Collection in storage
            acct.save(<-collection, to: /storage/CollectibleCollection)

            // create a public capability for the collection
            acct.link<&{Anique.CollectibleCollectionPublic}>(/public/CollectibleCollection, target: /storage/CollectibleCollection)
        }

        // Second, check to see if an AniqueCredit vault already exists
        if acct.borrow<&AniqueCredit.Vault>(from: /storage/AniqueCreditVault) == nil {

            // create a new vault instance with an initial balance of 0
            let vaultA <- AniqueCredit.createEmptyVault() as! @AniqueCredit.Vault

            // Store the vault in the account storage
            acct.save(<-vaultA, to: /storage/AniqueCreditVault)

            // Create a public Receiver capability to the Vault
            acct.link<&AniqueCredit.Vault{AniqueCredit.Receiver, AniqueCredit.Balance}>(/public/AniqueCreditReceiver, target: /storage/AniqueCreditVault)
        }
    }
}
