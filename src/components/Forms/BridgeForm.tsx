import { Web3Provider } from "@ethersproject/providers";
import React, { useState } from "react";
import { ISupportedAsset } from "src/constants/supportedAssets";

import { FormContainer, BridgeButton } from "./styledComponents";
import { getChainData } from "./../../helpers/utilities";

import { Bridge, Token } from "src/types";
import { State } from "./FormsWrapper";

export interface IBridgeFormProps {
  library: Web3Provider;
  contract: Bridge;
  tokenContract: Token | null;
  setState: React.Dispatch<React.SetStateAction<State>>;
  from: ISupportedAsset;
  to: ISupportedAsset;
  amount: string;
  setIsWrapped: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const BridgeForm = (props: IBridgeFormProps) => {
  const initialMessage = "Now it's time to bridge your tokens.";

  const [notification, setNotification] = useState<string>(initialMessage);

  const notify = async (message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const onBridge = async (_e: any) => {
    if (!props.tokenContract || !props.contract) {
      notify("Something went wrong!");
      return;
    }

    const isWrapped = await props.tokenContract
      .owner()
      .then((owner) => {
        if (owner === props.contract.address) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        return false;
      });

    props.setIsWrapped(isWrapped);
    if (isWrapped) {
      burnTokens();
    } else {
      lockTokens();
    }
  };

  const lockTokens = async () => {
    console.log("here");

    const tx = await props.contract
      .lock(props.to.chainId, props.tokenContract!.address, props.amount)
      .catch((err) => {
        console.log(err);

        notify(err.message);
      });
    if (!tx) {
      return;
    }

    setNotification(`Processing transaction (lock)... Tx Hash: ${tx.hash}`);

    props.library
      .waitForTransaction(tx.hash)
      .then(async () => {
        notify("Success!");
        setTimeout(() => {
          props.setState(State.claim);
        }, 4000);
      })
      .catch((err) => {
        notify(err.message);
      });
  };

  const burnTokens = async () => {
    const tx = await props.contract
      .burn(props.tokenContract!.address, props.amount)
      .catch((err) => {
        notify(err.message);
      });
    if (!tx) {
      return;
    }

    setNotification(`Processing transaction (burn)... Tx Hash: ${tx.hash}`);

    props.library
      .waitForTransaction(tx.hash)
      .then(async () => {
        notify("Success!");
        setTimeout(() => {
          props.setState(State.claim);
        }, 4000);
      })
      .catch((err) => {
        notify(err.message);
      });
  };

  return (
    <FormContainer>
      {props.from.chainId === props.library._network.chainId ? (
        <BridgeButton onClick={(e: any) => onBridge(e)}>Bridge</BridgeButton>
      ) : (
        `You must change your wallet network to "${
          getChainData(props.from.chainId).name
        }"`
      )}
      <p>{notification}</p>
    </FormContainer>
  );
};

export default BridgeForm;
