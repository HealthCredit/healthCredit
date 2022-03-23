import styles from "../styles/Proposal.module.css";
import Nav from "./components/Nav";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useState, useContext } from "react";
// import abi from "../pages/abi/LYSabi.json";
import { BigNumber } from "bignumber.js";
import abi from "../pages/abi/LYS.json";
import { Web3Storage } from "web3.storage";
import AppContext from "./AppContext";
import axios from "axios";

function Proposal() {
  const value = useContext(AppContext);
  const { currentAccount, accessToken } = value.state;
  const [userRegistration, setUserRegistration] = useState({
    orgName: "",
    countryName: "",
    description: "",
    LYSamount: 0,
  });
  const [formIsSubmitted, setFormIsSubmitted] = useState(false); //if form is submitted we display "you proposal is submitted"
  const handleInput = (e) => {
    const name = e.target.name;
    const value = name === "LYSamount" ? +e.target.value : e.target.value;
    setUserRegistration({ ...userRegistration, [name]: value });
  };
  const formIsValid = () => {
    if (
      userRegistration.orgName.length !== 0 &&
      userRegistration.countryName.length !== 0 &&
      userRegistration.orgName.description !== 0 &&
      userRegistration.LYSamount > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  // connect to contract
  async function getContract() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const accounts = await provider.listAccounts();
    let currentUserAddress = accounts[0];
    console.log(currentUserAddress);
    currentUserAddress = currentUserAddress.toLowerCase();
    const contractAddress = "0xFcD3C90F4B8F4E07454f4E67579809b718EbeDF7";
    const contractAbi = LYS.abi;

    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    return contract;
    // console.log(contractAddress, contractAbi, signer);
  }

  // <!----------------------------------------------------START FILE UPLOAD LOGIC-------------------------------------------------------->
  // get access token from env
  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }

  // start web3storage instance
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  // get files from user file inputs
  async function getFiles() {
    const fileInput = document.querySelectorAll('input[type="file"]');
    const tempFiles = [];
    const files = [];
    for (let i = 0; i < fileInput.length; i++) {
      tempFiles.push(fileInput[i].files);
    }

    for (let i = 0; i < tempFiles.length; i++) {
      files.push(tempFiles[i][0]);
    }
    files.push(await makeFileObjects());

    return files;
  }

  // create metadata.json
  async function makeFileObjects() {
    const obj = await generateMetadata();
    // * This is actually good, the json file would have the details arranged properly
    const blob = new Blob([JSON.stringify(obj)], {
      type: "application/json",
    });

    const file = new File([blob], "metadata.json");
    return file;
  }

  // upload files to web3storage
  async function storeFiles(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    return cid;
  }

  // get image link to be added to imageUri in metadata.json
  async function getImageLink() {
    const fileInput = document.querySelector('input[type="file"]');

    // upload image
    const client = makeStorageClient();
    const cid = await client.put(fileInput.files);

    const imageUri = `https://${cid}.ipfs.dweb.link/${fileInput.files[0].name}`;

    return imageUri;
  }

  // generate metadata from user inputs
  async function generateMetadata() {
    const imageUri = await getImageLink();

    const metadata = {
      name: userRegistration.orgName,
      description: userRegistration.description,
      image: imageUri,
      attributes: [{ country: userRegistration.countryName }],
    };

    return metadata;
  }

  // submit form, save cid to database and make smart contract calls
  const submitForm = async (e) => {
    e.preventDefault();

    if (!formIsValid) {
      return;
    }
    // Here you write your upload logic or whatever you want

    // save cid to databse
    const cid = await storeFiles(await getFiles());
    const json = JSON.parse(
      JSON.stringify({ cid, walletAddress: currentAccount })
    );
    const cidLink = `https://${cid}.ipfs.dweb.link`;
    axios.post("http://localhost:3001/api/data/updateCid", json, {
      headers: accessToken,
    });

    // make smart contract calls
    console.log(await saveProposalId(await getProposalId(cidLink)));
    // console.log(await getProposalId(cidLink));
  };

  // make proposal and get proposalId
  async function getProposalId(detailUri) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const accounts = await provider.listAccounts();
    let currentUserAddress = accounts[0];
    // console.log(currentUserAddress);
    currentUserAddress = currentUserAddress.toLowerCase();
    const contractAddress = "0xb35BaF35DfD02Ad4fac9430981cEE413698cC242";
    const contractAbi = abi.abi;

    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let proposalId = await contract.propose(
      detailUri,
      userRegistration.LYSamount
    );

    proposalId.wait();

    let getProposalId = await contract.getProposalId();
    let projectId = Number(getProposalId._hex);

    const result = { projectId, currentUserAddress };
    return result;
  }

  // save proposal/projectId to database
  async function saveProposalId(result) {
    const { projectId, currentUserAddress } = result;
    const json = JSON.parse(
      JSON.stringify({
        walletAddress: currentUserAddress,
        projectId: projectId,
      })
    );

    await axios.post("http://localhost:3001/api/data/saveProjectId", json, {
      headers: accessToken,
    });
  }
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div>
          <h1>Submit proposal for approval</h1>
        </div>
        {!formIsSubmitted && (
          <form action="" className={styles.form} onSubmit={submitForm}>
            <div className={styles.formBox}>
              <div className={styles.box}>
                <input
                  type="text"
                  placeholder="Enter name of org"
                  value={userRegistration.orgName}
                  onChange={handleInput}
                  name="orgName"
                />
              </div>
              <div className={styles.box}>
                <input
                  type="text"
                  placeholder="Enter name of country"
                  value={userRegistration.countryName}
                  onChange={handleInput}
                  name="countryName"
                />
              </div>
              <div className={styles.box}>
                <input
                  type="text"
                  placeholder="Short description"
                  value={userRegistration.description}
                  onChange={handleInput}
                  name="description"
                />
              </div>
              <div className={styles.box}>
                <input
                  type="number"
                  placeholder="Number of LYS token"
                  value={userRegistration.LYSamount}
                  onChange={handleInput}
                  name="LYSamount"
                />
              </div>
              <div className={styles.upload}>
                <span>Image</span>
                <input type="file" name="img" />
              </div>
              <div className={styles.upload}>
                <span>beneficieries list</span>
                <input type="file" name="file" />
              </div>
              <div className={styles.upload}>
                <span>Impact record</span>
                <input type="file" name="file" />
              </div>
              <div className={styles.submitBtn}>
                <button type="submit">Submit</button>
              </div>
            </div>
          </form>
        )}
        {formIsSubmitted && (
          <div className={styles.afterProposal}>
            <h2>
              Your proposal is submitted{" "}
              <span className={styles.check}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z" />
                </svg>
              </span>
            </h2>
            <h3>Your proposal Id is :- </h3>
          </div>
        )}
      </div>
    </>
  );
}

export default Proposal;
