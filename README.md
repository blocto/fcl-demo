# Flow Client Library demonstration
You can find an online demo [Here](http://34.71.72.144/) 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

### Setting up environment 
In order for this demo to work, you have to setup the dependencies first:

- **Install Flow CLI** [Here](https://github.com/onflow/flow/blob/master/docs/cli.md)  
The Flow CLI is a command-line interface that provides useful utilities for building Flow applications. The tool we need in this demo is *Flow emulator*, a local emulator of Flow blockchain.
- **Install project dependencies** with `yarn` or `yarn install`.

### Starting the services


## Diving into Demo
All the demo cases are located in `./src/demo`. Each component is responsible for one example interaction with FCL. 

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
