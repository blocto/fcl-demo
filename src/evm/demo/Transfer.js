import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core';

import Card from '../../components/Card';
import Header from '../../components/Header';
import Code from '../../components/Code';

const Transfer = ({ chain, connector }) => {
  const { account, activate, library } = useWeb3React();
  const [balance, setBalance] = useState(0);
  const [addr, setAddr] = useState(null);
  const [amount, setAmount] = useState(null);
  const [status, setStatus] = useState("Not started");
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    if (account && library && addr && amount && status === 'Resolving...') {
      transfer();
    }
    // eslint-disable-next-line
  }, [account, library]);

  useEffect(() => {
    if (account && library) {
      library.eth.getBalance(account).then((balanceResponse) => {
        setBalance(library.utils.fromWei(balanceResponse));
      }); 
    }
  }, [account, library]);

  const updateAddr = (event) => {
    setAddr(event.target.value);
  };

  const updateAmount = (event) => {
    setAmount(event.target.value);
  };

  const sendTransaction = () => {
    setStatus("Resolving...");

    if(!account) {
      activate(connector);
    } else {
      transfer();
    }
  };

  const transfer = () => {
    library.eth.sendTransaction({
      from: account,
      to: addr,
      value: amount,
    })
      .then(response => {
        setTransaction(response);
        setStatus(`Transaction success`);
        library.eth.getBalance(account)
          .then(response => 
            setBalance(library.utils.fromWei(response))
          );
      })
      .catch((error) => {
        console.error(error);
        setStatus("Transaction failed");
      });
  };

  return (
    <Card>
      <Header>Send {chain === 'ethereum' ? 'ETH' : 'BSC'}</Header>

      <Code>Balance: {balance} {chain === 'ethereum' ? 'ETH' : 'BSC'}</Code>

      <input
        placeholder="Receiver Address 0x..."
        onChange={updateAddr}
      />

      <input
        placeholder="Amount(wei) 0.0"
        onChange={updateAmount}
      />

      <button onClick={sendTransaction}>
        Send
      </button>

      <Code>
        Status: {status} {status === 'Transaction success' && 
          <div>
            Check your transaction {' '} 
            <a 
              href={`${chain === 'ethereum' ? 'https://rinkeby.etherscan.io/tx' : 'https://testnet.bscscan.com/tx'}/${transaction.transactionHash}`}  
              target="_blank"
              rel="noreferrer noopener"
            >
              here
            </a>
          </div>
        }
      </Code>

      {transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  );
};

export default Transfer;
