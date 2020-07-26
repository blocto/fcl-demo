import React from 'react';
import * as fcl from "@onflow/fcl"

import Section from './components/Section'
import Header from './components/Header'

import GetLatestBlock from './demo/GetLatestBlock'
import GetAccount from './demo/GetAccount'
import ScriptOne from "./demo/ScriptOne"
import ScriptTwo from './demo/ScriptTwo'
import Authenticate from './demo/Authenticate'
import UserSnapshot from './demo/UserSnapshot'
import SendTransaction from './demo/SendTransaction'

fcl.config()
  .put("accessNode.api", "http://access-001.devnet9.nodes.onflow.org:8000")
  .put("challenge.handshake", "https://flow-wallet-staging.blocto.app/authn")

function App() {
  return (
    <div className="App">
      <Section>
        <Header>READ from FCL</Header>
        <GetLatestBlock />
        <GetAccount />
        <ScriptOne />
        <ScriptTwo />
      </Section>

      <Section>
        <Header>FCL wallet interactions</Header>
        <Authenticate />
        <UserSnapshot />
        <SendTransaction />
      </Section>
    </div>
  );
}

export default App;
