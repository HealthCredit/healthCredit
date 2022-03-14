// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract LYS is ERC1155 {
   address owner;
    uint _tokenIds=0;

    mapping(uint=>string) private tokenURI;
    mapping(uint=>address) private ownerOfToken;

    constructor() ERC1155("") {
        owner=msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender==owner,"You are not the owner");
        _;
    }

    function mintLYS(uint amount) external returns(uint){
        _tokenIds++;
        _mint(msg.sender,_tokenIds,amount,"");
        ownerOfToken[_tokenIds]=msg.sender;
        return _tokenIds;
    }
    function setURI(uint id,string memory newuri) public  {
        require(msg.sender==ownerOfToken[_tokenIds],"You do not contain token of this Id");
        require(bytes(tokenURI[id]).length==0,"URI already set");
        tokenURI[id]=newuri;
        emit URI(newuri,id);
    }
    function uri(uint _id) public view override returns(string memory){
        return tokenURI[_id];
    }
}
