import AniqueCredit from 0xANIQUEADDRESS
import Anique from 0xANIQUEADDRESS

// This transaction creates a new Sale Collection object,
// lists an NFT for sale, puts it in account storage,
// and creates a public capability to the sale so that others can buy the token.
transaction(amount: UFix64, recipientAddress: Address) {

    prepare(account: AuthAccount, admin: AuthAccount) {

        let adminRef = admin.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)
            ?? panic("Could not borrow admin's AniqueAdmin reference")

        // Borrow a reference to the stored Vault (in person)
        let vaultRef = account.borrow<&AniqueCredit.Vault>(from: /storage/AniqueCreditVault)
            ?? panic("Could not borrow owner's vault reference")

        let vault <- vaultRef.withdraw(amount: amount, admin: adminRef)

        // Borrow a reference to the public Vault (others)
        let recipient = getAccount(recipientAddress)
        let recipientRef = recipient.getCapability<&AniqueCredit.Vault{AniqueCredit.Receiver}>(/public/AniqueCreditReceiver)
            .borrow()
            ?? panic("Could not borrow account's vault reference")

        recipientRef.deposit(from: <- vault)
    }
}
