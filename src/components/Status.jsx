import * as React from "react";
import styles from "./styles/Status.module.css";
const Status = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.statusHeading}>
        <h1 className={styles.heading1}>{props.message}</h1>
      </div>
      <div className={styles.balanceAmountHeading}>
        <h1 className={styles.heading2}>${props.balance}</h1>
      </div>
    </div>
  );
};

export default Status;
