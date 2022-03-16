import _ from "lodash";
import { useCallback } from "react";

const WAITING_TIME = 0.5;

export async function sleep(time) {
    await new Promise((resolve) => {
        setTimeout(() => resolve(), time*1000);
    })
}

export async function detectMetamask() {
    await sleep(WAITING_TIME);
    if(window.ethereum && window.ethereum.isMetaMask) 
        return true;
    return false;
}

export async function fetchBalance(provider, walletAddress, contract) {
    if(contract) {
        return contract.balanceOf(walletAddress);
    }

    return provider.getBalance(walletAddress);
}

export function useDebounce(callback, delay) {
    const debouncedCallback = useCallback(_.debounce(callback, delay), []);
    return debouncedCallback;
}