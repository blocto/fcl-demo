import React from 'react';
import styled from 'styled-components'

import Section from './components/Section'

import Authenticate from './demo/Authenticate'
import UserInfo from './demo/UserInfo'
import SetupVault from './demo/SetupVault'
import GetBLT from './demo/GetBLT'
import TeleportBLT from './demo/TeleportBLT'

const Wrapper = styled.div`
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
`;

function App() {
  return (
    <Wrapper>
      <Section>
        <Authenticate />
        <UserInfo />
        <SetupVault />
        <GetBLT />
        <TeleportBLT />
      </Section>
    </Wrapper>
  );
}

export default App;
