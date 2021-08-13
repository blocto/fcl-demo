import AniqueCredit from 0xANIQUEADDRESS

pub fun main(address: Address): UFix64 {
    // Get the accounts' public account objects
    let account = getAccount(address)

    // Get references to the account's receivers
    // by getting their public capability
    // and borrowing a reference from the capability
    let receiverRef = account.getCapability(/public/AniqueCreditReceiver)
        .borrow<&AniqueCredit.Vault{AniqueCredit.Balance}>()
        ?? panic("Could not borrow account vault reference")

    return receiverRef.balance
}
