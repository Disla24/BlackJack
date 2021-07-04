import React, { useState, useEffect } from "react";
import Controller from "./components/Controller";
import Status from "./components/Status";
import CardHolder from "./components/CardHolder";
import CardDeck from "./card-deck.json";
import "./App.css";
const App = () => {
  const GameState = {
    bet: 0,
    initial: 1,
    user: 2,
    dealer: 3,
  };
  const MessageTitle = {
    bet: "Place a bet",
    hitStick: "Hit or Stick?",
    bust: "Bust",
    userWin: "You Win",
    dealerWin: "Dealer Wins",
    tie: "Tie",
  };
  const DealHolder = {
    dealer: 0,
    hidden: 1,
    user: 2,
  };
  const [message, setMessage] = useState(MessageTitle.bet);
  const [balanceAmount, setBalanceAmount] = useState(100);
  const [gameState, setGameState] = useState(GameState.bet);
  const [bet, setBet] = useState(0);
  const [buttonValue, setButtonValue] = useState({
    hitDisabled: false,
    stickDisabled: false,
    resetDisabled: true,
  });
  const [userCards, setUserCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [dealerPoints, setDealerPoints] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const data = JSON.parse(JSON.stringify(CardDeck.cards));
  const [deck, setDeck] = useState(data);
  const placedBet = (amount) => {
    setBet(amount);
    setBalanceAmount(Math.round((balanceAmount - amount) * 100) / 100);
    setGameState(GameState.initial);
  };
  const getCard = (type) => {
    if (deck.length > 0) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const card = deck[randomIndex];
      deck.splice(randomIndex, 1);
      setDeck([...deck]);
      switch (card.suit) {
        case "spades":
          dealCard(type, card.value, "♠");
          break;
        case "diamonds":
          dealCard(type, card.value, "♦");
          break;
        case "clubs":
          dealCard(type, card.value, "♣");
          break;
        case "hearts":
          dealCard(type, card.value, "♥");
          break;
        default:
          break;
      }
    } else {
      alert("No more cards left");
    }
  };
  const dealCard = (type, value, suit) => {
    switch (type) {
      case DealHolder.dealer:
        dealerCards.push({ value: value, suit: suit, hidden: false });
        setDealerCards([...dealerCards]);
        break;
      case DealHolder.hidden:
        dealerCards.push({ value: value, suit: suit, hidden: true });
        setDealerCards([...dealerCards]);
        break;
      case DealHolder.user:
        userCards.push({ value: value, suit: suit, hidden: false });
        setUserCards([...userCards]);
        break;
      default:
        break;
    }
  };
  const revealCard = () => {
    dealerCards.filter((card) => {
      if (card.hidden === true) {
        card.hidden = false;
      }
      return card;
    });
    setDealerCards([...dealerCards]);
  };
  const hitEvent = () => {
    setGameState(GameState.user);
    getCard(DealHolder.user);
  };

  const stickEvent = () => {
    setButtonValue({
      hitDisabled: true,
      stickDisabled: true,
      resetDisabled: false,
    });
    setGameState(GameState.dealer);
    revealCard();
  };

  const resetEvent = () => {
    setButtonValue({
      hitDisabled: false,
      stickDisabled: false,
      resetDisabled: true,
    });
    setGameState(GameState.bet);
    setUserCards([]);
    setDealerCards([]);
    setUserPoints(0);
    setDealerPoints(0);
    setDeck(data);
    setBet(0);
    setMessage(MessageTitle.bet);
  };
  const evaluateScore = (cards, setTotalScore) => {
    let totalScore = 0;
    cards.forEach((card) => {
      if (!card.hidden && card.value !== "A") {
        switch (card.value) {
          case "J":
            totalScore += 10;
            break;
          case "Q":
            totalScore += 10;
            break;
          case "K":
            totalScore += 10;
            break;
          default:
            totalScore += Number(card.value);
            break;
        }
      }
    });
    // find if there are any aces
    const aces = cards.filter((card) => {
      return card.value === "A";
    });
    aces.forEach((card) => {
      if (!card.hidden) {
        if (totalScore + 11 > 21) {
          totalScore += 1;
        } else if (totalScore + 11 === 21) {
          if (aces.length > 1) {
            totalScore += 1;
          } else {
            totalScore += 11;
          }
        } else {
          totalScore += 11;
        }
      }
    });
    setTotalScore(totalScore);
  };
  const check = () => {
    if (userPoints > dealerPoints || dealerPoints > 21) {
      setBalanceAmount(Math.round((balanceAmount + bet * 2) * 100) / 100);
      setMessage(MessageTitle.userWin);
    } else if (dealerPoints > userPoints) {
      setMessage(MessageTitle.dealerWin);
    } else {
      setBalanceAmount(Math.round((balanceAmount + bet * 1) * 100) / 100);
      setMessage(MessageTitle.tie);
    }
  };

  const lose = () => {
    buttonValue.hitDisabled = true;
    buttonValue.stickDisabled = true;
    buttonValue.resetDisabled = false;
    setButtonValue({ ...buttonValue });
    setMessage(MessageTitle.bust);
  };
  useEffect(() => {
    if (gameState === GameState.initial) {
      getCard(DealHolder.dealer);
      getCard(DealHolder.hidden);
      getCard(DealHolder.user);
      getCard(DealHolder.user);
      setGameState(GameState.userTurn);
      setMessage(MessageTitle.hitStick);
    }
  }, [gameState]);
  useEffect(() => {
    evaluateScore(userCards, setUserPoints);
  }, [userCards]);
  useEffect(() => {
    evaluateScore(dealerCards, setDealerPoints);
  }, [dealerCards]);
  useEffect(() => {
    if (gameState === GameState.dealer) {
      if (dealerPoints >= 17) {
        check();
      } else {
        getCard(DealHolder.dealer);
      }
    }
  }, [dealerPoints]);
  useEffect(() => {
    if (gameState === GameState.user) {
      if (userPoints === 21) {
        buttonValue.hitDisabled = true;
        setButtonValue({ ...buttonValue });
      } else if (userPoints > 21) {
        lose();
      }
    }
  }, [userPoints]);
  return (
    <>
      <h1 className="app-header">Let's Play BlackJack</h1>
      <Status message={message} balance={balanceAmount} />
      <Controller
        gameState={gameState}
        betPlaced={placedBet}
        hitEvent={hitEvent}
        stickEvent={stickEvent}
        resetEvent={resetEvent}
        buttonState={buttonValue}
      />
      <CardHolder
        title={`Dealer's Score (${dealerPoints})`}
        cards={dealerCards}
      />
      <CardHolder title={`Your Score (${userPoints})`} cards={userCards} />
    </>
  );
};

export default App;
