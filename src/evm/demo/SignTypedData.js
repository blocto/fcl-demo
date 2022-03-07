import React, { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';

import Card from '../../components/Card';
import Header from '../../components/Header';
import Code from '../../components/Code';

const typedDataV3 = '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":4,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}}';
const typedDataV4 = '{"domain":{"chainId":4,"name":"Ether Mail","verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC","version":"1"},"message":{"contents":"Hello, Bob!","from":{"name":"Cow","wallets":["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826","0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF"]},"to":[{"name":"Bob","wallets":["0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB","0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57","0xB0B0b0b0b0b0B000000000000000000000000000"]}]},"primaryType":"Mail","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Group":[{"name":"name","type":"string"},{"name":"members","type":"Person[]"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person[]"},{"name":"contents","type":"string"}],"Person":[{"name":"name","type":"string"},{"name":"wallets","type":"address[]"}]}}';

const SignTypedData = ({ connector }) => {
  const {account, activate, library} = useWeb3React();
  const [status, setStatus] = useState("Not started");
  const [version, setVersion] = useState('v4');
  const [typedSignature, setTypedSignature] = useState(null);

  const typedData = version === 'v4' ? typedDataV4 : typedDataV3;

  useEffect(() => {
    if (account && library && status === 'Resolving...') {
      sign();
    }
   // eslint-disable-next-line
  }, [account, library]);

  const handleSelectVersion = (event) => {
    setVersion(event.target.value);
  };

  const sendTransaction = () => {
    setStatus("Resolving...");

    if (!account) {
      activate(connector);
    } else {
      sign();
    }
  };

  const sign = () => {
    const provider = library.currentProvider;
    provider.request({ method: 'eth_signTypedData', params: [account, typedData], from: account })
      .then(signature => {
        setTypedSignature(signature);
        setStatus(`Signature success`);
      })
      .catch((error) => {
        console.error(error);
        setStatus("Signature failed");
      });
  };

  return (
    <Card>
      <Header>Sign Typed Data</Header>

      <div>
        <input 
          type="radio" 
          id="v4" 
          name="version" 
          value="v4" 
          checked={version === 'v4'} 
          onChange={handleSelectVersion} 
        />
        <label htmlFor="v4">v4</label>
      </div>

      <div>
        <input 
          type="radio" 
          id="v3" 
          name="version" 
          value="v3"
          checked={version === 'v3'} 
          onChange={handleSelectVersion} 
        />
        <label htmlFor="v3">v3</label>
      </div>

      <Code>{typedData}</Code>

      <button onClick={sendTransaction}>
        Sign
      </button>

      <Code>Status: {status}</Code>

      {typedSignature && <Code>{typedSignature}</Code>}
    </Card>
  );
};

export default SignTypedData;
