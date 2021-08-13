import Anique from 0xANIQUEADDRESS

// This script checks whether for each SetID/ItemID combo,
// they own a Collectible matching that Set/Item.

// Parameters:
//
// account: The Flow Address of the account whose Collectible data needs to be read
// setIDs: A list of unique IDs for the Sets whose data needs to be read
// itemIDs: A list of unique IDs for the Items whose data needs to be read

// Returns: Bool
// Whether for each SetID/ItemID combo,
// account owns a Collectible matching that SetItem.

pub fun main(account: Address, setIDs: [UInt32], itemIDs: [UInt32]): Bool {

    assert(
        setIDs.length == itemIDs.length,
        message: "set and item ID arrays have mismatched lengths"
    )

    let collectionRef = getAccount(account).getCapability(/public/CollectibleCollection)
                .borrow<&{Anique.CollectibleCollectionPublic}>()
                ?? panic("Could not get public Collectible collection reference")

    let collectibleIDs = collectionRef.getIDs()

    // For each SetID/ItemID combo, loop over each Collectible in the account
    // to see if they own a Collectible matching that SetItem.
    var i = 0

    while i < setIDs.length {
        var hasMatchingCollectible = false
        for collectibleID in collectibleIDs {
            let token = collectionRef.borrowCollectible(id: collectibleID)
                ?? panic("Could not borrow a reference to the specified Collectible")

            let collectibleData = token.data
            if collectibleData.setID == setIDs[i] && collectibleData.itemID == itemIDs[i] {
                hasMatchingCollectible = true
                break
            }
        }
        if !hasMatchingCollectible {
            return false
        }
        i = i + 1
    }

    return true
}
