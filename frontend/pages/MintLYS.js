import React, { useState, useContext } from "react";
import Nav from "./components/Nav";
import styles from "../styles/MintLYS.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import abi from "../pages/abi/LYS.json";
import AppContext from "./AppContext";
import axios from "axios";

function MintLYS() {
  const value = useContext(AppContext);
  const { accessToken, currentAccount } = value.state;
  const [id, setId] = useState(0);
  const [uri, setUri] = useState("");
  const [amount, setAmount] = useState(0);

  async function mint() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const accounts = await provider.listAccounts();
    let currentUserAddress = accounts[0];
    currentUserAddress = currentUserAddress.toLowerCase();
    const contractAddress = "0x8c8d06991646A9701266794a385Db4b576E2678D";
    const contractAbi = abi.abi;

    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let minting = await contract.mint(id, amount);

    await contract.setURI(id, uri);
  }

  async function retrieveProjectDetails() {
    const walletAddress = currentAccount;
    const json = { walletAddress };
    axios
      .post("http://localhost:3001/api/data/retrieveDetails", json, {
        headers: accessToken,
      })
      .then((response) => {
        setUri(response.data.metadata_uri);
        setAmount(response.data.lysamount);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function InitiateMint() {
    // fetch metadata_uri and projectId
    await retrieveProjectDetails();

    // initiate mint
    await mint();
  }
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <h3>Enter proposal Id of which you want to mint LYS token:</h3>
        <div>
          <input
            type="number"
            onChange={(e) => {
              setId(parseInt(e.target.value));
            }}
          />
          <button onClick={InitiateMint}>Mint</button>
          <p>Make sure you are the owner of this proposal Id.</p>
        </div>
      </div>
    </>
  );
}

export default MintLYS;
