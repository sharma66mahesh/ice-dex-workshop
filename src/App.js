import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { SwapForm, AddLiquidityForm } from './components/Forms';
import Balance from './components/Balance';
import ReserveAvailable from './components/ReserveAvailable';

import { getProvider } from 'ethereum/ethers';
import { EXCHANGE }from 'ethereum/contracts/exchange';
import { TOKEN } from 'ethereum/contracts/token';
import { SUPPORTED_TOKENS } from 'constants';
import { fetchBalance } from 'utils';
import { wait } from '@testing-library/user-event/dist/utils';



function App() {

  const [provider, setProvider] = useState('');
  const [tokenContract, setTokenContract] = useState('');
  const [exchangeContract, setExchangeContract] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [ICZbalance, setICZbalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [availableReserveToken, setAvailableReserveToken] = useState(0);
  const [availableReserveICZ, setAvailableReserveICZ] = useState(0);
  const [updateData, setUpdateData] = useState(false);

  useEffect(() => {
    async function x() {
      try {
        const provider = await getProvider();
        setProvider(provider);

        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setWalletAddress(userAddress);

        const exchangeContract = new ethers.Contract(EXCHANGE.address, EXCHANGE.abi, signer);
        const tokenContract = new ethers.Contract(TOKEN.address, TOKEN.abi, signer);
        console.log(exchangeContract);
        console.log(tokenContract);
        setExchangeContract(exchangeContract);
        setTokenContract(tokenContract);

        setAvailableReserveToken(await exchangeContract.getTokenReserve());
        setAvailableReserveICZ(await fetchBalance(provider, exchangeContract.address));

      } catch (err) {
        console.error(err);
        alert(JSON.stringify(err));
      }
    }
    x();
  }, []);

  useEffect(() => {
    console.log("updateDataChanged");
    async function x() {
      if(!exchangeContract || !provider || !walletAddress || !tokenContract){
        return;
      }
      setAvailableReserveToken(await exchangeContract.getTokenReserve());
      setAvailableReserveICZ(await fetchBalance(provider, exchangeContract.address));
      setICZbalance(await fetchBalance(provider, walletAddress));
      setTokenBalance(await fetchBalance(provider, walletAddress, tokenContract));
    }
    x();

  }, [updateData]);

  useEffect(() => {
    async function x() {
      if(provider && walletAddress) {
        setICZbalance(await fetchBalance(provider, walletAddress));
        setTokenBalance(await fetchBalance(provider, walletAddress, tokenContract));
      }
    }
    x();
  }, [exchangeContract, provider, tokenContract, walletAddress]);

  const handleSwap = async (values) => {
    console.log(values);

    if(values.to === values.from) {
      alert("Cannot swap between same tokens");
      return;
    }

    try {
      let tx = null;
      if(values.from === SUPPORTED_TOKENS.MYTOKEN[0] && values.to === SUPPORTED_TOKENS.ICZ[0]) {
        // swap MYTOKEN with ICZ tokens
        const res1 = await tokenContract.approve(exchangeContract.address, ethers.utils.parseEther(values.amount));
        await res1.wait();
        alert(res1.hash);
        tx = await exchangeContract.swapTokenForIcz(ethers.utils.parseEther(values.amount), 0);
        
      } else {
        // swap ICZ tokens with MYTOKEN
        tx = await exchangeContract.swapIczForToken(0, { value: ethers.utils.parseEther(values.amount) });
      }    

      await tx.wait();
      setUpdateData((updateData) => !updateData);
      alert(`Successfully swapped ${values.amount} ${values.from}`);
    } catch (e) {
      alert(JSON.stringify(e));
      console.error(e);
    }
  }

  const handleAddLiquidity = async (values) => {
    console.log(values);
    try {
      const res1 = await tokenContract.approve(exchangeContract.address, ethers.utils.parseEther(values.token));
      await res1.wait();
      alert(res1.hash);
      const res2 = await exchangeContract.addLiquidity(ethers.utils.parseEther(values.token), { value: ethers.utils.parseEther(values.ICZ) });
      await res2.wait();
      alert(res2.hash);

    } catch (err) {
      alert(JSON.stringify(err));
      console.error(err);
    }

    setUpdateData(updateData => !updateData);
  }

  return(
    <>
      <h1 className='card-header'>DEX</h1>
      <div className='grid-container'>
        <div className='grid-item'>
          <Balance iczBalance={ICZbalance} tokenBalance={tokenBalance} />
        </div>
        <div className='grid-item'>
          <ReserveAvailable token={availableReserveToken} icz={availableReserveICZ} />
        </div>
        <div className='grid-item'>
          <SwapForm handleSubmit={handleSwap} exchangeContract={exchangeContract} />
        </div>
        <div className='grid-item'>
          <AddLiquidityForm handleSubmit={handleAddLiquidity} />
        </div>
      </div>
    </>
  );
}

export default App;
