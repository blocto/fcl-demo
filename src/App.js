import React from 'react';
import { Routes, Route } from "react-router-dom";
import styled from 'styled-components'

import { GlobalStyle } from './globalStyle';
import Select from './components/Select';
import Flow from './flow';

const Wrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 100px min(8.3%, 120px);
`;

function App() {
  return (
    <Wrapper>
      <GlobalStyle/>
      <h1>
        Blocto SDK Demo Site
      </h1>

      <Select/>

      <Routes>
        <Route path="/" element={<Flow />} />
        <Route path="flow" element={<Flow />} />
        <Route path="ethereum" element={<div>ethereum</div>} />
        <Route path="bsc" element={<div>bsc</div>} />
        <Route path="solana" element={<div>solana</div>} />
      </Routes>
    </Wrapper>
  );
}

export default App;
