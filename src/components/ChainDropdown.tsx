import React, { Component, useState } from "react";
import styled from "styled-components";

import {
  ISupportedAsset,
  SUPPORTED_ASSETS,
} from "../constants/supportedAssets";

const StyledUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
`;

const StyledLi = styled.li`
  float: left;
`;

const Dropbtn = styled.div`
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
`;

const DropDownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const DropDownLi = styled(StyledLi as any)`
  display: inline-block;
  &:hover {
    background-color: red;
  }
  &:hover ${DropDownContent} {
    display: block;
  }
`;

const StyledA = styled.a`
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  &:hover {
    background-color: red;
  }
`;

const SubA = styled.a`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  &:hover {
    background-color: #f1f1f1;
  }
`;

export interface IDropdownProps {
  choosen: ISupportedAsset;
  data: ISupportedAsset[];
  setChoosen: React.Dispatch<React.SetStateAction<ISupportedAsset>>;
}

const ChainDropdown = (props: IDropdownProps) => {
  return (
    <StyledUl>
      <DropDownLi>
        <Dropbtn>{props.choosen.name}</Dropbtn>
        <DropDownContent>
          {props.data.map((el) => (
            <SubA key={el.name} onClick={() => props.setChoosen(el)}>
              {el.name}
            </SubA>
          ))}
        </DropDownContent>
      </DropDownLi>
    </StyledUl>
  );
};

export default ChainDropdown;
