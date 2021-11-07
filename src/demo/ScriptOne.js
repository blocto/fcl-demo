import React, { useState } from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const scriptOne = `\
import LockedTokens from 0x8d0e87b65159ae63

pub fun main(account: Address): UFix64 {

    let lockedAccountInfoRef = getAccount(account)
        .getCapability<&LockedTokens.TokenHolder{LockedTokens.LockedAccountInfo}>(
            LockedTokens.LockedAccountInfoPublicPath
        )
        .borrow()
        ?? panic("Could not borrow a reference to public LockedAccountInfo")

    return lockedAccountInfoRef.getUnlockLimit()
}
`

export default function ScriptOne() {
  const [data, setData] = useState(null)

  const runScript = async (event) => {
    event.preventDefault()

    const response = await fcl.send([
      fcl.script(scriptOne),
      fcl.args([fcl.arg('0x09a766d45b5f1cb6', t.Address)]),
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
