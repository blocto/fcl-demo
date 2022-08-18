import * as fcl from "@onflow/fcl"
import { send as httpSend } from "@onflow/transport-http"

const resolver = () => {
  return Promise.resolve({
    appIdentifier: "MY-APP-Local-Testnet",

    // some nonce
    nonce: "75f8587e5bd5f9dcc9909d0dae1f0ac5814458b2ae129620502cb936fde7120a"
  })
}

fcl.config({
  'env': 'testnet',
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://flow-wallet-testnet.blocto.app/authn',
  'app.detail.title': 'MY-APP-Local-Testnet',
  'fcl.appDomainTag': 'MY-APP-Local-Testnet',
  'fcl.accountProof.resolver': resolver,
  'sdk.transport': httpSend,
  'service.OpenID.scopes': 'email!'
})
  // .put("accessNode.api", "http://localhost:8080") // local Flow emulator
  // .put("challenge.handshake", "http://localhost:8701/flow/authenticate") // local dev wallet
  // .put("discovery.wallet", "http://localhost:8702/authn") // Blocto testnet wallet
  // .put("discovery.wallet", "http://localhost:8702/authn") // Blocto testnet wallet
