const checkFLOW = `\
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(account: Address): UFix64 {
  let receiverRef = getAccount(account).getCapability(/public/flowTokenBalance)!
    .borrow<&{FungibleToken.Balance}>()

  return receiverRef?.balance ?? 0.0
}`

const checkFUSD = `\
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(account: Address): UFix64 {
  let receiverRef = getAccount(account).getCapability(/public/fusdBalance)!
    .borrow<&{FungibleToken.Balance}>()

  return receiverRef?.balance ?? 0.0
}`

const checkBLT = `\
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(address: Address): UFix64 {
  let balanceRef = getAccount(address).getCapability(/public/bloctoTokenBalance)!
    .borrow<&{FungibleToken.Balance}>()

  return balanceRef?.balance ?? 0.0
}`

const checkScripts = {
  FLOW: checkFLOW,
  FUSD: checkFUSD,
  BLT: checkBLT,
}

export default checkScripts
