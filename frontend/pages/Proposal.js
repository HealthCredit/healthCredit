import styles from "../styles/Proposal.module.css";
import Nav from "./components/Nav";
import { useState } from "react";
import abi from "../pages/abi/LYSabi.json";

function Proposal() {
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

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    let currentUserAddress = accounts[0];
    console.log(currentUserAddress);
    currentUserAddress = currentUserAddress.toLowerCase();
    console.log(currentUserAddress);
    const contractAddress = "0xFcD3C90F4B8F4E07454f4E67579809b718EbeDF7";
    const contractAbi = abi.abi;

    const signer = provider.getSigner();
    const contract = await new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    return contract;
  };
  const submitForm = (e) => {
    e.preventDefault();


    if (!formIsValid) {
      return;
    }
    //Here you write your upload logic or whatever you want
  };
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
