import React, { useState } from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const simpleTransaction = `\
import FungibleToken from 0x9a0766d93b6608b7
import BloctoToken from 0x6e0797ac987005f5

transaction {

    prepare(signer: AuthAccount) {

        // If the account is already set up that's not a problem, but we don't want to replace it
        if(signer.borrow<&BloctoToken.Vault>(from: BloctoToken.TokenStoragePath) != nil) {
            return
        }
        
        // Create a new Blocto Token Vault and put it in storage
        signer.save(<-BloctoToken.createEmptyVault(), to: BloctoToken.TokenStoragePath)

        // Create a public capability to the Vault that only exposes
        // the deposit function through the Receiver interface
        signer.link<&BloctoToken.Vault{FungibleToken.Receiver}>(
            BloctoToken.TokenPublicReceiverPath,
            target: BloctoToken.TokenStoragePath
        )

        // Create a public capability to the Vault that only exposes
        // the balance field through the Balance interface
        signer.link<&BloctoToken.Vault{FungibleToken.Balance}>(
            BloctoToken.TokenPublicBalancePath,
            target: BloctoToken.TokenStoragePath
        )
    }
}
`

const SetupVault = () => {
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
        fcl.authorizations([
          fcl.currentUser().authorization,
        ]),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
        fcl.limit(1000),
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
      <Header>setup BLT vault</Header>

      <Code>{simpleTransaction}</Code>

      <button onClick={sendTransaction}>
        Send
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SetupVault
