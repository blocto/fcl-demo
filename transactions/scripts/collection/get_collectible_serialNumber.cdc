import Anique from 0xANIQUEADDRESS

// This transaction gets the serial number of an Collectible
// by borrowing a reference to the Collectible
// and returning its serial number

pub fun main(accountAddress: Address, id: UInt64): UInt32 {

    let account = getAccount(accountAddress)

    let collectionRef = account.getCapability(/public/CollectibleCollection)
        .borrow<&{Anique.CollectibleCollectionPublic}>()
        ?? panic("Could not get public CollectibleCollection reference")

    let collectible = collectionRef.borrowCollectible(id: id)
        ?? panic("Could not borrow a reference to the specified Collectible")

    return collectible.data.serialNumber
}
