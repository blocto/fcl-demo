import Anique from 0xANIQUEADDRESS

// This script gets the Set ID associated with a Collectible
// in a collection by getting a reference to the Collectible
// and then looking up its series

// Parameters:
//
// account: The Flow Address of the account whose Collectible data needs to be read
// id: The unique ID for the Collectible whose data needs to be read

// Returns: SetData
// The SetData associated with a Collectible with a specified ID

pub fun main(account: Address, id: UInt64): Anique.SetData {

    let collectionRef = getAccount(account).getCapability(/public/CollectibleCollection)
        .borrow<&{Anique.CollectibleCollectionPublic}>()
        ?? panic("Could not get public CollectibleCollection reference")

    let token = collectionRef.borrowCollectible(id: id)
        ?? panic("Could not borrow a reference to the specified Collectible")

    let data = token.data

    let setData = Anique.SetData(setID: data.setID)

    return setData
}
