import Anique from 0xANIQUEADDRESS
import AniqueMarket from 0xANIQUEADDRESS

// This transaction changes the price of a Collectible that a user has for sale

// Parameters:
//
// tokenID: the ID of the Collectible whose price is being changed
// newPrice: the new price of the Collectible

transaction(tokenID: UInt64, newPrice: UFix64) {
    prepare(account: AuthAccount) {

        // borrow a reference to the owner's sale collection
        let aniqueSaleCollectionRef = account
            .getCapability(/storage/AniqueSaleCollection)
            .borrow<&AniqueMarket.SaleCollection>()
            ?? panic("Could not borrow from sale in storage")

        // Change the price of the Collectible
        aniqueSaleCollectionRef.listForSale(tokenID: tokenID, price: newPrice)
    }
}
