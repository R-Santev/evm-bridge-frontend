import React, { useEffect, useState } from "react";
import {
  ISupportedAsset,
  SUPPORTED_ASSETS,
} from "src/constants/supportedAssets";
import { Token, Token__factory } from "src/types";
import ethersHelper from "./../../helpers/ethers";

import ApproveForm from "./ApproveForm";
import BridgeForm from "./BridgeForm";
import ClaimForm from "./ClaimForm";
// import BridgeForm from "./BridgeForm";
// import ClaimForm from "./ClaimForm";

export enum State {
  approve = 0,
  bridge = 1,
  claim = 2,
}

const FormsWrapper = (props: any) => {
  const [state, setState] = useState<State>(State.approve);

  const [from, setFrom] = useState<ISupportedAsset>(SUPPORTED_ASSETS[0]);
  const [to, setTo] = useState<ISupportedAsset>(SUPPORTED_ASSETS[1]);
  const [token, setToken] = useState<string | undefined>();
  const [tokenContract, setTokenContract] = useState<Token | null>(null);

  const [amount, setAmount] = useState<string>("0");

  useEffect(() => {
    if (!token || !props.userAddress) {
      return;
    }

    const contract = ethersHelper.getContract<Token, typeof Token__factory>(
      Token__factory,
      token,
      props.library,
      props.userAddress
    );

    setTokenContract(contract);
  }, [token]);

  switch (state) {
    case State.approve:
      return (
        <ApproveForm
          library={props.library}
          contract={props.contract}
          tokenContract={tokenContract}
          setState={setState}
          from={from}
          to={to}
          token={token}
          setFrom={setFrom}
          setTo={setTo}
          setToken={setToken}
          amount={amount}
          setAmount={setAmount}
          userAddress={props.userAddress}
        />
      );
    case State.bridge:
      return (
        <BridgeForm
          library={props.library}
          contract={props.contract}
          tokenContract={tokenContract}
          setState={setState}
          from={from}
          to={to}
          amount={amount}
        />
      );

    case State.claim:
      // return <ClaimForm />;
      return (
        <ClaimForm
          library={props.library}
          contract={props.contract}
          tokenContract={tokenContract}
          setState={setState}
          from={from}
          to={to}
          amount={amount}
          userAddress={props.userAddress}
        />
      );
    default:
      return (
        <ApproveForm
          library={props.library}
          contract={props.contract}
          tokenContract={tokenContract}
          setState={setState}
          from={from}
          to={to}
          token={token}
          setFrom={setFrom}
          setTo={setTo}
          setToken={setToken}
          amount={amount}
          setAmount={setAmount}
          userAddress={props.userAddress}
        />
      );
  }
};

export default FormsWrapper;
