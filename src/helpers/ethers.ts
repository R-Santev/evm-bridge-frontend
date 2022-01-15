import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

export function getContract<C, T extends IHardhatFactory<C>>(
  factory: T,
  address: string,
  library: any,
  account: any
): C {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return factory.connect(address, getProviderOrSigner(library, account));
}

export default {
  getContract,
};

interface IHardhatFactory<T> {
  connect: (address: string, signerOrProvider: Signer | Provider) => T;
}

function isAddress(value: string) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

function getSigner(library: any, account: any) {
  return library.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(library: any, account: any) {
  return account ? getSigner(library, account) : library;
}
