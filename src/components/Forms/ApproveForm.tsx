import React, { useState } from "react";

import {
  FormContainer,
  ChainContainer,
  Input,
  BridgeButton,
} from "./styledComponents";

const ApproveForm = (props: any) => {
  return (
    <FormContainer>
      <ChainContainer>
        <p>FROM: </p>
        <Dropdown />

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
        <BridgeButton
          onClick={(e: any) => bridgeHandler(e, amount, upperChain)}
        >
          Bridge
        </BridgeButton>
      ) : (
        `You must change your metamask network to "${upperChain}"`
      )}
      <p>{message}</p>
    </FormContainer>
  );
};

export default ApproveForm;
