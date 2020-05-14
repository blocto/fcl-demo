import React, {useState} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

const Root = styled.div``
const Header = styled.div``
const Button = styled.button``
const Results = styled.pre``

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
    <Root>
      <Header>Script One</Header>
      <Button onClick={runScript}>Run Script</Button>
      {data && <Results>{JSON.stringify(data, null, 2)}</Results>}
    </Root>
  )
}
