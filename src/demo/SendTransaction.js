import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Code from '../components/Code'

const simpleTransaction = `\
transaction {
  execute {
    log("A transaction happened")
  }
}
`

export default function TransactionOne() {
  const [status, setStatus] = useState("Not started")

  const runTransaction = async (event) => {
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
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ])

      setStatus("Transaction sent, waiting for confirmation")

      const unsub = fcl
        .tx({
          transactionId,
        })
        .subscribe(transaction => {
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
      <button onClick={runTransaction}>
        Run Transaction
      </button>

      <Code>{status}</Code>
    </Card>
  )
}
