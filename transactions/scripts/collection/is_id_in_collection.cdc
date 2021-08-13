import Anique from 0xANIQUEADDRESS

// This script returns true if a Collectible with the specified ID
// exists in a user's collection

pub fun main(accountAddress: Address, id: UInt64): Bool {

    let account = getAccount(accountAddress)

    let collectionRef = account.getCapability(/public/CollectibleCollection)
        .borrow<&{Anique.CollectibleCollectionPublic}>()
        ?? panic("Could not get public CollectibleCollection reference")

    return collectionRef.contains(id: id)
}
