import React from 'react';
import styled from 'styled-components'

import Authenticate from './demo/Authenticate'
import SendToken from './demo/SendToken'

const Wrapper = styled.div`
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
`;

function App() {
  return (
    <Wrapper>
      <Authenticate />
      <SendToken />
    </Wrapper>
  );
}

export default App;
