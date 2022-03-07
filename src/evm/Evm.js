import React from 'react';
import styled from 'styled-components';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

import Section from '../components/Section';
import Header from '../components/Header';

import { BscConnector, EthereumConnector} from './connector';
import Authenticate from './demo/Authenticate';
import UserInfo from './demo/UserInfo';
import SignMessage from './demo/SignMessage';
import SignTypedData from './demo/SignTypedData';
import Transfer from './demo/Transfer';

const Wrapper = styled.div`
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
`;

function getLibrary(provider) {
  return new Web3(provider);
};

function Evm({ chain }) {
  const connector = chain === 'ethereum' ? EthereumConnector : BscConnector;
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Wrapper>
        <Section>
          <Header>READ from Blocto SDK</Header>
          <Authenticate connector={connector} />
          <UserInfo chain={chain} />
          <SignMessage connector={connector} />
          <SignTypedData connector={connector} />
          <Transfer chain={chain} connector={connector} />
        </Section>
      </Wrapper>
    </Web3ReactProvider>
  );
};

export default Evm;
