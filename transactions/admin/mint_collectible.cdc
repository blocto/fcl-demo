import Anique from 0xANIQUEADDRESS

// This transaction is what an admin would use to mint a single new Collectible
// and deposit it in a user's collection

// Parameters
//
// setID: the ID of the set to be minted from
// itemID: the ID of a Item from which a new Collectible is minted
// recipientAddr: the Flow address of the account receiving the newly minted Collectible

transaction(setID: UInt32, itemID: UInt32, recipientAddr: Address) {
    // local variable for the admin reference
    let adminRef: &Anique.Admin

    prepare(account: AuthAccount) {
        // borrow a reference to the Admin resource in storage
        self.adminRef = account.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)!
    }

    execute {

        // Borrow a reference to the specified set
        let setRef = self.adminRef.borrowSet(setID: setID)

        // Mint a new NFT
        let collectible <- setRef.mintCollectible(itemID: itemID)

        // get the public account object for the recipient
        let recipient = getAccount(recipientAddr)

        // get the Collection reference for the receiver
        let receiverRef = recipient.getCapability(/public/CollectibleCollection).borrow<&{Anique.CollectibleCollectionPublic}>()!

        // deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-collectible)
    }
}
