import Anique from 0xANIQUEADDRESS

// This script reads the public nextItemID from the Anique contract and
// returns that number to the caller
pub fun main(): UInt32 {
    return Anique.nextItemID
}
