import Anique from 0xANIQUEADDRESS
import AniqueMarket from 0xANIQUEADDRESS

// This transaction is for a user to stop a Collection sale in their account

// Parameters
//
// tokenID: the ID of the Collection whose sale is to be withdrawn

transaction(tokenID: UInt64) {

    prepare(account: AuthAccount) {

        // borrow a reference to the owner's sale collection
        let aniqueSaleCollectionRef = account.borrow<&AniqueMarket.SaleCollection>(from: /storage/AniqueSaleCollection)
            ?? panic("Could not borrow from sale in storage")

        // cancel the Collection from the sale, thereby withdraw it
        aniqueSaleCollectionRef.cancelSale(tokenID: tokenID)
    }
}
