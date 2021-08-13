import Anique from 0xANIQUEADDRESS

// This script gets the metadata associated with a Collectible
// in a collection by looking up its itemID and then searching
// for that Item's metadata in the Anique contract

// Parameters
// account: The Flow Address of the account whose Collectible data needs to be read
// id: The unique ID for the Collectible whose data needs to be read
//
// Returns: {String: String} A dictionary of all the Item metadata associated
// with the specified Collectible

pub fun main(accountAddress: Address, id: UInt64): {String: String} {

    let account = getAccount(accountAddress)

    // get the public capability for the owner's Collectible collection
    // and borrow a reference to it
    let collectionRef = getAccount(accountAddress).getCapability(/public/CollectibleCollection)
        .borrow<&{Anique.CollectibleCollectionPublic}>()
        ?? panic("Could not get public CollectibleCollection reference")

    // Borrow a reference to the specified Collectible
    let token = collectionRef.borrowCollectible(id: id)
        ?? panic("Could not borrow a reference to the specified Collectible")

    // Get the collectibleData's metadata to access its item
    let data = token.data

    // Use the CollectibleData's Item ID
    // to get all the metadata associated with that Item
    let metadata = Anique.getItemMetaData(itemID: data.itemID)
        ?? panic("Item doesn't exist")

    return metadata
}
