import Anique from 0xANIQUEADDRESS

// This transaction mints multiple collectibleDatas from a single Item
// and deposit them to a single account

// Parameters
//
// setID: the ID of the set to be minted from
// itemID: the ID of the Item from which the CollectibleDatas are minted
// quantity: the quantity of CollectibleDatas to be minted
// recipientAddr: the Flow address of the account receiving the collection of minted CollectibleDatas

transaction(setID: UInt32, itemID: UInt32, quantity: UInt64, recipientAddress: Address) {

    // Local variable for the Anique Admin object
    let adminRef: &Anique.Admin

    prepare(account: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = account.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)!
    }

    execute {

        // borrow a reference to the set to be minted from
        let setRef = self.adminRef.borrowSet(setID: setID)

        // Mint all the new NFTs
        let collection <- setRef.batchMintCollectible(itemID: itemID, quantity: quantity)

        // Get the account object for the recipient of the minted tokens
        let recipient = getAccount(recipientAddress)

        // get the Collection reference for the receiver
        let receiverRef = recipient.getCapability(/public/CollectibleCollection)
            .borrow<&{Anique.CollectibleCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's collection")

        // deposit the NFT in the receivers collection
        receiverRef.batchDeposit(tokens: <-collection)
    }
}
