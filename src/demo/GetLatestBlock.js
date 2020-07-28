import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Code from '../components/Code'

const GetLatestBlock = () => {
  const [data, setData] = useState(null)

  const runGetLatestBlock = async (event) => {
    event.preventDefault()

    const response = await fcl.send([
      fcl.getLatestBlock(),
    ])
    
    setData(await fcl.decode(response))
  }

  return (
    <Card>
      <button onClick={runGetLatestBlock}>
        Get Latest Block
      </button>
      
      {data && <Code>{JSON.stringify(data, null, 2)}</Code>}
    </Card>
  )
}

export default GetLatestBlock
