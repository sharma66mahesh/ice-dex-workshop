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

        require(token.balanceOf(msg.sender) >= _tokenAmount, "Sender Token Balance is Insufficient");
        token.transferFrom(msg.sender, address(this), _tokenAmount);
    }

    function getTokenReserve() public view returns (uint256 _contractTokenBalance) {
        IERC20 token = IERC20(tokenAddress);

        return(token.balanceOf(address(this)));
    }

    function getIczReserve() public view returns (uint256 _contractTokenBalance) {
        return address(this).balance;
    }

    function getTokenAmount(uint256 _iczAmount) public view returns (uint256) {
        require(_iczAmount > 0, "ICZ amount to swap cannot be zero");
        uint256 outputTokenAmount =  getAmount(_iczAmount, getIczReserve() - _iczAmount, getTokenReserve());
        return outputTokenAmount;
    }

    function getIczAmount(uint256 _tokenAmount) public view returns (uint256) {
        require(_tokenAmount > 0, "Token Amount to swap cannot be zero");
        uint256 outputIczAmount = getAmount(_tokenAmount, getTokenReserve(), getIczReserve());
        return outputIczAmount;
    }

    function swapIczForToken(uint256 _minTokensToObtain) public payable {
        uint256 tokensObtained = getTokenAmount(msg.value);

        require(tokensObtained >= _minTokensToObtain, "Tokens Obtained is less than user's limit");
        IERC20(tokenAddress).transfer(msg.sender, tokensObtained);
    }
    
    function swapTokenForIcz(uint256 _tokenAmount, uint256 _minIczToObtain) public {
        uint256 iczObtained = getIczAmount(_tokenAmount);

        require(iczObtained >= _minIczToObtain, "ICZ Obtained is less than user's limit");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokenAmount);
        payable(msg.sender).transfer(iczObtained);
    }

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Insufficient liquidity for this trade.");
        return (inputAmount * outputReserve) / (inputReserve + inputAmount);
    }

}
