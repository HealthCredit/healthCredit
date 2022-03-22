import React from "react";
import Proposal from "../Proposal";
import Link from "next/link";
import styles from "./Grid.module.css";

function Grid({ obj, hasImpact }) {
  return (
    <div className={styles.container}>
      <div>
        <p>{obj.id}</p>
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
      {hasImpact && <div>{obj.status ? <p>Approved</p> : <p>Pending</p>}</div>}
    </div>
  );
}

export default Grid;
