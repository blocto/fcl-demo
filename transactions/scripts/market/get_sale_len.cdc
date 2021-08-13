import AniqueMarket from 0xANIQUEADDRESS

pub fun main(sellerAddress: Address): Int {
    let acct = getAccount(sellerAddress)
    let collectionRef = acct
        .getCapability(/public/AniqueSaleCollection)
        .borrow<&{AniqueMarket.SalePublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs().length
}
