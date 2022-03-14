// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract LYS is ERC1155 {
    string public name;
  string public symbol;
  uint public tokenIds=0;

  mapping(uint => string) public tokenURI;
  mapping(uint=>address) public ownerOfId;

  constructor() ERC1155("") {
    name = "HashItems";
    symbol = "HASHITEMS";
  }

  function mint( uint _amount) external {
      tokenIds++;
      ownerOfId[tokenIds]=msg.sender;
     _mint(msg.sender, tokenIds, _amount, "");
  }


  function setURI(uint _id, string memory _uri) external  {
      require(msg.sender==ownerOfId[_id],"You are not the owner of this token id");
    tokenURI[_id] = _uri;
    emit URI(_uri, _id);
  }

  function uri(uint _id) public override view returns (string memory) {
    return tokenURI[_id];
  }

}
