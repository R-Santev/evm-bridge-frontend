import { Web3Provider } from "@ethersproject/providers";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  ISupportedAsset,
  IToken,
  SUPPORTED_ASSETS,
} from "src/constants/supportedAssets";
import ChainDropdown from "../ChainDropdown";

import {
  FormContainer,
  ChainContainer,
  Input,
  BridgeButton,
} from "./styledComponents";

export interface IApproveFormProps {
  library: Web3Provider;
  from: ISupportedAsset;
  to: ISupportedAsset;
  token: IToken;
  setFrom: React.Dispatch<React.SetStateAction<ISupportedAsset>>;
  setTo: React.Dispatch<React.SetStateAction<ISupportedAsset>>;
  setToken: React.Dispatch<React.SetStateAction<IToken>>;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}

const ApproveForm = (props: IApproveFormProps) => {
  const initialMessage =
    "Give permissions to the contract to bridge your tokens.";

  const [notification, setNotification] = useState<string>(initialMessage);

  const onApprove = (_e: any) => {
    console.log(props.amount);
    return;
    // if (!amountt) {
    //   setMessageHandler("You must provide tokens amount!");
    //   return;
    // }
    // if (!props.tokenContract) {
    //   setMessageHandler("Something went wrong!");
    //   return;
    // }
    // const parsedAmount = ethers.utils.parseEther(amountt);
    // const approveTx = await props.tokenContract.approve(
    //   SOURCE_CHAIN_ADDRESS,
    //   parsedAmount
    // );
    // if (!approveTx) {
    //   return;
    // }
    // setMessage("Processing approve transaction...");
    // props.library.waitForTransaction(approveTx.hash).then(async () => {
    //   setMessage("");
    //   console.log(props.contract);
    // });
  };

  const notify = async (message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    props.setAmount(e.target.valueAsNumber);
  };

  return (
    <FormContainer>
      <ChainContainer>
        <p>FROM: </p>
        <ChainDropdown
          choosen={props.from}
          data={SUPPORTED_ASSETS}
          setChoosen={props.setFrom}
        />
        <Input
          type="number"
          placeholder="Amount"
          onChange={(e) => handleAmount(e)}
        />
      </ChainContainer>
      {/* <Button onClick={switchAssets}>Switch</Button> */}
      <ChainContainer>
        <p>TO: </p>
        <ChainDropdown
          choosen={props.to}
          data={SUPPORTED_ASSETS}
          setChoosen={props.setTo}
        />
      </ChainContainer>
      {props.from.chainId === props.library._network.chainId ? (
        <BridgeButton onClick={(e: any) => onApprove(e)}>Approve</BridgeButton>
      ) : (
        `You must change your metamask network to "${props.from.chainId}"`
      )}
      <p>{notification}</p>
    </FormContainer>
  );
};

export default ApproveForm;
