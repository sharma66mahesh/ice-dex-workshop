import EXCHANGE_ABI from './exchange.json';

export const EXCHANGE = {
    address: process.env['REACT_APP_EXCHANGE_ADDRESS'],
    abi: EXCHANGE_ABI,
};