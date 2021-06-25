import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const simpleTransaction = `\
import NonFungibleToken from 0x1d7e57aa55817448
import DarkCountry from 0xc8c340cebd11f690

transaction() {
  prepare(signer: AuthAccount) {
    signer.unlink(DarkCountry.CollectionPublicPath)
    signer.link<&DarkCountry.Collection{DarkCountry.DarkCountryCollectionPublic, NonFungibleToken.CollectionPublic}>(
      DarkCountry.CollectionPublicPath,
      target: DarkCountry.CollectionStoragePath
    )
  }
}
`

const SendTransaction = () => {
  const [status, setStatus] = useState("Not started")
  const [transaction, setTransaction] = useState(null)

  const sendTransaction = async (event) => {
    event.preventDefault()
    
    setStatus("Resolving...")

    const blockResponse = await fcl.send([
      fcl.getLatestBlock(),
    ])

    const block = await fcl.decode(blockResponse)
    
    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(simpleTransaction),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([
          fcl.currentUser().authorization,
        ]),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ])

      setStatus("Transaction sent, waiting for confirmation")

      const unsub = fcl
        .tx({ transactionId })
        .subscribe(transaction => {
          setTransaction(transaction)

          if (fcl.tx.isSealed(transaction)) {
            setStatus("Transaction is Sealed")
            unsub()
          }
        })
    } catch (error) {
      console.error(error);
      setStatus("Transaction failed")
    }
  }

  return (
    <Card>
      {/* <Header>Upgrade your Blocto Dark Country Collection</Header> */}

      {/* <Code>{simpleTransaction}</Code> */}

      <button onClick={sendTransaction}>
        Upgrade
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SendTransaction
