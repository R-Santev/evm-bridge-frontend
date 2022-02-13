import styled from "styled-components";

import Button from "../StyledComponents/Button";

export const FormContainer = styled.div`
  height: 600px;
  min-height: 400px;
  width: 500px
  margin: 15px
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
  border: 1px solid rgb(74 154 246);
`;

export const ChainContainer = styled.div`
  display: flex;
  flex-basis: 50%;
  width: 95%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid blue;
  margin: 15px;
  padding: 8px;
`;

export const Input = styled.input`
  margin-top: 8px;
  border-radius: 4px;
`;

export const BridgeButton = styled(Button)`
  background-color: purple;
  margin-bottom: 15px;
`;

export const ErrorMessage = styled.p`
  color: red;
  padding: 1px;
  margin: 1px;
`;
