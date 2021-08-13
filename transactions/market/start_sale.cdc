import Anique from 0xANIQUEADDRESS
import AniqueMarket from 0xANIQUEADDRESS

// This transaction is for a user to put a new Collectible up for sale
// They must have Anique Collection and an AniqueMarket Sale Collection already
// stored in their account

// Parameters
//
// collectibleID: the ID of the Collectible to be listed for sale
// price: the sell price of the Collectible

transaction(collectibleID: UInt64, price: UFix64) {
    prepare(account: AuthAccount) {

        // borrow a reference to the Anique Sale Collection
        let aniqueSaleCollectionRef = account
            .borrow<&AniqueMarket.SaleCollection>(from: /storage/AniqueSaleCollection)
            ?? panic("Could not borrow from sale in storage")

        // List the specified Collectible for sale
        aniqueSaleCollectionRef.listForSale(tokenID: collectibleID, price: price)
    }
}
