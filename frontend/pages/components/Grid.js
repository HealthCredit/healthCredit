import React, { useContext } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import abi from "../abi/LYS.json";
import Link from "next/link";
import styles from "./Grid.module.css";
import AppContext from "./../AppContext";
import axios from "axios";

function Grid({ obj, hasImpact }) {
  const value = useContext(AppContext);
  const { accessToken } = value.state;

  async function approveProject(projectId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const accounts = await provider.listAccounts();
    let currentUserAddress = accounts[0];
    currentUserAddress = currentUserAddress.toLowerCase();
    const contractAddress = "0xb35BaF35DfD02Ad4fac9430981cEE413698cC242";
    const contractAbi = abi.abi;

    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    let approveProposal = await contract.approoveProposal(projectId, true);

    await approveApi(projectId);
  }

  async function approveApi(projectId) {
    const json = JSON.parse(JSON.stringify({ projectId }));

    await axios.post("http://localhost:3001/api/data/approveProject", json, {
      headers: accessToken,
    });

    // console.log(json);
  }

  // ToDo: Make approve page refresh/refetch data after a project is approved.

  return (
    <div className={styles.container}>
      <div>
        <p> {obj.id} </p>
      </div>
      {
        <div>
          {obj.link.map((item, index) => {
            return (
              <Link key={index} href={item}>
                <a>{index ? ", " : ""}Download</a>
              </Link>
            );
          })}
        </div>
      }
      {hasImpact ? (
        <div>
          <button onClick={() => approveProject(obj.projectId)}>Approve</button>
        </div>
      ) : (
        <div>
          <button disabled>Approve</button>
        </div>
      )}
    </div>
  );
}

export default Grid;
