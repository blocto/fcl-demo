import NonFungibleToken from 0xNFTADDRESS
import Anique from 0xANIQUEADDRESS

// This transaction is what Anique uses to send the Collectibles in a "pack" to
// a user's collection

// Parameters:
//
// recipientAddr: the Flow address of the account receiving a pack of Collectibles
// collectibleIDs: an array of Collectible IDs to be withdrawn from the owner's Collectible collection

transaction(recipientAddr: Address, collectibleIDs: [UInt64]) {
    let collection: &Anique.Collection

    prepare(acct: AuthAccount) {
        // borrow a reference to the owner's moment collection
        self.collection = acct.borrow<&Anique.Collection>(from: /storage/CollectibleCollection)!
    }

    execute {
        // get the recipient's public account object
        let recipient = getAccount(recipientAddr)

        // borrow a reference to the recipient's moment collection
        let receiverRef = recipient.getCapability(/public/CollectibleCollection)
            .borrow<&{Anique.CollectibleCollectionPublic}>()!

        // Deposit the pack of moments to the recipient's collection
        receiverRef.batchDeposit(tokens: <-self.collection.batchWithdraw(collectibleIds: collectibleIDs))
    }
}
