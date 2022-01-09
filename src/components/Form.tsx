import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";

import Button from "./Button";

import { SOURCE_CHAIN_ADDRESS, TOKEN_ADDRESS } from "src/constants";

const FormContainer = styled.div`
  height: 80%;
  min-height: 400px;
  width: 400px
  margin: 15px
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
  border: 1px solid rgb(74 154 246);
`;

const ChainContainer = styled.div`
  display: flex;
  flex-basis: 50%;
  width: 95%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid blue;
  margin: 15px;
`;

const Input = styled.input``;

const BridgeButton = styled(Button)`
  background-color: purple;
  margin-bottom: 15px;
`;

enum State {
  bridge = "Bridge",
  un_bridge = "UnBridge",
}

const sourceChain = "Ethereum Kovan";
const targetChain = "BSC Testnet";

enum ChainId {
  "Ethereum Kovan" = 42,
  "BSC Testnet" = 97,
}

const Form = (props: any) => {
  const [state, setState] = useState(State.bridge);
  const [upperChain, setUpperChain] = useState("");
  const [bottomChain, setBottomChain] = useState("");
  const [amount, setAmount] = useState("");
  const [stepTwo, setStepTwo] = useState(false);
  const [message, setMessage] = useState("");

  const [bridgeHandler, setBridgeHandler] = useState<
    (e: any, amount: string) => Promise<void>
  >(() => bridgeTokens);
  const [stepTwoHandler, setStepTwoHandler] = useState<
    (amount: string) => Promise<void> | undefined
  >();

  useEffect(() => {
    if (state === State.bridge) {
      setUpperChain(sourceChain);
      setBottomChain(targetChain);
      setBridgeHandler(() => bridgeTokens);
      setStepTwoHandler(() => claimTokens);
    } else {
      setUpperChain(targetChain);
      setBottomChain(sourceChain);
      setBridgeHandler(() => unBridgeTokens);
      setStepTwoHandler(() => burnTokens);
    }
  }, [state]);

  const setMessageHandler = async (message: string) => {
    setMessage(message);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const bridgeTokens = async (e: any, amountt: string) => {
    if (!amountt) {
      setMessageHandler("You must provide tokens amount!");
      return;
    }

    const parsedAmount = ethers.utils.parseEther(amountt);
    const approveTx = await props.tokenContract.approve(
      SOURCE_CHAIN_ADDRESS,
      parsedAmount
    );

    if (!approveTx) {
      return;
    }

    setMessage("Processing approve transaction...");
    props.library
      .waitForTransaction(approveTx.hash)
      .then(async () => {
        setMessage("");
        console.log(props.contract);

        const tx = await props.contract.lock(
          ChainId[upperChain],
          TOKEN_ADDRESS,
          ethers.utils.parseEther("1")
        );

        props.library
          .waitForTransaction(tx.hash)
          .then(async () => {
            console.log("Success!");
            setStepTwo(true);
          })
          .catch((err: any) => {
            console.log(err);

            // setNotification(`Error occurred: ${err.message}`);
          });
      })
      .catch((err: any) => {
        console.log(err);

        // setNotification(`Error occurred: ${err.message}`);
      });
  };

  const unBridgeTokens = async () => {
    console.log("UnBridge!");
  };

  const claimTokens = async (amount: string) => {
    const tx = await props.contract.mint(
      "Test Value",
      "TEST",
      18,
      ethers.utils.parseEther(amount),
      props.address
    );

    if (!tx) {
      return;
    }

    props.library
      .waitForTransaction(tx.hash)
      .then(async () => {
        console.log("Success!");
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const burnTokens = async () => {
    console.log("burn!");
  };

  const handleState = () => {
    if (state === State.bridge) {
      setState(State.un_bridge);
    } else {
      setState(State.bridge);
    }
  };

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    setAmount(e.target.value);
  };

  return (
    <>
      <FormContainer>
        <ChainContainer>
          <p>FROM: {upperChain}</p>
          <Input
            type="number"
            placeholder="Amount"
            onChange={(e) => handleAmount(e)}
          />
        </ChainContainer>
        <Button onClick={handleState}>Switch</Button>
        <ChainContainer>
          <p>TO: {bottomChain}</p>
        </ChainContainer>
        {ChainId[upperChain] === props.library._network.chainId ? (
          <BridgeButton onClick={(e: any) => bridgeHandler(e, amount)}>
            Bridge
          </BridgeButton>
        ) : (
          `You must change your metamask network to "${upperChain}"`
        )}
        <p>{message}</p>
      </FormContainer>
      <FormContainer style={{ display: stepTwo ? "block" : "none" }}>
        <p>Step 2</p>
        {ChainId[bottomChain] === props.library._network.chainId ? (
          <BridgeButton onClick={stepTwoHandler}>Claim Tokens</BridgeButton>
        ) : (
          `You must change your metamask network to "${bottomChain}"`
        )}
      </FormContainer>
    </>
  );
};

export default Form;
