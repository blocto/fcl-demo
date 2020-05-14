import React from 'react';
import * as fcl from "@onflow/fcl";

import './App.css';
import Point from './Point';
import CurrentUser from './components/CurrentUser';
import ScriptOne from "./components/ScriptOne"
import ScriptTwo from './components/ScriptTwo';
import TransactionOne from './components/TransactionOne';

fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")
  .put("decoder.SomeStruct", data => new Point(data))

function App() {
  return (
    <div className="App">
      <CurrentUser />
      <ScriptOne />
      <ScriptTwo />
      <TransactionOne />
    </div>
  );
}

export default App;
