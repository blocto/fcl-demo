import React, {useState} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Result from '../components/Result'

const Button = styled.button``

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
      <Button onClick={runGetLatestBlock}>Get Latest Block</Button>
      
      {data && <Result>{JSON.stringify(data, null, 2)}</Result>}
    </Card>
  )
}

export default GetLatestBlock
