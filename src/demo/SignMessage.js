import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const SignMessage = () => {
  const [status, setStatus] = useState("Not started")
  const [message, setMessage] = useState('')
  const [transaction, setTransaction] = useState(null)

  const updateMessage = (event) => {
    event.preventDefault();

    setMessage(event.target.value)
  }

  const sendTransaction = async (event) => {
    event.preventDefault()
    
    setStatus("Resolving...")
    
    try {
      const { transactionId } = await fcl
        .currentUser()
        .signUserMessage(Buffer.from(message).toString("hex"))

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
      <Header>sign message</Header>

      <input
        placeholder="Message..."
        onChange={updateMessage}
      />

      <button onClick={sendTransaction}>
        Sign
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SignMessage
