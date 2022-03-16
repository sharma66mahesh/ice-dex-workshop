import TOKEN_ABI from './token.json';

export const TOKEN = {
    address: process.env['REACT_APP_TOKEN_ADDRESS'],
    abi: TOKEN_ABI,
};