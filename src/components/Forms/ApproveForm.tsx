import { Web3Provider } from "@ethersproject/providers";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ERC_20_ABI } from "src/constants/abis";
import {
  ISupportedAsset,
  SUPPORTED_ASSETS,
} from "src/constants/supportedAssets";
import ChainDropdown from "../ChainDropdown";
import Button from "../StyledComponents/Button";
import ethersHelper from "./../../helpers/ethers";
import { getChainData } from "./../../helpers/utilities";

import {
  FormContainer,
  ChainContainer,
  Input,
  BridgeButton,
  ErrorMessage,
} from "./styledComponents";

import { Bridge, Token } from "src/types";
import { State } from "./FormsWrapper";

export interface IApproveFormProps {
  library: Web3Provider;
  contract: Bridge;
  tokenContract: Token | null;
  setState: React.Dispatch<React.SetStateAction<State>>;
  from: ISupportedAsset;
  to: ISupportedAsset;
  token: string | undefined;
  setFrom: React.Dispatch<React.SetStateAction<ISupportedAsset>>;
  setTo: React.Dispatch<React.SetStateAction<ISupportedAsset>>;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  userAddress: string;
}

const ApproveForm = (props: IApproveFormProps) => {
  const initialMessage =
    "Give permissions to the contract to bridge your tokens.";

  const [toChains, setToChains] = useState<ISupportedAsset[]>([]);
  const [notification, setNotification] = useState<string>(initialMessage);

  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [isValidAmount, setIsValidAmount] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);

  useEffect(() => {
    const targetChains = SUPPORTED_ASSETS.filter(
      (el) => el.chainId !== props.from.chainId
    );
    setToChains(targetChains);

    if (!targetChains.includes(props.to)) {
      props.setTo(targetChains[0]);
    }
  }, [props.from]);

  const onApprove = async (_e: any) => {
    if (!isValidAddress || !isValidAmount) {
      notify("Invalid input!");
      return;
    }

    if (!props.contract) {
      notify("Something went wrong!");
      return;
    }

    if (!props.tokenContract) {
      notify("Something went wrong!");
      return;
    }

    const approveTx = await props.tokenContract
      .approve(props.contract.address, ethers.BigNumber.from(props.amount))
      .catch((err) => {
        notify(err.message);
      });
    if (!approveTx) {
      return;
    }
    setNotification(
      `Processing approve transaction... Tx Hash: ${approveTx.hash}`
    );

    props.library
      .waitForTransaction(approveTx.hash)
      .then(async () => {
        notify("Success!");
        setTimeout(() => {
          props.setState(State.bridge);
        }, 4000);
      })
      .catch((err) => {
        notify(err.message);
      });
  };

  const switchAssets = () => {
    props.setTo(props.from);
    props.setFrom(props.to);
  };

  const notify = async (message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const handleAmount = (
    e: ChangeEvent<HTMLInputElement>,
    balance: string | null
  ) => {
    if (balance === null) {
      setAmountError("You must provide a token address first!");
      setIsValidAmount(false);
      return;
    }

    if (isNaN(e.target.valueAsNumber)) {
      setAmountError("You must provide a valid number!");
      setIsValidAmount(false);
      return;
    }

    if (e.target.valueAsNumber > Number(ethers.utils.formatEther(balance))) {
      setAmountError("Insufficient balance!");
      setIsValidAmount(false);
      return;
    }

    props.setAmount(ethers.utils.parseEther(e.target.value).toString());
    setAmountError(null);
    setIsValidAmount(true);
  };

  const handleAddress = async (e: ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    if (!address) {
      setIsValidAddress(false);
      setAddressError(null);
      setTokenBalance(null);
      props.setToken(undefined);
      return;
    }

    if (props.from.chainId !== props.library._network.chainId) {
      setIsValidAddress(false);
      setAddressError(
        `You must change your wallet network to "${
          getChainData(props.from.chainId).name
        }"`
      );
      setTokenBalance(null);
      props.setToken(undefined);
      return;
    }

    if (!ethersHelper.isAddress(address)) {
      setIsValidAddress(false);
      setAddressError(`Invalid Address`);
      setTokenBalance(null);
      props.setToken(undefined);
      return;
    }

    const isValid = await isERC20(address, props.library, props.userAddress);
    if (!isValid) {
      setIsValidAddress(false);
      setAddressError(`You must provide an ERC-20 token!`);
      setTokenBalance(null);
      props.setToken(undefined);
      return;
    }

    const token = getERC20(address, props.library, props.userAddress);
    const tokenSymbol = await token.symbol().catch((err: any) => {
      return "";
    });
    setTokenSymbol(tokenSymbol);

    const userBalance = await token
      .balanceOf(props.userAddress)
      .then((balance: any) => {
        return balance.toString();
      })
      .catch((err: any) => {
        return "0";
      });

    setIsValidAddress(true);
    setAddressError(null);
    setTokenBalance(userBalance);
    props.setToken(address);
  };

  const isERC20 = async (
    address: string,
    library: any,
    userAddress: string
  ) => {
    const token = getERC20(address, library, userAddress);
    return token
      .totalSupply()
      .then((supply: any) => {
        console.log(supply);

        return isNotWrongType(token);
      })
      .catch((err: any) => {
        console.log(err);
        return false;
      });
  };

  const getERC20 = (address: string, library: any, userAddress: string) => {
    return ethersHelper.getVanillaContract(
      address,
      ERC_20_ABI,
      library,
      userAddress
    );
  };

  const isNotWrongType = async (contract: any) => {
    const is721 = await contract
      .supportsInterface("0x80ac58cd")
      .catch((err: any) => {
        return false;
      });
    if (is721) {
      return false;
    }

    const is1155 = await contract
      .supportsInterface("0xd9b67a26")
      .catch((err: any) => {
        return false;
      });
    if (is1155) {
      return false;
    }
    return true;
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
          type="text"
          placeholder="Token Address"
          onChange={(e) => handleAddress(e)}
        />
        {addressError ? <ErrorMessage>{addressError}</ErrorMessage> : ""}
        {tokenBalance ? (
          <p>
            Your Balance: {ethers.utils.formatEther(tokenBalance)} {tokenSymbol}
          </p>
        ) : (
          ""
        )}
        <Input
          type="number"
          placeholder="Amount"
          onChange={(e) => handleAmount(e, tokenBalance)}
        />
        {amountError ? <ErrorMessage>{amountError}</ErrorMessage> : ""}
      </ChainContainer>
      <Button onClick={switchAssets}>Switch</Button>
      <ChainContainer>
        <p>TO: </p>
        <ChainDropdown
          choosen={props.to}
          data={toChains}
          setChoosen={props.setTo}
        />
      </ChainContainer>
      {props.from.chainId === props.library._network.chainId ? (
        <BridgeButton onClick={(e: any) => onApprove(e)}>Approve</BridgeButton>
      ) : (
        `You must change your wallet network to "${
          getChainData(props.from.chainId).name
        }"`
      )}
      <p>{notification}</p>
    </FormContainer>
  );
};

export default ApproveForm;
