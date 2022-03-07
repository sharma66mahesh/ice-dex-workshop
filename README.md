
# Contract Deployment
- Create a `.secret` file in the root directory and enter your wallet mnemonic. This wallet will be used for deployment and contract interactions with truffle.
- Currently only deployemnt in localhost:8545 is supported. That can be modified from `truffle.config.js` file.
- Compiling contracts inside `contracts` dir:  
```$ truffle compile```
- Deploying contracts to local blockchain:  
```$ truffle deploy```

# Running the frontend
- Enter the deployed token contract addresses in `.env` file.
- Tested with node version *v16.14.0*  
```$ npm install```  
```$ npm start```  
