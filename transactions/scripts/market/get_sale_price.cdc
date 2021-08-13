import AniqueMarket from 0xANIQUEADDRESS

pub fun main(sellerAddress: Address, collectibleID: UInt64): UFix64 {

    let account = getAccount(sellerAddress)
    let collectionRef = account
        .getCapability(/public/AniqueSaleCollection)
        .borrow<&{AniqueMarket.SalePublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getPrice(tokenID: collectibleID as UInt64)!
}
