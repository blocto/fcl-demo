import Anique from 0xANIQUEADDRESS

// This script returns an array of all the Items
// that have ever been created for Anique

pub fun main(): [Anique.Item] {
    return Anique.getAllItems()
}
