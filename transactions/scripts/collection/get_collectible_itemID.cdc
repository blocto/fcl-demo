import Anique from 0xANIQUEADDRESS

// This transaction gets the itemID associated with a Collectible
// in a collection by getting a reference to the Collectible
// and then looking up its itemID

pub fun main(accountAddress: Address, id: UInt64): UInt32 {

    let account = getAccount(accountAddress)

    let collectionRef = account.getCapability(/public/CollectibleCollection)
        .borrow<&{Anique.CollectibleCollectionPublic}>()
        ?? panic("Could not get public CollectibleCollection reference")

    let collectible = collectionRef.borrowCollectible(id: id)
        ?? panic("Could not borrow a reference to the specified Collectible")

    return collectible.data.itemID
}
