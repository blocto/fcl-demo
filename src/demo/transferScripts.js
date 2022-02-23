const transferFLOW = `\
import FungibleToken from 0xf233dcee88fe0abe
import FlowToken from 0x1654653399040a61

transaction(addresses: [Address], amounts: [UFix64]) {
  let vaultRef: &FlowToken.Vault

  prepare(signer: AuthAccount) {
    assert(
      addresses.length == amounts.length,
      message: "Input length mismatch"
    )

    // Get a reference to the signer's stored vault
    self.vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
      ?? panic("Could not borrow reference to the owner's Vault!")
  }

  execute {
    // Send FlowToken to all addresses in the list
    var index = 0
    while index < addresses.length {
        
      // Get the recipient's public account object
      let recipient = getAccount(addresses[index])

      // Get a reference to the recipient's Receiver
      let receiverRef = recipient.getCapability(/public/flowTokenReceiver)
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Could not borrow receiver reference to the recipient's Vault: ".concat(addresses[index].toString()))

      // Deposit the withdrawn tokens in the recipient's receiver
      receiverRef.deposit(from: <-self.vaultRef.withdraw(amount: amounts[index]))

      index = index + 1
    }
  }
}`

const transferFUSD = `\
import FungibleToken from 0xf233dcee88fe0abe
import FUSD from 0x3c5959b568896393

transaction(addresses: [Address], amounts: [UFix64]) {
  let vaultRef: &FUSD.Vault

  prepare(signer: AuthAccount) {
    assert(
      addresses.length == amounts.length,
      message: "Input length mismatch"
    )

    // Get a reference to the signer's stored vault
    self.vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
      ?? panic("Could not borrow reference to the owner's Vault!")
  }

  execute {
    // Send FUSD to all addresses in the list
    var index = 0
    while index < addresses.length {
        
      // Get the recipient's public account object
      let recipient = getAccount(addresses[index])

      // Get a reference to the recipient's Receiver
      let receiverRef = recipient.getCapability(/public/fusdReceiver)
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Could not borrow receiver reference to the recipient's Vault: ".concat(addresses[index].toString()))

      // Deposit the withdrawn tokens in the recipient's receiver
      receiverRef.deposit(from: <-self.vaultRef.withdraw(amount: amounts[index]))

      index = index + 1
    }
  }
}`

const transferBLT = `\
import FungibleToken from 0xf233dcee88fe0abe
import BloctoToken from 0x0f9df91c9121c460

transaction(addresses: [Address], amounts: [UFix64]) {
  let vaultRef: &BloctoToken.Vault

  prepare(signer: AuthAccount) {
    assert(
      addresses.length == amounts.length,
      message: "Input length mismatch"
    )

    // Get a reference to the signer's stored vault
    self.vaultRef = signer.borrow<&BloctoToken.Vault>(from: BloctoToken.TokenStoragePath)
      ?? panic("Could not borrow reference to the owner's Vault!")
  }

  execute {
    // Send BLT to all addresses in the list
    var index = 0
    while index < addresses.length {
        
      // Get the recipient's public account object
      let recipient = getAccount(addresses[index])

      // Get a reference to the recipient's Receiver
      let receiverRef = recipient.getCapability(BloctoToken.TokenPublicReceiverPath)
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Could not borrow receiver reference to the recipient's Vault: ".concat(addresses[index].toString()))

      // Deposit the withdrawn tokens in the recipient's receiver
      receiverRef.deposit(from: <-self.vaultRef.withdraw(amount: amounts[index]))

      index = index + 1
    }
  }
}
`

const transferSTARLY = `\
import FungibleToken from 0xf233dcee88fe0abe
import StarlyToken from 0x142fa6570b62fd97

transaction(addresses: [Address], amounts: [UFix64]) {
  let vaultRef: &StarlyToken.Vault

  prepare(signer: AuthAccount) {
    assert(
      addresses.length == amounts.length,
      message: "Input length mismatch"
    )

    // Get a reference to the signer's stored vault
    self.vaultRef = signer.borrow<&StarlyToken.Vault>(from: StarlyToken.TokenStoragePath)
      ?? panic("Could not borrow reference to the owner's Vault!")
  }

  execute {
    // Send STARLY to all addresses in the list
    var index = 0
    while index < addresses.length {
        
      // Get the recipient's public account object
      let recipient = getAccount(addresses[index])

      // Get a reference to the recipient's Receiver
      let receiverRef = recipient.getCapability(StarlyToken.TokenPublicReceiverPath)
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Could not borrow receiver reference to the recipient's Vault: ".concat(addresses[index].toString()))

      // Deposit the withdrawn tokens in the recipient's receiver
      receiverRef.deposit(from: <-self.vaultRef.withdraw(amount: amounts[index]))

      index = index + 1
    }
  }
}
`

const transferScripts = {
  FLOW: transferFLOW,
  FUSD: transferFUSD,
  BLT: transferBLT,
  STARLY: transferSTARLY,
}

export default transferScripts
