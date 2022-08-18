import React from 'react';
import styled from 'styled-components'

import Section from './components/Section'
import Header from './components/Header'

import GetAccount from './demo/GetAccount'
import ScriptOne from "./demo/ScriptOne"
import ScriptTwo from './demo/ScriptTwo'
import Authenticate from './demo/Authenticate'
import UserInfo from './demo/UserInfo'
import SendTransaction from './demo/SendTransaction'
import SignMessage from './demo/SignMessage'
import SendFUSD from './demo/SendFUSD'
import DeployContract from './demo/DeployContract'
import InteractWithContract from './demo/InteractWithContract'

const Wrapper = styled.div`
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
`;

function App() {
  return (
    <Wrapper>
      <Section>
        <Header>READ from FCL</Header>
        <GetAccount />
        <ScriptOne />
        <ScriptTwo />
      </Section>

      <Section>
        <Header>FCL wallet interactions</Header>
        <Authenticate />
        <UserInfo />
        <SendTransaction />
        <SignMessage />
        <SendFUSD />
        <DeployContract />
        <InteractWithContract />
      </Section>
    </Wrapper>
  );
}

export default App;
