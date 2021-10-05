import * as fcl from "@portto/fcl"

fcl.config()
  // .put("accessNode.api", "http://localhost:8080") // local Flow emulator
  // .put("challenge.handshake", "http://localhost:8701/flow/authenticate") // local dev wallet
  .put("challenge.scope", "email") // request for Email
  .put("accessNode.api", "https://access-mainnet-beta.onflow.org") // Flow testnet
  .put("discovery.wallet", "https://flow-wallet.blocto.app/authn") // Blocto testnet wallet
  .put("discovery.wallet.method", "HTTP/POST")
  .put("service.OpenID.scopes", "email!")
