import { ethers } from 'ethers';
import { detectMetamask } from 'utils';

export async function getProvider() {
    const walletAvailable = await detectMetamask();
    if(!walletAvailable) {
        throw 'Metamask not detected';
    }
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    return ethersProvider;
}
