const checkFLOW = `\
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(addresses: [Address]): [Address] {
  return []
}`

const checkFUSD = `\
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(addresses: [Address]): [Address] {
  var badAccounts: [Address] = []
  
  var index = 0
  while index < addresses.length {
      
    // Get the recipient's public account object
    let recipient = getAccount(addresses[index])

    // Get a reference to the recipient's Receiver
    let receiverRef = recipient.getCapability(/public/fusdReceiver)
      .borrow<&{FungibleToken.Receiver}>()

    if receiverRef == nil {
      badAccounts.append(addresses[index])
    }

    index = index + 1
  }

  return badAccounts
}`

const checkBLT = `\
import FungibleToken from 0xf233dcee88fe0abe
import BloctoToken from 0x0f9df91c9121c460

pub fun main(addresses: [Address]): [Address] {
  var badAccounts: [Address] = []
  
  var index = 0
  while index < addresses.length {
      
    // Get the recipient's public account object
    let recipient = getAccount(addresses[index])

    // Get a reference to the recipient's Receiver
    let receiverRef = recipient.getCapability(BloctoToken.TokenPublicReceiverPath)
      .borrow<&{FungibleToken.Receiver}>()

    if receiverRef == nil {
      badAccounts.append(addresses[index])
    }

    index = index + 1
  }

  return badAccounts
}`

const checkScripts = {
  FLOW: checkFLOW,
  FUSD: checkFUSD,
  BLT: checkBLT,
}

export default checkScripts
