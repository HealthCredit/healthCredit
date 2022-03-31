// import { ethers } from "ethers";
const { ethers } = require("ethers");
// import Web3Modal from "web3modal";
// import { useState, useContext } from "react";
// import abi from "../pages/abi/LYS.json";
const abi = require("../../pages/abi/LYS.json");
// import AppContext from "./AppContext";

async function getProposal() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.listAccounts();
  let currentUserAddress = accounts[0];
  console.log(currentUserAddress);
  currentUserAddress = currentUserAddress.toLowerCase();
  console.log(currentUserAddress);
  const contractAddress = "0x8c8d06991646A9701266794a385Db4b576E2678D";
  const contractAbi = abi.abi;

  const signer = provider.getSigner();
  const contract = await new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  const getId = await contract.getProposalId(
    "0x6B9b6787677b9E12f638937240F4367eb8B9a60F"
  );

  console.log(getId);
}

getProposal();
