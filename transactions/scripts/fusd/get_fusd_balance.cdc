import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xd284f03bf25ea331

pub fun main(account: Address): UFix64 {
  let receiverRef = getAccount(account).getCapability(/public/fusdBalance)!
    .borrow<&FUSD.Vault{FungibleToken.Balance}>()

  return receiverRef!.balance
}