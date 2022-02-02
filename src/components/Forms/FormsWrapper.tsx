import React, { useEffect, useState } from "react";
import {
  ISupportedAsset,
  IToken,
  SUPPORTED_ASSETS,
} from "src/constants/supportedAssets";

import ApproveForm from "./ApproveForm";
// import BridgeForm from "./BridgeForm";
// import ClaimForm from "./ClaimForm";

enum State {
  approve = 0,
  bridge = 1,
  claim = 2,
}

const FormsWrapper = (props: any) => {
  const [state, setState] = useState<State>(State.approve);

  const [from, setFrom] = useState<ISupportedAsset>(SUPPORTED_ASSETS[0]);
  const [to, setTo] = useState<ISupportedAsset>(SUPPORTED_ASSETS[1]);
  const [token, setToken] = useState<IToken>(SUPPORTED_ASSETS[0].tokens[0]);

  const [amount, setAmount] = useState<number>(0);

  switch (state) {
    case State.approve:
      return (
        <ApproveForm
          library={props.library}
          from={from}
          to={to}
          token={token}
          setFrom={setFrom}
          setTo={setTo}
          setToken={setToken}
          amount={amount}
          setAmount={setAmount}
        />
      );
    case State.bridge:
      // return <BridgeForm />;
      return (
        <ApproveForm
          library={props.library}
          from={from}
          to={to}
          token={token}
          setFrom={setFrom}
          setTo={setTo}
          setToken={setToken}
          amount={amount}
          setAmount={setAmount}
        />
      );
    case State.claim:
      // return <ClaimForm />;
      return (
        <ApproveForm
          library={props.library}
          from={from}
          to={to}
          token={token}
          setFrom={setFrom}
          setTo={setTo}
          setToken={setToken}
          amount={amount}
          setAmount={setAmount}
        />
      );
    default:
      return (
        <ApproveForm
          library={props.library}
          from={from}
          to={to}
          token={token}
          setFrom={setFrom}
          setTo={setTo}
          setToken={setToken}
          amount={amount}
          setAmount={setAmount}
        />
      );
  }
};

export default FormsWrapper;
