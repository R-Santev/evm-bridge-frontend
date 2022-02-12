export interface ISupportedAsset {
  chainId: number;
  name: string;
  bridgeAddress: string;
}

export enum TokenType {
  native = 0,
  wrapped = 1,
}

// Basic representation of a DB data
export const SUPPORTED_ASSETS: ISupportedAsset[] = [
  {
    chainId: 42,
    name: "Kovan",
    bridgeAddress: "0x9b9b77fc46d0cd8bEaF9a0b24a12dc158F439391",
  },
  {
    chainId: 97,
    name: "BSC Testnet",
    bridgeAddress: "0x1664Bd1B81c850313c29091dCb9e026C49F264b6",
  },
];
