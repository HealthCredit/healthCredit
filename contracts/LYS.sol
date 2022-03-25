// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

interface Impact {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract newLYS2 is ERC1155 {
    address owner;
    uint256 _tokenIds = 1;
    uint256 proposalId = 1;
    Impact impact;

    enum Status {
        pending,
        approoved,
        rejected
    }

    struct ProposalStruct {
        uint256 id;
        string link;
        uint256 LYStokenAmount;
        Status status;
    }
    ProposalStruct[] proposalArray;
    mapping(uint256 => string) public tokenURI;
    mapping(uint256 => address) public ownerOfToken;
    mapping(uint256 => string) public proposalIdtoUri;
    mapping(uint256 => address) public proposorAddress;
    mapping(uint256 => bool) public approove;
    mapping(address => uint256) public proposalMapId;
    event proposalSubmitEvent(
        uint256 indexed id,
        address indexed propsal,
        string indexed proposalUri
    );
    event approovedEvent(
        uint256 indexed id,
        address indexed propsal,
        string indexed proposalUri
    );

    constructor(address _impactContractAddress) ERC1155("") {
        impact = Impact(_impactContractAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    function isProposalApproved(uint id) view external returns(bool){
        return approove[id];
    }
    function getPropsalLink(uint256 _id) external view returns (string memory) {
        return proposalIdtoUri[_id];
    }

    function getProposalAddress(uint256 _id) external view returns (address) {
        return proposorAddress[_id];
    }

    function getAllProposal() external view returns (ProposalStruct[] memory) {
        return proposalArray;
    }
    function changeImpactAddress(address newImpact) external onlyOwner{
        impact = Impact(newImpact);
    }
    function propose(string memory detailUri, uint256 amount) external {
        require(proposalMapId[msg.sender]==0,"Only one proposal can be issued by per address");
        uint256 currentId = proposalId;
        proposalIdtoUri[currentId] = detailUri;
        proposorAddress[currentId] = msg.sender;
        proposalArray.push(
            ProposalStruct({
                id: currentId,
                link: detailUri,
                LYStokenAmount: amount,
                status: Status.pending
            })
        );
        emit proposalSubmitEvent(currentId, msg.sender, detailUri);
        proposalId++;
        proposalMapId[msg.sender] = currentId;
    }

    function getProposalId(address addrr) public view returns (uint256) {
        return proposalMapId[addrr];
    }

    function approoveProposal(uint256 _proposalId, bool success) external {
        require(approove[_proposalId] == false, "proposal already approoved");
        bool hasImpact = isImpactHolder(msg.sender);
        require(hasImpact == true, "you do not have impact token");
        ProposalStruct storage temp = proposalArray[_proposalId - 1];
        require(
            temp.status == Status.pending,
            "Proposal is already checked and considered"
        );
        if (success == true) {
            approove[_proposalId] = true;
            temp.status = Status.approoved;
            emit approovedEvent(_proposalId, msg.sender, temp.link);
        } else {
            approove[_proposalId] = false;
            temp.status = Status.rejected;
        }
    }

    function isImpactHolder(address caller) internal view returns (bool) {
        uint256 balance = impact.balanceOf(caller);
        return balance > 0;
    }

    function mint(uint256 _proposalId, uint256 amount)
        external
        returns (uint256)
    {
        require(
            msg.sender == proposorAddress[_proposalId],
            "You are not the owner of this proposalId"
        );
        require(
            approove[proposalId] == true,
            "This proposal is not approoved by the impact token holders"
        );
        ProposalStruct memory temp = proposalArray[_proposalId - 1];
        require(
            amount <= temp.LYStokenAmount,
            "You cannot mint these many LYS tokes"
        );
        uint256 currentId = _tokenIds;
        _mint(msg.sender, currentId, amount, "");
        ownerOfToken[currentId] = msg.sender;
        _tokenIds++;
        return currentId;
    }

    function setURI(uint256 id, string memory newuri) public {
        require(
            msg.sender == proposorAddress[proposalId],
            "You are not the owner of this proposalId"
        );
        require(
            approove[proposalId] == true,
            "This proposal is not approoved by the impact token holders"
        );
        require(
            msg.sender == ownerOfToken[_tokenIds],
            "You do not contain token of this Id"
        );
        require(bytes(tokenURI[id]).length == 0, "URI already set");
        tokenURI[id] = newuri;
        emit URI(newuri, id);
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return tokenURI[_id];
    }
}
