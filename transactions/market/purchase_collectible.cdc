import AniqueCredit from 0xANIQUEADDRESS
import Anique from 0xANIQUEADDRESS
import AniqueMarket from 0xANIQUEADDRESS

// This transaction is for a user to purchase a Collectible that another user
// has for sale in their sale collection

// Parameters
//
// sellerAddress: the Flow address of the account issuing the sale of a Collectible
// tokenID: the ID of the Collectible being purchased
// purchaseAmount: the amount for which the user is paying for the Collectible; must not be less than the Collectible's price

transaction(sellerAddress: Address, tokenID: UInt64, purchaseAmount: UFix64) {
    prepare(account: AuthAccount, adminAccount: AuthAccount) {

        // borrow an Anique.Admin
        let adminRef = adminAccount
            .borrow<&Anique.Admin>(from: /storage/AniqueAdmin)
            ?? panic("Could not borrow admin's AniqueAdmin reference")

        // borrow a reference to the signer's collection
        let collection = account.getCapability(/public/CollectibleCollection)
            .borrow<&{Anique.CollectibleCollectionPublic}>()
            ?? panic("Could not borrow reference to the Collectible Collection")

        // borrow a reference to the signer's fungible token Vault
        let provider = account
            .borrow<&AniqueCredit.Vault{AniqueCredit.Provider}>(from: /storage/AniqueCreditVault)
            ?? panic("Could not borrow reference to the Anique Credit Vault")

        // withdraw creditTokens from the signer's vault
        let creditTokens <- provider.withdraw(amount: purchaseAmount, admin: adminRef) as! @AniqueCredit.Vault

        // get the seller's public account object
        let seller = getAccount(sellerAddress)

        // borrow a public reference to the seller's sale collection
        let aniqueSaleCollectionRef = seller
            .getCapability(/public/AniqueSaleCollection)
            .borrow<&{AniqueMarket.SalePublic}>()
            ?? panic("Could not borrow public sale reference")

        // purchase the Collectible
        let purchasedToken <- aniqueSaleCollectionRef.purchase(tokenID: tokenID, buyTokens: <-creditTokens, admin: adminRef)

        // deposit the purchased Collectible into the signer's collection
        collection.deposit(token: <-purchasedToken)
    }
}
