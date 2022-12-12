require("@nomiclabs/hardhat-waffle");

const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
  solidity: "0.8.6",
  networks: {
    testnet: {
      url: `https://temp-ice.ibriz.ai:9934`,
      accounts: [`0x${privateKey}`]
    },
    arctic: {
      url: `https://arctic-rpc.icenetwork.io:9933`,
      accounts: [`0x${privateKey}`]
    }
  }
};