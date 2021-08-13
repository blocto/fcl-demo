import Anique from 0xANIQUEADDRESS
import AniqueMarket from 0xANIQUEADDRESS
import AniqueCredit from 0xANIQUEADDRESS

// This transaction creates a sale collection and stores it in the signer's account
// It does not put an NFT up for sale

// Parameters
//
// beneficiaryAccount: the Flow address of the account where a cut of the purchase will be sent
// cutPercentage: how much in percentage the beneficiary will receive from the sale

transaction(beneficiaryAccount: Address, cutPercentage: UFix64) {
    prepare(account: AuthAccount) {
        if account.borrow<&{AniqueMarket.SalePublic}>(from: /storage/AniqueSaleCollection) == nil {

            let ownerCapability = account
                .getCapability<&{AniqueCredit.Receiver}>(/public/AniqueCreditReceiver)

            let beneficiaryCapability = getAccount(beneficiaryAccount)
                .getCapability<&{AniqueCredit.Receiver}>(/public/AniqueCreditReceiver)

            let ownerCollection = account.link<&Anique.Collection>(/private/CollectibleCollection, target: /storage/CollectibleCollection)!

            let collection <- AniqueMarket.createSaleCollection(
                ownerCollection: ownerCollection,
                ownerCapability: ownerCapability,
                beneficiaryCapability: beneficiaryCapability,
                cutPercentage: cutPercentage)

            account.save(<-collection, to: /storage/AniqueSaleCollection)

            account.link<&AniqueMarket.SaleCollection{AniqueMarket.SalePublic}>(/public/AniqueSaleCollection, target: /storage/AniqueSaleCollection)
        }
    }
}
