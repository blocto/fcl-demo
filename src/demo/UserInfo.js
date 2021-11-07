import React, { useState, useEffect } from "react"
import * as fcl from "@onflow/fcl"
import { verifyUserSignatures } from './verify'

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

import { ec as EC } from 'elliptic';
import { SHA3 } from 'sha3';

const ec = new EC('p256');

const hashMsgHex = (msgHex) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, 'hex'));
  return sha.digest();
};

export function sign(accountPrivateKey, msgHex) {
  const key = ec.keyFromPrivate(Buffer.from(accountPrivateKey, 'hex'));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
}

const UserInfo = () => {
  const [user, setUser] = useState(null)
  const [proof, setProof] = useState({})

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(async (user) => {
        setUser({ ...user })

        if (user.services) {
          let proofService = user.services.find(service => service.type === 'account-proof')
          setProof(proofService)

          if (!proofService) {
            return
          }

          let addr = proofService.data.address
          let timestamp = proofService.data.timestamp
          let domainTag = proofService.data.domainTag

          const message = fcl.WalletUtils.encodeMessageForProvableAuthnVerifying(
            addr,
            timestamp,
            domainTag
          )

          const isValid = await fcl.verifyUserSignatures(
            message,
            proofService.data.signatures
          )

          console.log(message, isValid)
        }
      })
    , [])

  return (
    <Card>
      <Header>User information</Header>

      {user && <Code>{JSON.stringify(user, null, 2)}</Code>}

      {proof && <Code>{JSON.stringify(proof, null, 2)}</Code>}
    </Card>
  )
}

export default UserInfo
