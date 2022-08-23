import React, { useState } from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const { ec: EC } = require('elliptic');
const { SHA3 } = require('sha3');
const ec = new EC('secp256k1');

const simpleTransaction = `\
import FungibleToken from 0x9a0766d93b6608b7
import BloctoToken from 0x6e0797ac987005f5

transaction(amount: UFix64) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    let receiverRef: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount, receiver: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&BloctoToken.Vault>(from: BloctoToken.TokenStoragePath)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)

        self.receiverRef = receiver.getCapability(BloctoToken.TokenPublicReceiverPath)
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Could not borrow reference to receiver")
    }

    execute {
        // Deposit the withdrawn tokens in the recipient's receiver
        self.receiverRef.deposit(from: <-self.sentVault)
    }
}
`
const hashMsgHex = msgHex => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, 'hex'));
  return sha.digest();
};

const signWithKey = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32; // half of signature length?
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
};

const getAuth = (address, privateKey, keyId = 0) => async (account = {}) => {
  const addr = address.replace('0x', '');

  const { account: user } = await fcl.send([fcl.getAccount(addr)]);

  const key = user.keys[keyId];
  let sequenceNum;
  if (account.role.proposer) sequenceNum = key.sequenceNumber;

  const signingFunction = async data => ({
    addr,
    keyId: key.index,
    signature: signWithKey(privateKey, data.message),
  });

  return {
    ...account,
    addr,
    tempId: `blocto-tools-${addr}`,
    keyId: key.index,
    sequenceNum,
    signature: account.signature || null,
    signingFunction,
    resolve: null,
    roles: account.roles,
  };
};

const SetupVault = () => {
  const [status, setStatus] = useState("Not started")
  const [transaction, setTransaction] = useState(null)

  const sendTransaction = async (event) => {
    event.preventDefault()

    setStatus("Resolving...")

    const auth = getAuth(
      '0x6e0797ac987005f5',
      '2a7dff7b7e222213088682580b980e72b25c5a045324ce19a1f59a49b1512014',
      0
    )

    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(simpleTransaction),
        fcl.args([
          fcl.arg("100.0", t.UFix64),
        ]),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([auth, fcl.currentUser().authorization]),
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
      <Header>get BLT</Header>

      <Code>{simpleTransaction}</Code>

      <button onClick={sendTransaction}>
        Send
      </button>

      <Code>Status: {status}</Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default SetupVault
