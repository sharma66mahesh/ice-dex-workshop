import { ethers } from 'ethers';

export default function({ token, icz }) {
    return (
        <div className='card half-width'>
            <h3 className='card-header'>Reserve in Exchange Contract: </h3> 
            <p><b>ICZ: </b><span>{icz && ethers.utils.formatEther(icz)}</span></p>
            <p><b>Token: </b><span>{token && ethers.utils.formatEther(token)}</span></p>
        </div>
    );
}