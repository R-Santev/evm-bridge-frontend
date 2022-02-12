export interface ISupportedAsset {
  chainId: number;
  name: string;
  bridgeAddress: string;
  // tokens: IToken[];
}

// export interface IToken {
//   address: string;
//   name: string;
//   type: TokenType;
//   supportedChains: number[];
// }

export enum TokenType {
  native = 0,
  wrapped = 1,
}

// Basic representation of a DB data
export const SUPPORTED_ASSETS: ISupportedAsset[] = [
  {
    chainId: 42,
    name: "Kovan",
    bridgeAddress: "0xb93192346B2284C594CdC1ee80C4cC6054a01626",
    // tokens: [
    //   {
    //     address: "0xC6Ac68936938441bB941F94C94DFF033F299040D",
    //     name: "TEST",
    //     type: TokenType.native,
    //     supportedChains: [56],
    //   },
    //   {
    //     address: "",
    //     name: "rsGOLD",
    //     type: TokenType.wrapped,
    //     supportedChains: [56],
    //   },
    // ],
  },
  {
    chainId: 97,
    name: "BSC Testnet",
    bridgeAddress: "0xD0b015f74CAE67465adc20EcE3dDd0993A523b2f",
    // tokens: [
    //   {
    //     address: "0x847ae30A7acE639814a241D53087d74786175C06",
    //     name: "rsTEST",
    //     type: TokenType.wrapped,
    //     supportedChains: [56],
    //   },
    //   {
    //     address: "",
    //     name: "GOLD",
    //     type: TokenType.native,
    //     supportedChains: [56],
    //   },
    // ],
  },
  {
    chainId: 4,
    name: "Rinkeby",
    bridgeAddress: "",
    // tokens: [
    //   {
    //     address: "",
    //     name: "rsTEST",
    //     type: TokenType.wrapped,
    //     supportedChains: [56],
    //   },
    //   {
    //     address: "",
    //     name: "rsGOLD",
    //     type: TokenType.wrapped,
    //     supportedChains: [56],
    //   },
    // ],
  },
];
