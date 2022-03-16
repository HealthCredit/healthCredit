// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
interface Impact{
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract LYS is ERC1155 {
    address owner;
    uint _tokenIds=1;
    uint proposalId=1;
    Impact impact;

    mapping(uint=>string) public tokenURI;
    mapping(uint=>address) public ownerOfToken;
    mapping(uint=>string) public proposalIdtoUri;
    mapping(uint=>address) public proposorAddress;
    mapping(uint=>bool) public approove;
    event proposalSubmitEvent(uint indexed id,address indexed propsal,string indexed proposalUri);
    event approovedEvent(uint indexed id,address indexed propsal,string indexed proposalUri);

    constructor(address _impactContractAddress) ERC1155("") {
        impact=Impact(_impactContractAddress);
        owner=msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender==owner,"You are not the owner");
        _;
    }
    function getPropsalLink(uint _id) external view returns(string memory){
        return proposalIdtoUri[_id];
    }
    function getProposalAddress(uint _id) external view returns(address){
        return proposorAddress[_id];
    }
    function propose(string memory detailUri) external returns(uint){
        uint currentId=proposalId;
        proposalIdtoUri[currentId]=detailUri;
        proposorAddress[currentId]=msg.sender;
        emit proposalSubmitEvent(currentId, msg.sender, detailUri);
        proposalId++;
        return currentId;
    }
    function approoveProposal(uint _proposalId) external{
        require(approove[_proposalId]==false,"proposal already approoved");
        bool hasImpact=isImpactHolder(msg.sender);
        require(hasImpact==true,"you do not have impact token");
        string memory _detailUri=proposalIdtoUri[_proposalId];
        approove[_proposalId]=true;
        emit approovedEvent(_proposalId,msg.sender,_detailUri);
    }
    function isImpactHolder(address caller) internal view returns (bool){
        uint balance=impact.balanceOf(caller);
        return balance>0;
    }
    function mint(uint _proposalId,uint amount) external returns(uint){
        require(msg.sender==proposorAddress[_proposalId],"You are not the owner of this proposalId");
        require(approove[proposalId]==true,"This proposal is not approoved by the impact token holders");
         uint currentId=_tokenIds;
        _mint(msg.sender,currentId,amount,"");
        ownerOfToken[currentId]=msg.sender;
        _tokenIds++;
        return currentId;
    }
    function setURI(uint id,string memory newuri) public  {
        require(msg.sender==proposorAddress[proposalId],"You are not the owner of this proposalId");
        require(approove[proposalId]==true,"This proposal is not approoved by the impact token holders");
        require(msg.sender==ownerOfToken[_tokenIds],"You do not contain token of this Id");
        require(bytes(tokenURI[id]).length==0,"URI already set");
        tokenURI[id]=newuri;
        emit URI(newuri,id);
    }
    function uri(uint _id) public view override returns(string memory){
        return tokenURI[_id];
    }
}
