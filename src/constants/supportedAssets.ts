export interface ISupportedAsset {
  chainId: number;
  name: string;
  tokens: IToken[];
}

export interface IToken {
  address: string;
  name: string;
  wrapped: {
    name: string;
    supportedChains: string[];
  };
}

// Basic representation of a DB data
export const SUPPORTED_ASSETS: ISupportedAsset[] = [
  {
    chainId: 42,
    name: "Kovan",
    tokens: [
      {
        address: "0xC6Ac68936938441bB941F94C94DFF033F299040D",
        name: "TEST",
        wrapped: {
          name: "rsTEST",
          supportedChains: ["56"],
        },
      },
    ],
  },
  {
    chainId: 56,
    name: "BSC Testnet",
    tokens: [
      {
        address: "0x847ae30A7acE639814a241D53087d74786175C06",
        name: "TEST",
        wrapped: {
          name: "rsTEST",
          supportedChains: ["56"],
        },
      },
    ],
  },
];
