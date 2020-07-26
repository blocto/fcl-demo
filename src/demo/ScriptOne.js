import React, {useState} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Result from '../components/Result'

const Button = styled.button``

export default function ScriptOne() {
  const [data, setData] = useState(null)

  const runScript = async e => {
    e.preventDefault()
    const response = await fcl.send([
      fcl.script`
        pub fun main(): Int {
          return 42 + 6
        }
      `,
    ])
    setData(await fcl.decode(response))
  }

  return (
    <Card>
      <Header>run script</Header>
      <Button onClick={runScript}>Run Script</Button>
      {data && <Result>{JSON.stringify(data, null, 2)}</Result>}
    </Card>
  )
}
