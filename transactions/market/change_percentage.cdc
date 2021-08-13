import AniqueMarket from 0xANIQUEADDRESS

transaction(newPercentage: UFix64) {
    prepare(account: AuthAccount) {

        let aniqueSaleCollection = account
            .getCapability(/storage/aniqueSaleCollection)
            .borrow<&AniqueMarket.SaleCollection>()!
            ?? panic("Could not borrow from sale in storage")

        aniqueSaleCollection.changePercentage(newPercentage)
    }
}
