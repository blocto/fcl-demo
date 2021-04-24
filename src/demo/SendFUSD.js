import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const checkFusdAmount = `\
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

pub fun main(account: Address): UFix64 {
  let receiverRef = getAccount(account).getCapability(/public/fusdBalance)!
    .borrow<&FUSD.Vault{FungibleToken.Balance}>()

  return receiverRef!.balance
}

`

const simpleTransaction = `\
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()
			?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}
`

const SendFUSD = () => {
  const [balance, setBalance] = useState(0)
  const [addr, setAddr] = useState(null)
  const [amount, setAmount] = useState(null)
  const [status, setStatus] = useState("Not started")
  const [user, setUser] = useState(null)
  const [transaction, setTransaction] = useState(null)

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])

  useEffect(() => {
    const fetchData = async () => {  
      if (!user || !user.addr) {
        return 
      }

      try { 
        const response = await fcl.send([
          fcl.script(checkFusdAmount),
          fcl.args([fcl.arg(user.addr, t.Address)]),
        ]);
    
        const balance = await fcl.decode(response);

        setBalance(balance)
      } catch (error) {
        setBalance(0.0)
      }
    }

    if (user && user.addr) {
      fetchData()
    }
  }, [user])

  const updateAddr = (event) => {
    event.preventDefault();

    setAddr(event.target.value)
  }

  const updateAmount = (event) => {
    event.preventDefault();

    setAmount(event.target.value)
  }

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
        fcl.args([
          fcl.arg(parseFloat(amount).toFixed(8), t.UFix64),
          fcl.arg(addr, t.Address),
        ]),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([
          fcl.currentUser().authorization,
        ]),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
        fcl.limit(1000),
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
      <Header>send FUSD</Header>

      <Code>Balance: {balance}</Code>

      {/* <Code>{simpleTransaction}</Code> */}

      <input
        placeholder="Receiver Address 0x..."
        onChange={updateAddr}
      />

      <input
        placeholder="Amount 0.0"
        onChange={updateAmount}
      />

      <button onClick={sendTransaction}>
        Send
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SendFUSD
