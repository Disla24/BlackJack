import React, { useState, useEffect } from "react";
import styles from "./styles/Controller.module.css";
const Controller = (props) => {
  const [amount, setAmount] = useState(10);
  const betAmountChange = (e) => {
    setAmount(e.target.value);
  };
  const betClicked = () => {
    props.betPlaced(Math.round(amount * 100) / 100);
  };

  const switchControl = () => {
    if (props.gameState === 0) {
      return (
        <div className={styles.container}>
          <div className={styles.betAmountContainer}>
            <h5>Bet Amount:</h5>
            <input
              autoFocus
              type="number"
              value={amount}
              onChange={betAmountChange}
              className={styles.amountInput}
            />
          </div>
          <button onClick={() => betClicked()} className={styles.button}>
            Place Bet
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          <button
            onClick={() => props.hitEvent()}
            className={styles.button}
            disabled={props.buttonState.hitDisabled}
          >
            Hit
          </button>
          <button
            onClick={() => props.stickEvent()}
            className={styles.button}
            disabled={props.buttonState.stickDisabled}
          >
            Stick
          </button>
          <button
            onClick={() => props.resetEvent()}
            className={styles.button}
            disabled={props.buttonState.resetDisabled}
          >
            Reset
          </button>
        </div>
      );
    }
  };
  return <>{switchControl()}</>;
};

export default Controller;
