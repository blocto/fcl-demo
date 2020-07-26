import React, {useState} from "react"
import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Result from '../components/Result'
import Point from '../components/Point'

fcl.config()
  .put("decoder.SomeStruct", data => new Point(data))

const Button = styled.button``

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
    <Card>
      <Header>run script - with custom decoder</Header>
      <Button onClick={runScript}>Run Script</Button>
      
      {data && data !== null && (
        data.map((item, index) => (
          <Result key={index}>
            {item.constructor.name} {index}
            <br />
            {JSON.stringify(item, null, 2)}
          </Result>
        ))
      )}
    </Card>
  )
}
