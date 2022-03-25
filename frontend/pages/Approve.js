import React, { useState, useContext, useEffect } from "react";
import Grid from "./components/Grid";
import styles from "../styles/Approove.module.css";
import Nav from "./components/Nav";
import abi from "./abi/IMPACTabi.json";
import { ethers } from "ethers";
import AppContext from "./AppContext";
import axios from "axios";

function Approve() {
  const value = useContext(AppContext);
  const { userHasImpact, projects, accessToken } = value.state;

  let ay = [];

  projects.map((project) => {
    for (const i in project) {
      ay.push({
        id: i,
        link: project[i].slice(0, -2),
        status: project[i].slice(-2)[0],
        projectId: project[i].slice(-1)[0],
      });
    }
  });

  // value.setProjectList(ay);
  console.log(ay);
  const renderProposalForImpactHolder = () => {
    return ay.map((element, index) => {
      return <Grid key={index} obj={element} hasImpact={true} />;
    });
  };
  const renderProposalForNonImpactHolder = () => {
    return ay.map((element, index) => {
      return <Grid key={index} obj={element} hasImpact={false} />;
    });
  };

  const verifyImpact = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    let currentUserAddress = accounts[0];
    console.log(currentUserAddress);
    currentUserAddress = currentUserAddress.toLowerCase();
    console.log(currentUserAddress);
    const contractAddress = "0x27717A752D65F1f05fcad8e64794b0bc5C8Bf96d";
    const contractAbi = abi.abi;

    const signer = provider.getSigner();
    const contract = await new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    let tx = await contract.balanceOf(currentUserAddress);
    if (tx > 0) {
      value.setUerHasImpact(true);
      console.log("User has impact");
    } else {
      value.setUerHasImpact(false);
      console.log("User not have impacts");
    }
  };

  useEffect(() => {
    async function fetchApi() {
      await axios
        .get("http://localhost:3001/api/data/fetchProjects", {
          headers: accessToken,
        })
        .then((response) => {
          value.setProjects(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    fetchApi();
    verifyImpact();
  }, []);

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <h1>Projects pending for approvals</h1>
        {userHasImpact && (
          <div className={styles.table}>{renderProposalForImpactHolder()}</div>
        )}
        {!userHasImpact && (
          <div className={styles.table}>
            {renderProposalForNonImpactHolder()}
          </div>
        )}
      </div>
    </>
  );
}

export default Approve;
