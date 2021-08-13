import Anique from 0xANIQUEADDRESS

// This script returns the full metadata associated with a Item
// in the Anique smart contract

pub fun main(itemID: UInt32): {String:String} {
    return Anique.getItemMetaData(itemID: itemID)!
}
