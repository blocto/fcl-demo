import React from 'react';
import styled from 'styled-components'

import Header from './components/Header'
import ScriptTwo from './demo/ScriptTwo'

const Wrapper = styled.div`
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
`;

function App() {
  return (
    <Wrapper>
      <Header>Very Ugly UI for BLT Staking Stats</Header>
      <ScriptTwo />
    </Wrapper>
  );
}

export default App;
