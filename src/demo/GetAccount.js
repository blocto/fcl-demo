import React, {useState} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'

const Input = styled.input``
const Button = styled.button``
const Results = styled.pre``

const GetAccount = () => {
  const [data, setData] = useState(null)
  const [addr, setAddr] = useState(null)

  const runGetAccount = async e => {
    e.preventDefault()
    const response = await fcl.send([
      fcl.getAccount(addr),
    ])
    setData(await fcl.decode(response))
  }

  const updateAddr = async e => {
    setAddr(e.target.value)
  }

  return (
    <Card>
      <Header>get account</Header>

      <Input
        placeholder="Enter Flow address"
        onChange={updateAddr}
      />
      <Button onClick={runGetAccount}>Lookup Account</Button>
      
      {data && <Results>{JSON.stringify(data, null, 2)}</Results>}
    </Card>
  )
}

export default GetAccount
