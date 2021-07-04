import * as React from "react";
import styles from "./styles/Card.module.css";
const Card = (props) => {
  const getColor = () => {
    if (props.suit === "♠" || props.suit === "♣") {
      return styles.black;
    } else {
      return styles.red;
    }
  };
  const fetchCard = () => {
    if (!props.hidden) {
      return (
        <div className={styles.card}>
          <div className={getColor()}>
            <h1 className={styles.value}>{props.value}</h1>
            <h1 className={styles.suit}>{props.suit}</h1>
          </div>
        </div>
      );
    } else {
      return <div className={styles.hidden} />;
    }
  };
  return <>{fetchCard()}</>;
};

export default Card;
