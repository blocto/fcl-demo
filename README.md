# Flow Client Library demonstration
You can find an online demo [Here](http://34.71.72.144/) 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

### Setting up environment 
In order for this demo to work, you have to setup the dependencies first:

- **Install Flow CLI** [Here](https://github.com/onflow/flow/blob/master/docs/cli.md)  
The Flow CLI is a command-line interface that provides useful utilities for building Flow applications. The tool we need in this demo is *Flow emulator*, a local emulator of Flow blockchain.
- **Install project dependencies**  
Run `yarn` at project root.

### Starting the services
- **Start Flow emulator**  
Run `flow emulator start` at project root. Flow CLI will use the `./flow.json` file as config to start up the local Flow emulator.  
The emulator provides a local access node at `http://localhost:8080`
- **Start FCL dev-wallet**  
Run `yarn run dev-wallet` at project root. Check out `package.json` that this script starts the FCL dev wallet with private key identical in `./flow.json`.  
The dev wallet is served at `http://localhost:8701`
- **Start demo webapp**  
Run `yarn start` at project root and you will see the demo webapp running at `http://localhost:3000`

## Diving into Demo
All the demo cases are located in `./src/demo`. Each component is responsible for one example interaction with FCL. 

- **GetLatestBlock**: Get the information of the latest block produced on Flow blockchain
- **GetAccount**: Get the account information for any specified account address
- **ScriptOne**: Executes a simple script (read-only)
- **ScriptTwo**: Executes a simple script (read-only) but with custom decoder for custom Cadence structure
- **Authenticate**: Handles sign in/out logic with FCL wallet
- **UserSnapshot**: Subscribes to `fcl.currentUser()` and shows the connected user account information 
- **SendTransaction**: Sends a simple transaction to Flow. This requires the signatures from the connected user

## Switch to Devnet-9
Optionally, you can use Flow devnet-9 instead of local emulator. To do so, you only have to update the FCL config inside `./src/App.js`:
```
fcl.config()
  .put("accessNode.api", "http://access-001.devnet9.nodes.onflow.org:8000")
  .put("challenge.handshake", "https://flow-wallet-staging.blocto.app/authn")
```
This will use a devnet9 access node instead of local emulator, and *Blocto devnet wallet* instead of local dev-wallet.

Note that you also have to lock your `@onflow/fcl` version to `0.0.42` because there are breaking changes to the access node API and devnet-9 is using the older spec.

## Contact
If you encounter any questions while trying out Flow, please go to [Flow Discord Server](https://discord.gg/SEJtd32), where you can find other developers to help you out.
