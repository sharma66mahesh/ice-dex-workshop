//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

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
    // FROM. HERE...

    function swapIczForToken() public payable {
        // inputICZ = msg.value
        uint256 outputToken = getAmount(msg.value, getIczReserve() - msg.value, getTokenReserve());

        IERC20(tokenAddress).transfer(msg.sender, outputToken);
    }
    
    function swapTokenForIcz(uint256 _tokenAmount) public {
        uint256 outputIcz = getAmount(_tokenAmount, getTokenReserve(), getIczReserve());

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokenAmount);
        payable(msg.sender).transfer(outputIcz);
    }

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public view returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Insufficient liquidity for this trade.");
        return (inputAmount * outputReserve) / (inputReserve + inputAmount);
    }
} 