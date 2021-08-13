import * as fcl from "@onflow/fcl"

fcl.config()
  //emulator
  // .put("accessNode.api", "http://localhost:8080") // local Flow emulator
  // .put("discovery.wallet", "http://localhost:8701/flow/authenticate") // local dev wallet
  // .put("challenge.scope", "email") // request for Email
  // .put("0xFTADDRESS", "0xee82856bf20e2aa6")
  // .put("0xNFTADDRESS", "0xf8d6e0586b0a20c7")
  // .put("0xANIQUEADDRESS", "0xf8d6e0586b0a20c7")
  //testnet
  .put("accessNode.api", "https://access-testnet.onflow.org") // Flow testnet
  .put("discovery.wallet", "https://flow-wallet-testnet.blocto.app/authn") // Blocto testnet wallet
  .put("challenge.scope", "email") // request for Email
  .put("0xFTADDRESS", "0x9a0766d93b6608b7")
  .put("0xNFTADDRESS", "0x631e88ae7f1d7c20")
  .put("0xANIQUEADDRESS", "0xd284f03bf25ea331")
  .put("0xANIQUECREDITADDRESS", "0xd284f03bf25ea331")
  .put("0xTOKENADDRESS", "0x7e60df042a9c0868")
  .put("0xFUSDADDRESS", "0xd284f03bf25ea331")