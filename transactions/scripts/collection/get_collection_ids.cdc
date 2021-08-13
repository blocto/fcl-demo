import Anique from 0xANIQUEADDRESS

// This is the script to get a list of all the Collectibles an account owns
// Just change the argument to `getAccount` to whatever account you want
// and as long as they have a published Collection receiver, you can see
// the Collectibles they own.

pub fun main(accountAddress: Address): [UInt64] {

    let account = getAccount(accountAddress)

    let collectionRef = account.getCapability(/public/CollectibleCollection)
        .borrow<&{Anique.CollectibleCollectionPublic}>()
        ?? panic("Could not get public Collectible collection reference")

    return collectionRef.getIDs()
}
