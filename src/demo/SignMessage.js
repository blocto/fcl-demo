import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const SignMessage = () => {
  const [status, setStatus] = useState("Not started")
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState(null)

  const updateMessage = (event) => {
    event.preventDefault();

    setMessage(event.target.value)
  }

  const sendTransaction = async (event) => {
    event.preventDefault()
    
    setStatus("Resolving...")
    
    fcl
      .currentUser()
      .signUserMessage(Buffer.from(message).toString("hex"))
      .then((response) => {
        if (!response) {
          setStatus("Signature failed");
          return;
        }

        setStatus(`Signature success`);
        setSignature(response);
      })
      .catch(error => {
        console.error(error);
        setStatus("Signature failed")
      })
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

      {signature && <Code>{JSON.stringify(signature, null, 2)}</Code>}
    </Card>
  )
}

export default SignMessage
