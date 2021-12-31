import React, { useState, useEffect } from "react"
import * as fcl from "@blocto/fcl"
import * as t from "@onflow/types"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

import checkScripts from "./checkScripts"
import transferScripts from "./transferScripts"

const SendFUSD = () => {
  const [token, setToken] = useState('FLOW')
  const [balance, setBalance] = useState(0)
  const [addresses, setAddresses] = useState([])
  const [amounts, setAmounts] = useState([])
  const [status, setStatus] = useState("Not started")
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [transaction, setTransaction] = useState(null)
  const [transactionId, setTransactionId] = useState(null)

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

      const script = checkScripts[token]

      try {
        const response = await fcl.send([
          fcl.script(script),
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
  }, [user, token])

  const updateFile = (event) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      var textArea = document.getElementById("amountsInput")
      textArea.value = e.target.result
      processAmounts(e.target.result)
    };
    reader.readAsText(event.target.files[0])
  }

  const updateToken = (event) => {
    setToken(event.target.value)
  }

  const processAmounts = raw => {
    setError(null)

    try {
      let tempAddresses = []
      let tempAmounts = []
      raw.split('\n').forEach(row => {
        let [address, amount] = row.split(',')

        if (!amount) {
          throw Error('failed parsing input')
        }

        address = address.trim().replace('\b', '')
        amount = parseFloat(amount).toFixed(8)

        if (amount === 'NaN') {
          throw Error('failed parsing input')
        }

        tempAddresses = [...tempAddresses, address]
        tempAmounts = [...tempAmounts, amount]
      })

      setAddresses(tempAddresses)
      setAmounts(tempAmounts)

    } catch (e) {
      setError(e.toString())
    }
  }

  const updateAmounts = (event) => {
    event.preventDefault();

    processAmounts(event.target.value)
  }

  const sendTransaction = async (event) => {
    event.preventDefault()

    setStatus("Resolving...")
    setTransactionId(null)

    const blockResponse = await fcl.send([
      fcl.getLatestBlock(),
    ])

    const block = await fcl.decode(blockResponse)
    const transferScript = transferScripts[token]

    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(transferScript),
        fcl.args([
          fcl.arg(
            addresses,
            t.Array(t.Address)
          ),
          fcl.arg(
            amounts,
            t.Array(t.UFix64)
          )
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
      setTransactionId(transactionId)

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
      <Header>Send Tokens</Header>

      <select onChange={updateToken}>
        <option value="FLOW">FLOW</option>
        <option value="FUSD">FUSD</option>
        <option value="BLT">BLT</option>
      </select>

      <Code>Balance: {balance}</Code>

      <textarea
        id="amountsInput"
        cols="50"
        rows="10"
        placeholder={`address, amount\naddress, amount`}
        onChange={updateAmounts}
      />

      <br />

      <input
        type="file"
        onChange={updateFile}
      />

      <button onClick={sendTransaction}>
        Send
      </button>

      {error && <Code>{error}</Code>}

      <Code>Status: {status}</Code>

      {transactionId && <a href={`https://flowscan.org/transaction/${transactionId}`} target="_blank" rel="noopener noreferrer">Check on Flowscan</a>}

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SendFUSD
