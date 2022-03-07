import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';

import Card from '../../components/Card';
import Header from '../../components/Header';
import Code from '../../components/Code';

const SignMessage = ({ connector }) => {
  const { account, activate, library } = useWeb3React();
  const [status, setStatus] = useState("Not started");
  const [signType, setSignType] = useState('eth_sign');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    if (account && library  && message && status === 'Resolving...') {
      signMessage();
    }
    // eslint-disable-next-line
  }, [account, library]);

  const handleSelectType = (event) => {
    setSignType(event.target.value);
  };

  const updateMessage = (event) => {
    setMessage(event.target.value);
  };

  const sendTransaction = () => {
    setStatus("Resolving...");

    if (!account) {
      activate(connector);
    } else {
      signMessage();
    }
  };

  const signMessage = () => {
    switch (signType) {
      case 'eth_sign':
        library.eth.sign(message, account)
          .then(signature => {
            setSignature(signature)
            setStatus(`Signature success`);
          })
          .catch((error) => {
            console.error(error);
            setStatus("Signature failed");
          });
        break;
    
      case 'personal_sign':
        library.eth.personal.sign(message, account)
          .then(signature => {
            setSignature(signature);
            setStatus(`Signature success`);
          })
          .catch((error) => {
            console.error(error);
            setStatus("Signature failed");
          });
        break;

      default:
        setStatus('Unknown signType');
        break;
    };
  }

  return (
    <Card>
      <Header>Sign message</Header>

      <div>
        <input 
          type="radio" 
          id="eth_sign" 
          name="sign_type" 
          value="eth_sign"
          checked={signType === 'eth_sign'} 
          onChange={handleSelectType} 
        />
        <label htmlFor="eth_sign">eth_sign</label>
      </div>

      <div>
        <input 
          type="radio" 
          id="personal_sign" 
          name="sign_type" 
          value="personal_sign" 
          checked={signType === 'personal_sign'} 
          onChange={handleSelectType} 
        />
        <label htmlFor="personal_sign">personal_sign</label>
      </div>

      <input
        placeholder="Message..."
        onChange={updateMessage}
      />

      <button disabled={!message} onClick={sendTransaction}>
        Sign
      </button>

      <Code>Status: {status}</Code>

      {signature && <Code>{signature}</Code>}
    </Card>
  );
};

export default SignMessage;
