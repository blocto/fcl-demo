import Anique from 0xANIQUEADDRESS

// This script returns the number of specified Collectibles that have been
// minted for the specified Set/Item

// Parameters:
//
// setID: The unique ID for the Set whose data needs to be read
// itemID: The unique ID for the Item whose data needs to be read

// Returns: UInt32
// number of Collectibles with specified itemID minted for a set with specified setID

pub fun main(setID: UInt32, itemID: UInt32): UInt32 {

    let numCollectibles = Anique.getNumCollectiblesInSetItem(setID: setID, itemID: itemID)
        ?? panic("Could not find the specified Set/Item")

    return numCollectibles
}
