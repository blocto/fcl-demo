import React, {useState} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Result from '../components/Result'

const Button = styled.button``

export default function TransactionOne() {
  const [status, setStatus] = useState("Not started")

  const runTransaction = async e => {
    e.preventDefault()
    setStatus("Resolving...")

    console.log(await fcl.currentUser().snapshot())

    const blockResponse = await fcl.send([
      fcl.getLatestBlock(),
    ])

    const block = await fcl.decode(blockResponse)
    
    try {
      const response = await fcl.send([
        fcl.transaction`
          transaction {
            execute {
              log("A transaction happened")
            }
          }
        `,
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ])

      setStatus("Transaction sent, waiting for confirmation")

      console.log(response)

      const unsub = fcl
        .tx({
          transactionId: response.transactionId
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
      <Button onClick={runTransaction}>Run Transaction</Button>
      <Result>{status}</Result>
    </Card>
  )
}
