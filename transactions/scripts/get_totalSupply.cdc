import Anique from 0xANIQUEADDRESS

// Returns current number of CollectibleDatas that have been minted from the Anique contract

pub fun main(): UInt64 {
    return Anique.totalSupply
}
