import React, { useState, useEffect } from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import bs58 from 'bs58'

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const checkBltAmount = `\
import FungibleToken from 0x9a0766d93b6608b7
import BloctoToken from 0x6e0797ac987005f5

pub fun main(account: Address): UFix64 {
  let balanceRef = getAccount(account).getCapability(BloctoToken.TokenPublicBalancePath)
    .borrow<&{FungibleToken.Balance}>()
    ?? panic("Could not borrow balance public reference")

  return balanceRef.balance
}

`

const simpleTransaction = `\
import FungibleToken from 0x9a0766d93b6608b7
import BloctoToken from 0x6e0797ac987005f5
import TeleportCustodySolana from 0x967a0fb3c949cbc5

transaction(amount: UFix64, target: String) {

    // The TeleportUser reference for teleport operations
    let teleportUserRef: &TeleportCustodySolana.TeleportAdmin{TeleportCustodySolana.TeleportUser}

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.teleportUserRef = getAccount(0xf086a545ce3c552d).getCapability(TeleportCustodySolana.TeleportAdminTeleportUserPath)
            .borrow<&TeleportCustodySolana.TeleportAdmin{TeleportCustodySolana.TeleportUser}>()
            ?? panic("Could not borrow a reference to TeleportOut")

        let vaultRef = signer.borrow<&BloctoToken.Vault>(from: BloctoToken.TokenStoragePath)
            ?? panic("Could not borrow a reference to the vault resource")

        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        self.teleportUserRef.lock(from: <- self.sentVault, to: target.decodeHex(), toAddressType: "SOL")
    }
}
`

const TeleportBLT = () => {
  const [balance, setBalance] = useState(0)
  const [addr, setAddr] = useState(null)
  const [amount, setAmount] = useState(null)
  const [status, setStatus] = useState("Not started")
  const [user, setUser] = useState(null)
  const [transaction, setTransaction] = useState(null)

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({ ...user }))
    , [])

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.addr) {
        return
      }

      try {
        const response = await fcl.send([
          fcl.script(checkBltAmount),
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

    let interval = setInterval(fetchData, 5000)

    return () => {
      clearInterval(interval)
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

    const receiver = bs58.decode(addr).toString('hex')

    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(simpleTransaction),
        fcl.args([
          fcl.arg(parseFloat(amount).toFixed(8), t.UFix64),
          fcl.arg(receiver, t.String),
        ]),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([
          fcl.currentUser().authorization,
        ]),
        fcl.payer(fcl.currentUser().authorization),
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
      <Header>teleport BLT</Header>

      <Code>Balance: {balance}</Code>

      {/* <Code>{simpleTransaction}</Code> */}

      <input
        placeholder="Solana address"
        onChange={updateAddr}
      />

      <input
        placeholder="Amount 0.0"
        onChange={updateAmount}
      />

      <button onClick={sendTransaction}>
        Teleport
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default TeleportBLT
