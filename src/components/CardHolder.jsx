import React from "react";
import styles from "./styles/Card.module.css";
import Card from "./Card";
const CardHolder = (props) => {
  const getTitleHeader = () => {
    if (props.cards.length > 0) {
      return <h1 className={styles.cardHolderTitle}>{props.title}</h1>;
    }
  };
  return (
    <div className={styles.cardHolderContainer}>
      {getTitleHeader()}
      <div className={styles.cardContainer}>
        {props.cards.map((card, index) => {
          return (
            <Card
              key={index}
              value={card.value}
              suit={card.suit}
              hidden={card.hidden}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardHolder;
