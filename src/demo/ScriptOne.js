import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const scriptOne = `\
import AniqueCredit from 0xANIQUEADDRESS

pub fun main(address: Address): UFix64 {
    // Get the accounts' public account objects
    let account = getAccount(address)

    // Get references to the account's receivers
    // by getting their public capability
    // and borrowing a reference from the capability
    let receiverRef = account.getCapability(/public/AniqueCreditReceiver)
        .borrow<&AniqueCredit.Vault{AniqueCredit.Balance}>()
        ?? panic("Could not borrow account vault reference")

    return receiverRef.balance
}
`

export default function ScriptOne() {
  const [data, setData] = useState(null)

  const runScript = async (event) => {
    event.preventDefault()

    const response = await fcl.send([
      fcl.script(scriptOne),
      fcl.args([
        fcl.arg("0x4b8505577ace5b24", types.Address)
      ])
    ])
    
    setData(await fcl.decode(response))
  }

  return (
    <Card>
      <Header>run script</Header>
      
      <Code>{scriptOne}</Code>
      
      <button onClick={runScript}>Run Script</button>

      {data && (
        <Code>
          {JSON.stringify(data, null, 2)}
        </Code>
      )}
    </Card>
  )
}
