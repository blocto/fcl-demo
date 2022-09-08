import React, { useState } from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const SendTransaction = () => {
  const [status, setStatus] = useState("Not started")
  const [addr, setAddr] = useState(null)
  const [amount, setAmount] = useState(null)
  const [transaction, setTransaction] = useState(null)

  const sendTransaction = async (event) => {
    event.preventDefault()

    setStatus("Resolving...")

    try {
      const transactionId = await fcl.mutate({
        template: 'https://flix.flow.com/v1/templates/290b6b6222b2a77b16db896a80ddf29ebd1fa3038c9e6625a933fa213fce51fa',
        args: (arg, t) => [arg(amount, t.UFix64), arg(addr, t.Address)],
        limit: 9999
      })

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

  const updateAddr = (event) => {
    event.preventDefault();

    setAddr(event.target.value)
  }

  const updateAmount = (event) => {
    event.preventDefault();

    setAmount(event.target.value)
  }

  return (
    <Card>
      <Header>send transaction template</Header>

      <input
        placeholder="Receiver Address 0x..."
        onChange={updateAddr}
      />

      <input
        placeholder="Amount 0.0"
        onChange={updateAmount}
      />

      <button onClick={sendTransaction}>
        Send
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SendTransaction
