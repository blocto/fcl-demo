import React, {useState} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

const Root = styled.div``
const Header = styled.div``
const Button = styled.button``
const Results = styled.pre``

export default function ScriptTwo() {
  const [data, setData] = useState(null)

  const runScript = async e => {
    e.preventDefault()
    const response = await fcl.send([
      fcl.script`
        pub struct SomeStruct {
          pub var x: Int
          pub var y: Int

          init(x: Int, y: Int) {
            self.x = x
            self.y = y
          }
        }

        pub fun main(): [SomeStruct] {
          return [SomeStruct(x: 1, y: 2), SomeStruct(x: 3, y: 4)]
        }
      `,
    ])
    setData(await fcl.decode(response))
  }

  return (
    <Root>
      <Header>Script Two</Header>
      <Button onClick={runScript}>Run Script</Button>
      {data && <Results>{JSON.stringify(data, null, 2)}</Results>}
      <span>{data && data !== null && data[0].constructor.name} 1 </span> {/* Point 1 */}
      <span>{data && data !== null && data[1].constructor.name} 2 </span> {/* Point 1 */}
    </Root>
  )
}
