import React, { useState } from "react"
import * as fcl from "@portto/fcl"

import Card from '../components/Card'
// import Header from '../components/Header'
import Code from '../components/Code'

const simpleTransaction = `\
import FungibleToken from 0xf233dcee88fe0abe
import FlowToken from 0x1654653399040a61
import FUSD from 0x3c5959b568896393

transaction {
  prepare(signer: AuthAccount) {
    if acct.getCapability<&{FungibleToken.Provider}>(/public/flowTokenReceiver).check() {
      signer.unlink(/public/flowTokenReceiver)
      signer.link<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver, target: /storage/flowTokenVault)
    }

    if acct.getCapability<&{FungibleToken.Provider}>(/public/fusdReceiver).check() {
      signer.unlink(/public/fusdReceiver)
      signer.link<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver, target: /storage/fusdVault)
    }
  }
}
`

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

        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([fcl.currentUser().authorization]),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
        fcl.limit(100),
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
      <Code>{simpleTransaction}</Code>

      <button onClick={sendTransaction}>
        Patch my account
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SendTransaction
