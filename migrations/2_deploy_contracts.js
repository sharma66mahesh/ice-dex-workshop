const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
    deployer.deploy(Token, "MyToken", "MT", 1000000).then(() => {
        return deployer.deploy(Exchange, Token.address)
    });
};