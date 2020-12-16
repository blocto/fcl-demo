import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const simpleTransaction = address => `\
import HelloWorld from 0x${address.replace('0x', '')}

transaction {
  execute {
    HelloWorld.hello(message: "Hello from visitor")
  }
}
`

const InteractWithContract = () => {
  const [addr, setAddr] = useState(null)
  const [status, setStatus] = useState("Not started")
  const [transaction, setTransaction] = useState(null)

  const updateAddr = (event) => {
    event.preventDefault();

    setAddr(event.target.value)
  }

  const runTransaction = async (event) => {
    event.preventDefault()
    
    setStatus("Resolving...")

    const blockResponse = await fcl.send([
      fcl.getLatestBlock(),
    ])

    const block = await fcl.decode(blockResponse)
    
    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(simpleTransaction(addr)),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ])

      setStatus("Transaction sent, waiting for confirmation")

      const unsub = fcl
        .tx({
          transactionId,
        })
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
      <Header>interact with contract</Header>

      <input
        placeholder="Enter Contract address"
        onChange={updateAddr}
      />

      <Code>{simpleTransaction(addr || '')}</Code>

      <button onClick={runTransaction}>
        Run Transaction
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default InteractWithContract
