import Anique from 0xANIQUEADDRESS

// This script reads the next Set ID from the Anique contract and
// returns that number to the caller

// Returns: UInt32
// Value of nextSetID field in Anique contract

pub fun main(): UInt32 {
    return Anique.nextSetID
}
