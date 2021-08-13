import Anique from 0xANIQUEADDRESS

// This script reads the current series from the Anique contract and
// returns that number to the caller

// Returns: UInt32
// currentSeries field in Anique contract

pub fun main(): UInt32 {
    return Anique.currentSeries
}
