import * as React from "react";
import { useEffect, useState } from "react";

import styled from "styled-components";

import Web3Modal from "web3modal";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
import Column from "./components/StyledComponents/Column";
import Wrapper from "./components/StyledComponents/Wrapper";
import Header from "./components/Header";
import Loader from "./components/StyledComponents/Loader";
import ConnectButton from "./components/StyledComponents/ConnectButton";

import { Web3Provider } from "@ethersproject/providers";
import { getChainData } from "./helpers/utilities";
// import Form from "./components/Form";

import ethersHelper from "./helpers/ethers";
import { BRIDGE_ADDRESS, TOKEN_ADDRESS } from "./constants";
import { BRIDGE_ABI, TOKEN_ABI } from "./constants/abis";
import { Bridge, Bridge__factory, Token, Token__factory } from "./types";

import Dropdown from "./components/ChainDropdown";
import FormsWrapper from "./components/Forms/FormsWrapper";
import { SUPPORTED_ASSETS } from "./constants/supportedAssets";

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SLanding = styled(Column)`
  height: 600px;
  flex-direction: row;
`;

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  & h3 {
    padding-top: 30px;
  }
`;

let web3Modal: Web3Modal;
const App = () => {
  const [provider, setProvider] = useState<any>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [library, setLibrary] = useState<any>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(1);
  const [pendingRequest, setPedningRequest] = useState<boolean>(false);
  const [result, setResult] = useState<any>();
  const [contract, setContract] = useState<Bridge | null>(null);
  const [tokenContract, setTokenContract] = useState<Token | null>(null);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    createWeb3Modal();

    if (web3Modal.cachedProvider) {
      onConnect();
    }
  }, []);

  useEffect(() => {
    if (!library) {
      return;
    }

    const bridgeAddress = SUPPORTED_ASSETS.find(
      (chain) => chain.chainId === chainId
    )?.bridgeAddress;
    if (!bridgeAddress) {
      return;
    }

    const contract = ethersHelper.getContract<Bridge, typeof Bridge__factory>(
      Bridge__factory,
      bridgeAddress,
      library,
      address
    );
    setContract(contract);
  }, [library, address, chainId]);

  function createWeb3Modal() {
    web3Modal = new Web3Modal({
      network: getNetwork(),
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    });
  }

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    setProvider(provider);

    const library = new Web3Provider(provider);

    const network = await library.getNetwork();

    const address = provider.selectedAddress
      ? provider.selectedAddress
      : provider?.accounts[0];
    setLibrary(library);
    setChainId(network.chainId);
    setAddress(address);
    setConnected(true);

    await subscribeToProviderEvents(provider);
  };

  const subscribeToProviderEvents = async (provider: any) => {
    if (!provider.on) {
      return;
    }

    provider.on("accountsChanged", changedAccount);
    provider.on("networkChanged", chainChanged);
    provider.on("close", resetApp);

    await web3Modal.off("accountsChanged");
  };

  const unSubscribe = async (provider: any) => {
    if (!provider || !provider.removeListener) {
      return;
    }

    provider.removeListener("accountsChanged", changedAccount);
    provider.removeListener("chainChanged", chainChanged);
    provider.removeListener("close", resetApp);
  };

  const changedAccount = async (accounts: string[]) => {
    if (!accounts.length) {
      // Metamask Lock fire an empty accounts array
      await resetApp();
    } else {
      setAddress(accounts[0]);
    }
  };

  function chainChanged(_chainId: number) {
    onConnect();
  }

  function getNetwork() {
    return getChainData(chainId).network;
  }

  function getProviderOptions() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    };
    return providerOptions;
  }

  const resetApp = async () => {
    await web3Modal.clearCachedProvider();
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
    localStorage.removeItem("walletconnect");
    await unSubscribe(provider);
  };

  const resetState = () => {
    setFetching(false);
    setAddress("");
    setLibrary(null);
    setConnected(false);
    setChainId(1);
    setPedningRequest(false);
    setResult(null);
    setContract(null);
    setInfo(null);
  };

  return (
    <SLayout>
      <Column maxWidth={1000} spanHeight>
        <Header
          connected={connected}
          address={address}
          chainId={chainId}
          killSession={resetApp}
        />
        <SContent>
          <p>
            Bridge "TEST" tokens between the Kovan and the BSC Testnet networks
          </p>
          {fetching ? (
            <Column center>
              <SContainer>
                <Loader />
              </SContainer>
            </Column>
          ) : (
            <SLanding center>
              {!connected ? (
                <ConnectButton onClick={onConnect} />
              ) : (
                <FormsWrapper
                  library={library}
                  contract={contract}
                  userAddress={address}
                />
                // <Form
                //   contract={contract}
                //   tokenContract={tokenContract}
                //   address={address}
                // />
              )}
            </SLanding>
          )}
        </SContent>
      </Column>
    </SLayout>
  );
};
export default App;
