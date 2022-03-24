import styles from "./Nav.module.css";
import Link from "next/link";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useContext } from "react";
import axios from "axios";
import AppContext from "./../AppContext";

const Nav = () => {
  const value = useContext(AppContext);
  const { isConnected, currentAccount } = value.state;

  // ! This function has no use, should be removed
  // const isWalletConnect = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (!ethereum) {
  //       console.log("Make sure you have MetaMask!");
  //       return;
  //     } else {
  //       console.log("We have the ethereum object", ethereum);
  //     }
  //     const accounts = await ethereum.request({ method: "eth_accounts" });
  //     const provider = new ethers.providers.Web3Provider(ethereum);
  //     const Id = await provider.getNetwork();
  //     if (Id.chainId !== 80001) {
  //       console.log("connect to mumbai testnet");
  //       alert("Connect to mumbai network");
  //       throw new error("Connect to mumbai network");
  //     }

  //     if (accounts.length !== 0) {
  //       const account = accounts[0];
  //       console.log(account);

  //       if (Id.chainId === 80001) {
  //         setCurrentAccount(account);
  //         setIsConnected(true);
  //       }
  //     } else {
  //       console.log("No account found");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Install metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(account);
        console.log("Logging in..");
        const provider = new ethers.providers.Web3Provider(ethereum);
        const Id = await provider.getNetwork();
        console.log(Id.chainId);
        // const provider = new ethers.providers.getDefaultProvider(ethereum);
        // const { chainId } = provider.
        // console.log(chainId);
        if (Id.chainId !== 80001) {
          console.log("connect to mumbai testnet");
          alert("Connect to mumbai network");
          throw new error("Connect to mumbai network");
        }
        if (Id.chainId === 80001) {
          value.setCurrentAccount(account);
          value.setIsConnected(true);
          await axios
            .post("http://localhost:3001/api/authenticate", {
              walletAddress: account,
            })
            .then((response) => {
              // setData(response.data);
              // const data = response.data;
              value.setAccessToken(response.data.access_token);
              headers(response.data.access_token);
            })
            .catch((error) => {
              console.log(error);
            });
          // headers(response.data.access_token);
        }
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const headers = (access_token) => {
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    };

    value.setAccessToken(header);
  };

  // TODO: Comment this out later, and modify to implement disconnect feature.
  // const disconnectWallet = async () => {
  //   try {
  //     if (!ethereum) {
  //       console.log("Install metamask");
  //     }

  //     const account = await ethereum.request({
  //       method: "eth_requestAccounts",
  //       params: [{ eth_accounts: {} }],
  //     });

  //     setCurrentAccount(account);
  //     setIsConnected(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   isWalletConnect();
  // }, []);
  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navbarLeft}>
          <li className={styles.navBtn}>
            <Link href="/">Home</Link>
          </li>
          {isConnected && (
            <>
              <li className={styles.navBtn}>
                <Link href="/Proposal">Propose project</Link>
              </li>
              <li className={styles.navBtn}>
                <Link href="/Approve">Approve project</Link>
              </li>
              <li className={styles.navBtn}>
                <Link href="/Impact">Get Impact</Link>
              </li>
              <li className={styles.navBtn}>
                <Link href="/BuyLYS">Buy LYS</Link>
              </li>
            </>
          )}
        </ul>
        <div className={styles.loginBtn}>
          {!isConnected && (
            <button onClick={connectWallet}>Wallet login</button>
          )}
          {isConnected && (
            <div>
              <button className={styles.logIn}>
                Logged in (
                <span>
                  {currentAccount.slice(0, 4)}....{currentAccount.slice(-4)}
                </span>
                )
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
export default Nav;
