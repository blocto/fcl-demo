import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';

import Card from '../../components/Card';
import Header from '../../components/Header';
import Code from '../../components/Code';

const UserInfo = ({ chain }) => {
  const { account, library } = useWeb3React();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (account && library) {
      library.eth.getBalance(account).then((balanceResponse) => {
        setBalance(library.utils.fromWei(balanceResponse));
      }); 
    }
  }, [account, library]);

  return (
    <Card>
      <Header>User information</Header>

      <Code>
        Account: {account}
        <br/>
        Balance: {balance} {chain === 'ethereum' ? 'ETH' : 'BSC'}
      </Code>
    </Card>
  )
};

export default UserInfo;
