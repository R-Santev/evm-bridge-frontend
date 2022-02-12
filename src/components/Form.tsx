// import React, { ChangeEvent, useEffect, useState } from "react";
// import styled from "styled-components";
// import { ethers } from "ethers";

// import { SOURCE_CHAIN_ADDRESS, TOKEN_ADDRESS } from "src/constants";
// import { SourceChainBridge, TargetChainBridge, Token } from "src/types";

// const sourceChain = "Ethereum Kovan";
// const targetChain = "BSC Testnet";

// enum ChainId {
//   "Ethereum Kovan" = 42,
//   "BSC Testnet" = 97,
// }

// interface IProps {
//   contract: SourceChainBridge | TargetChainBridge | null;
//   library: any;
//   tokenContract: Token | null;
//   address: string;
// }

// const Form = (props: IProps) => {
//   const [state, setState] = useState(State.bridge);
//   const [upperChain, setUpperChain] = useState("");
//   const [bottomChain, setBottomChain] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");

//   const bridgeTokens = async (e: any, amountt: string, upperChain: string) => {
//     if (!amountt) {
//       setMessageHandler("You must provide tokens amount!");
//       return;
//     }

//     if (!props.tokenContract) {
//       setMessageHandler("Something went wrong!");
//       return;
//     }

//     const parsedAmount = ethers.utils.parseEther(amountt);
//     const approveTx = await props.tokenContract.approve(
//       SOURCE_CHAIN_ADDRESS,
//       parsedAmount
//     );

//     if (!approveTx) {
//       return;
//     }

//     setMessage("Processing approve transaction...");
//     props.library
//       .waitForTransaction(approveTx.hash)
//       .then(async () => {
//         setMessage("");
//         console.log(props.contract);

//         const tx = await (props.contract as SourceChainBridge).lock(
//           ChainId[upperChain],
//           TOKEN_ADDRESS,
//           parsedAmount
//         );

//         props.library
//           .waitForTransaction(tx.hash)
//           .then(async () => {
//             console.log("Success!");
//             localStorage.setItem("stepTwo", "1");
//           })
//           .catch((err: any) => {
//             console.log(err);

//             // setNotification(`Error occurred: ${err.message}`);
//           });
//       })
//       .catch((err: any) => {
//         console.log(err);

//         // setNotification(`Error occurred: ${err.message}`);
//       });
//   };

//   const unBridgeTokens = async () => {
//     console.log("UnBridge!");
//   };

//   const claimTokens = async (e: any, amount: string) => {
//     const tx = await (props.contract).mint(
//       "Test Value",
//       "TEST",
//       18,
//       ethers.utils.parseEther("0.001"),
//       props.address
//     );

//     if (!tx) {
//       return;
//     }

//     props.library
//       .waitForTransaction(tx.hash)
//       .then(async () => {
//         console.log("Success!");
//       })
//       .catch((err: any) => {
//         console.log(err);
//       });
//   };

// };

// export default Form;
