import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"
import {sign} from "../crypto"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const simpleTransaction = `\
import AniqueCredit from 0xANIQUECREDITADDRESS
import Anique from 0xANIQUEADDRESS

// This transaction creates a new Sale Collection object,
// lists an NFT for sale, puts it in account storage,
// and creates a public capability to the sale so that others can buy the token.
transaction(amount: UFix64, recipientAddress: Address) {

    prepare(account: AuthAccount) {
        let admin = account

        let adminRef = admin.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)
            ?? panic("Could not borrow admin's AniqueAdmin reference")

        // Borrow a reference to the stored Vault (in person)
        let vaultRef = account.borrow<&AniqueCredit.Vault>(from: /storage/AniqueCreditVault)
            ?? panic("Could not borrow owner's vault reference")

        let vault <- vaultRef.withdraw(amount: amount, admin: adminRef)

        // Borrow a reference to the public Vault (others)
        let recipient = getAccount(recipientAddress)
        let recipientRef = recipient.getCapability<&AniqueCredit.Vault{AniqueCredit.Receiver}>(/public/AniqueCreditReceiver)
            .borrow()
            ?? panic("Could not borrow account's vault reference")

        recipientRef.deposit(from: <- vault)
    }
}
`

const ADMIN_ADDRESS = "0xd284f03bf25ea331" // testnet account created by faucet
const KEY_ID = 0
const ADMIN_PRIVATE_KEY = "9ba58faefeebbf13d5a87d07a085af4cdfb88c56a9470597021da3864758b164"

const adminAuthorization = async (account) => {
  return {
    ...account,
    tempId: `${ADMIN_ADDRESS}-${KEY_ID}`,
    addr: fcl.sansPrefix(ADMIN_ADDRESS),
    keyId: Number(KEY_ID),
    signingFunction: async signable => {
      // Singing functions are passed a signable and need to return a composite signature
      // signable.message is a hex string of what needs to be signed.
      return {
        addr: fcl.withPrefix(ADMIN_ADDRESS), // account.addr と同じ。こっちは prefix が必要
        keyId: Number(KEY_ID), // account.keyId　と同じ
        signature: sign(ADMIN_PRIVATE_KEY, signable.message), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
      }
    }
  }
}
/*
const signingFunction = ({
  message, // The encoded string which needs to be used to produce the signature.
  addr, // The address of the Flow Account this signature is to be produced for.
  keyId, // The keyId of the key which is to be used to produce the signature.
  roles: {
    proposer, // A Boolean representing if this signature to be produced for a proposer.
    authorizer, // A Boolean representing if this signature to be produced for a authorizer.
    payer, // A Boolean representing if this signature to be produced for a payer.
  },
  voucher, // The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message.
}) => {
  return {
    addr, // The address of the Flow Account this signature was produced for.
    keyId, // The keyId for which key was used to produce the signature.
    signature: produceSignature(message) // The hex encoded string representing the signature of the message.
  }
}*/

const SendTransaction = () => {
  const [status, setStatus] = useState("Not started")
  const [transaction, setTransaction] = useState(null)

  const sendTransaction = async (event) => {
    event.preventDefault()
    
    setStatus("Resolving...")

    const blockResponse = await fcl.send([
      fcl.getLatestBlock(),
    ])

    const block = await fcl.decode(blockResponse)

    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(simpleTransaction),
        fcl.args([
          fcl.arg("2.0", types.UFix64),
          fcl.arg("0x4b8505577ace5b24", types.Address)
        ]),
        fcl.proposer(fcl.currentUser().authorization), //flow-js-sdk  packages/fcl/src/current-user/index.js:176
        fcl.payer(adminAuthorization),
        fcl.authorizations([
          adminAuthorization
        ]),
        fcl.ref(block.id),
        fcl.limit(100), // Execution failed: computation limited exceeded
      ])

      setStatus("Transaction sent, waiting for confirmation")

      const unsub = fcl
        .tx({ transactionId })
        .subscribe(transaction => {
          setTransaction(transaction)

          if (fcl.tx.isSealed(transaction)) {
            setStatus("Transaction is Sealed")
            unsub()
          }
        })
    } catch (error) {
      console.error(error);
      setStatus("Transaction failed")
    }
  }

  return (
    <Card>
      <Header>send transaction</Header>

      <Code>{simpleTransaction}</Code>

      <button onClick={sendTransaction}>
        Send
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SendTransaction
