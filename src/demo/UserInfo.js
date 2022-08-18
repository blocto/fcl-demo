import React, { useState, useEffect } from "react"
import * as fcl from "@onflow/fcl"

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

          let address = proofService.data.address
          let nonce = proofService.data.nonce
          let appIdentifier = "MY-APP-Local-Testnet"

          const isValid = await fcl.AppUtils.verifyAccountProof(
            appIdentifier,
            {
              address,
              nonce,
              signatures: proofService.data.signatures
            },
            {
              fclCryptoContract: '0x5b250a8a85b44a67'
            }
          )

          // const message = fcl.WalletUtils.encodeAccountProof({
          //   address,
          //   nonce,
          //   appIdentifier,
          // }, false)

          // const isValid = await fcl.verifyUserSignatures(
          //   message,
          //   proofService.data.signatures,
          //   {
          //     fclCryptoContract: '0x5b250a8a85b44a67'
          //   }
          // )

          console.log(appIdentifier, isValid)
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
