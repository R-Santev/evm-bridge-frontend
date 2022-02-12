import { Web3Provider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { ISupportedAsset } from "src/constants/supportedAssets";

import { FormContainer, BridgeButton } from "./styledComponents";

import { Bridge, Token } from "src/types";
import { State } from "./FormsWrapper";
import Loader from "../StyledComponents/Loader";
import { ethers } from "ethers";
import { getChainData } from "./../../helpers/utilities";

export interface IClaimFormProps {
  library: Web3Provider;
  contract: Bridge;
  tokenContract: Token | null;
  setState: React.Dispatch<React.SetStateAction<State>>;
  from: ISupportedAsset;
  to: ISupportedAsset;
  amount: string;
  userAddress: string;
  isWrapped: boolean | undefined;
}

const ClaimForm = (props: IClaimFormProps) => {
  const initialMessage = "Now it's time to claim the bridged tokens.";

  const [tokenName, setTokenName] = useState<string | undefined>();
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>();
  const [isWrapped, setIsWrapped] = useState<boolean | undefined>();
  const [tokenNativeAddress, setTokenNativeAddress] = useState<
    string | undefined
  >();
  const [tokenNativeUnlockAddress, setTokenNativeUnlockAddress] = useState<
    string | undefined
  >();

  const [notification, setNotification] = useState<string>(initialMessage);

  useEffect(() => {
    if (!props.tokenContract) {
      return;
    }

    setTokenNativeAddress(props.tokenContract.address);
    props.tokenContract
      .name()
      .then((name) => {
        setTokenName(name);
        return props.tokenContract!.symbol();
      })
      .then((symbol) => {
        setTokenSymbol(symbol);
        return props
          .tokenContract!.owner()
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
      })
      .then((wrapped) => {
        setIsWrapped(wrapped);
        return props.contract.nativeTokens(props.tokenContract!.address);
      })
      .then((unlockToken) => {
        setTokenNativeUnlockAddress(unlockToken);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const notify = async (message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const onClaim = async (_e: any) => {
    if (!props.tokenContract || !props.contract) {
      notify("Something went wrong!");
      return;
    }

    if (props.isWrapped) {
      unlockTokens();
    } else {
      mintTokens();
    }
  };

  const unlockTokens = async () => {
    console.log("here");
    console.log(tokenNativeUnlockAddress);
    console.log(props.amount);
    console.log(props.userAddress);
    console.log(props.contract);

    const tx = await props.contract
      .unlock(
        tokenNativeUnlockAddress!,
        ethers.BigNumber.from(props.amount),
        props.userAddress
      )
      .catch((err) => {
        notify(err.message);
      });
    if (!tx) {
      return;
    }

    setNotification(`Processing transaction (unlock)... Tx Hash: ${tx.hash}`);

    props.library
      .waitForTransaction(tx.hash)
      .then(async () => {
        notify("Success!");
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      })
      .catch((err) => {
        notify(err.message);
      });
  };

  const mintTokens = async () => {
    console.log("here");
    console.log(tokenNativeAddress);
    console.log(props.amount);
    console.log(props.userAddress);
    console.log(props.contract);
    const tx = await props.contract
      .mint(
        tokenName!,
        tokenSymbol!,
        18,
        ethers.BigNumber.from(props.amount).sub("100000000000000"),
        props.userAddress,
        tokenNativeAddress!
      )
      .catch((err) => {
        notify(err.message);
      });
    if (!tx) {
      return;
    }

    setNotification(`Processing transaction (mint)... Tx Hash: ${tx.hash}`);

    props.library
      .waitForTransaction(tx.hash)
      .then(async (data) => {
        console.log(data.logs);
        if (data.logs.length > 1) {
          window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address: data.logs[0].address,
                symbol: "rs" + tokenSymbol!,
                decimals: 18,
              },
            },
          });
        }

        notify("Success!");
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      })
      .catch((err) => {
        notify(err.message);
      });
  };

  if (
    tokenNativeAddress &&
    tokenName &&
    tokenSymbol &&
    isWrapped !== undefined
  ) {
    return (
      <FormContainer>
        {props.to.chainId === props.library._network.chainId ? (
          <BridgeButton onClick={(e: any) => onClaim(e)}>Claim</BridgeButton>
        ) : (
          `You must change your wallet network to "${
            getChainData(props.to.chainId).name
          }"`
        )}
        <p>{notification}</p>
      </FormContainer>
    );
  } else {
    return <Loader />;
  }
};

export default ClaimForm;
