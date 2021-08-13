import AniqueMarket from 0xANIQUEADDRESS

pub fun main(sellerAddress: Address, collectibleID: UInt64): Anique.SetData {
    let saleRef = getAccount(sellerAddress)
        .getCapability(/public/AniqueSaleCollection)
        .borrow<&{AniqueMarket.SalePublic}>()
        ?? panic("Could not get public sale reference")

    let token = saleRef.borrowCollectible(id: collectibleID)
        ?? panic("Could not borrow a reference to the specified Collectible")

    return token.data
}
