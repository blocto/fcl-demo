import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const scriptOne = `\
import NonFungibleToken from 0x1d7e57aa55817448 
import DarkCountry from 0xc8c340cebd11f690 

// This script returns an array of all the NFT IDs in an account's collection.

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(DarkCountry.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs()
}
`

export default function ScriptOne() {
  const [data, setData] = useState(null)

  const runScript = async (event) => {
    event.preventDefault()

    const response = await fcl.send([
      fcl.script(scriptOne),
      fcl.args([
        fcl.arg('0xdd718b0856a69974', t.Address),
      ]),
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
