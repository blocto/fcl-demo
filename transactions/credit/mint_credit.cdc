import AniqueCredit from 0xANIQUEADDRESS

// This transaction mints AniqueCredit for both accounts using
// the minter stored on account.
transaction(amount: UFix64, recipientAddress: Address) {

    // Public Vault Receiver References for both accounts
    let receiverRef: &AnyResource{AniqueCredit.Receiver}

    // Private minter references for this account to mint tokens
    let minterRef: &AniqueCredit.VaultMinter

    prepare(acct: AuthAccount) {

        // Get the stored Minter reference for account 0x01
        self.minterRef = acct.borrow<&AniqueCredit.VaultMinter>(from: /storage/AniqueCreditMinter)
            ?? panic("Could not borrow owner's vault minter reference")

        // Retrieve public Vault Receiver references for both accounts
        let receiver = getAccount(recipientAddress)
        self.receiverRef = receiver.getCapability<&AniqueCredit.Vault{AniqueCredit.Receiver}>(/public/AniqueCreditReceiver)
            .borrow()
            ?? panic("Could not borrow owner's vault reference")
    }

    execute {
        // Mint tokens for both accounts
        self.minterRef.mintTokens(amount: amount, recipient: self.receiverRef)
    }
}
