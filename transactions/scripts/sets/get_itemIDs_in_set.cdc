import Anique from 0xANIQUEADDRESS

// This script returns an array of the Item IDs that are
// in the specified Set

// Parameters:
//
// setID: The unique ID for the Set whose data needs to be read

// Returns: [UInt32]
// Array of Item IDs in specified set

pub fun main(setID: UInt32): [UInt32] {
    let setData = Anique.SetData(setID: setID)
    return setData.items
}
