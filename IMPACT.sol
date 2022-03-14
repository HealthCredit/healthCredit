// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IMPACT is ERC20 {
    address owner;
    uint MAX_SUPPLY=1000000;

    constructor() ERC20("IMPACT", "IMT") {
        owner=msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender==owner,"You are not the owner");
        _;
    }

    function mintIMPACT() external onlyOwner{
        _mint(msg.sender,MAX_SUPPLY);
    }
    
    function transferIMPACT(address to,uint amount) external returns(bool) {
        bool isTransferred=transfer(to,amount);
        return isTransferred;
    }
}
