//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange {
    address public tokenAddress;

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid Token Address provided");
        tokenAddress = _tokenAddress;
    }

    function addLiquidity(uint256 _tokenAmount) public payable {
        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(msg.sender) >= _tokenAmount, "The sender doesn't have enough balance");
        token.transferFrom(msg.sender, address(this), _tokenAmount);
    }

    function getReserve() public view returns (uint256 _contractTokenBalance) {
        IERC20 token = IERC20(tokenAddress);
        return(token.balanceOf(address(this)));
    }

    function getTokenAmount(uint256 _iczAmount) public view returns (uint256) {
        require(_iczAmount > 0, "ICZ amount to swap cannot be zero");
        uint256 tokenReserve = getReserve();
        uint256 iczReserve = address(this).balance;
        return getAmount(_iczAmount, iczReserve, tokenReserve);
    }

    function getIczAmount(uint256 _tokenAmount) public view returns (uint256) {
        require(_tokenAmount > 0, "Token Amount to swap cannot be zero");
        uint256 tokenReserve = getReserve();
        uint256 iczReserve = address(this).balance;
        return getAmount(_tokenAmount, tokenReserve, iczReserve);
    }

    function swapIczForToken(uint256 _minTokensToObtain) public payable {
        uint256 tokenReserve = getReserve();
        uint256 iczReserve = address(this).balance;
        uint256 tokensObtained = getAmount(msg.value, iczReserve - msg.value, tokenReserve);

        require(tokensObtained >= _minTokensToObtain, "Tokens Obtained is less than user's limit");
        IERC20(tokenAddress).transfer(msg.sender, tokensObtained);
    }

    
    function swapTokensForIcz(uint256 _tokenAmountToSell, uint256 _minEthToObtain) public {
        uint256 tokenReserve = getReserve();
        uint256 iczReserve = address(this).balance;
        uint256 ethObtained = getAmount(
            _tokenAmountToSell,
            tokenReserve,
            iczReserve
        );

        require(ethObtained >= _minEthToObtain, "ICZ Obtained is less than user's limit");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokenAmountToSell);
        payable(msg.sender).transfer(ethObtained);
    }

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        return (inputAmount * outputReserve) / (inputReserve + inputAmount);
    }

}