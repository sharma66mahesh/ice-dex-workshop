import { ethers } from 'ethers';

export default function ({ iczBalance, tokenBalance }) {
    return (
        <div className='card half-width'>
            <h3 className='card-header'>Wallet Balance:</h3>
            <p><b>ICZ: </b> {iczBalance && ethers.utils.formatEther(iczBalance)}</p>
            <p><b>Token: </b> {tokenBalance && ethers.utils.formatEther(tokenBalance)}</p>
        </div>
    );
}