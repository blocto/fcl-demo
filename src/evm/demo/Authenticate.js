import React from "react";
import { useWeb3React } from '@web3-react/core';

import Card from '../../components/Card';

const Authenticate = ({ connector }) => {
  const { active, activate, deactivate } = useWeb3React();

  const signInOrOut = () => {
    if (active) {
      deactivate();
    } else {
      activate(connector);
    }
  };

  return (
    <Card>
      <button onClick={signInOrOut}>
        {active ? 'Sign Out' : 'Sign In/Up'}
      </button>
    </Card>
  )
};

export default Authenticate;
