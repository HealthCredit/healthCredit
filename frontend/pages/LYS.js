import Nav from "./components/Nav";
import styles from "../styles/LYS.module.css";
import { useState } from "react";

function LYS() {
  const [id, setId] = useState();
  const link=`https://testnets.opensea.io/assets/mumbai/0xFcD3C90F4B8F4E07454f4E67579809b718EbeDF7/${id}`;
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <h3>Enter Id of LYS you want to buy :-</h3>
        <input type="number" onChange={(e) => setId(+e.target.value)} />
        <button>
          <a href={link}>buy</a>
        </button>
      </div>
    </>
  );
}

export default LYS;
