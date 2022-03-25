import React, { useState } from "react";
import Nav from "./components/Nav";
import styles from "../styles/BuyLYS.module.css";
import { ethers } from "ethers";
import abi from "./abi/LYS.json";

function BuyLYS() {
  const [id, setId] = useState(0);
  const [LYSexist, setLYSexist] = useState(0);

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    let currentUserAddress = accounts[0];
    // console.log(currentUserAddress);
    currentUserAddress = currentUserAddress.toLowerCase();
    // console.log(currentUserAddress);
    const contractAddress = "0x172ADbE5C4F0a2430A97D8C11a0AC1ee840B535b";
    const contractAbi = abi.abi;

    const signer = provider.getSigner();
    const contract = await new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    // console.log(contract);
    return contract;
  };
  const checkLYSexist = async () => {
    const contract = await getContract();
    console.log(contract);
    const uri = await contract.uri(id);
    if (uri.length === 0) {
      console.log("LYS of this token id does not exist");
      setLYSexist(1);
    } else {
      console.log("LYS of this token id exist");
      setLYSexist(2);
    }
  };

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <h3>Enter Id of LYS token you want to buy</h3>
        <div>
          <input
            type="number"
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <button onClick={checkLYSexist}>Check availibility</button>
        </div>
        {LYSexist === 2 && (
          <>
            <button>
              <a
                href={`https://testnets.opensea.io/assets/0xb35BaF35DfD02Ad4fac9430981cEE413698cC242/${id}`}
              >
                Buy
              </a>
            </button>
            <h4>LYS of this Id is available</h4>
          </>
        )}
        {LYSexist === 1 && <h4>LYS of this Id does not exist</h4>}
      </div>
    </>
  );
}

export default BuyLYS;
