import React, { useState } from "react";
import {
  ISupportedAsset,
  IToken,
  SUPPORTED_ASSETS,
} from "src/constants/supportedAssets";

import ApproveForm from "./ApproveForm";

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

  switch (state) {
    case State.approve:
      return (
        <ApproveForm
          from={from}
          to={to}
          token={token}
          setFrom={setFrom}
          setTo={setTo}
          setToken={setToken}
        />
      );
    case State.bridge:
      return <BridgeForm />;
      break;
    case State.claim:
      return <ClaimForm />;
      break;
    default:
      props.resetApp();
      break;
  }
};

export default FormsWrapper;
