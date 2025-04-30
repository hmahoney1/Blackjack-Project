import { useState, useEffect } from "react";
import { createDeck, shuffleDeck, dealCard } from "../utils/deck";

const backgroundImageStyle = {
  backgroundImage: "url('/felt.jpg')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  height: '100vh',
  width: '100vw',
};

const BlackjackGame = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [playerTurnOver, setPlayerTurnOver] = useState(false);
  const [playerTotal, setPlayerTotal] = useState('');
  const [dealerTotal, setDealerTotal] = useState('');
  const [balance, setBalance] = useState(200); // Initial balance
  const [bet, setBet] = useState(10); // Initial bet

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newDeck = shuffleDeck(createDeck());
    const playerStart = [dealCard(newDeck), dealCard(newDeck)];
    const dealerStart = [dealCard(newDeck), dealCard(newDeck)];

    setDeck(newDeck);
    setPlayerHand(playerStart);
    setDealerHand(dealerStart);
    setGameOver(false);
    setMessage("");
    setPlayerTurnOver(false);
    setPlayerTotal(calculateHandValue(playerStart));
    setDealerTotal((dealerStart[0].value));
  };

  const hit = () => {
    const newDeck = [...deck];
    const newCard = dealCard(newDeck);
    const newPlayerHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);

    const value = calculateHandValue(newPlayerHand);
    setPlayerTotal(value);
    if (value > 21) {
      setMessage("You busted!");
      setGameOver(true);
      setPlayerTurnOver(true);
    }
  };

  const betUp = () => {
    setBet(bet + 10); // Increase bet by 10
    setBalance(balance - 10); // Decrease balance by 10
  }

  const clearBets = () => {
    setBalance(balance + bet); // Add bet back to balance
    setBet(0); // Reset bet to 0
  }

  const stand = () => {
    setPlayerTurnOver(true);

    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateHandValue(newDealerHand) < 17) {
      const newCard = dealCard(newDeck);
      newDealerHand.push(newCard);
    }

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(newDealerHand);

    setDealerTotal(dealerValue);

    let outcome = "";
    if (dealerValue > 21 || playerValue > dealerValue) {
      outcome = "You win!";
      setBalance(balance + bet * 2); // Win: double the bet
    } else if (dealerValue < playerValue) {
      outcome = "You win!";
      setBalance(balance + bet * 2); // Win: double the bet
    } else if (dealerValue > playerValue) {
      outcome = "Dealer wins.";
    } else {
      outcome = "Push (tie).";
      setBalance(balance + bet); // Push: return the bet
    }
    setBet(0);

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setMessage(outcome);
    setGameOver(true);
  };

  const renderCard = (card, hidden = false) => {
    if (hidden) {
      return (
        <div
          className="w-16 sm:w-20 h-auto rounded shadow-md bg-gray-600"
          style={{ backgroundColor: '#808080' }} // Grey background
        ></div>
      );
    }
  
    let rank = card.rank.toLowerCase();
    if (rank === "a") rank = "ace";
    else if (rank === "j") rank = "jack";
    else if (rank === "q") rank = "queen";
    else if (rank === "k") rank = "king";
  
    const suitMap = {
      "♠": "spades",
      "♥": "hearts",
      "♦": "diamonds",
      "♣": "clubs",
    };
  
    const suit = suitMap[card.suit];
    const filename = `${rank}_of_${suit}.png`;
    const imagePath = `/cardpics/${filename}`;
  
    return (
      <img
        src={imagePath}
        alt={`${card.rank} of ${card.suit}`}
        className="w-16 sm:w-20 h-auto rounded shadow-md"
      />
    );
  };
  

  return (
    <div
      className="text-white p-4 flex flex-col justify-center items-center"
      style={backgroundImageStyle}
    >
      {/* Title */}
      <img
  src="/blackjacklogo.avif"
  alt="Blackjack Logo"
  className="w-64 h-auto mb-6 drop-shadow-lg"
/>

      <div className="mb-4 text-white text-lg font-semibold drop-shadow">
        Balance: ${balance}
      </div>

      {/* Dealer's Hand */}
      <div className="mb-4 text-white text-lg font-semibold drop-shadow">
        Dealer's Hand: {dealerTotal}
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {dealerHand.map((card, index) =>
          index === 1 && !playerTurnOver ? renderCard(card, true) : renderCard(card)
        )}
      </div>

      {/* Player's Hand */}
      <div className="mb-4 text-white text-lg font-semibold drop-shadow">
        Your Hand: {playerTotal}
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {playerHand.map((card) => renderCard(card))}
      </div>

      {/* Game Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {!gameOver && (
          <>
            <button
              onClick={hit}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow"
            >
              Hit
            </button>
            <button
              onClick={stand}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow"
            >
              Stand
            </button>
          </>
        )}
        {gameOver && (
          <button
            onClick={() => {startGame(); betUp()}}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            Play Again: $10
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="text-white text-xl font-bold drop-shadow">{message}</div>
      )}
    </div>
  );
};

const calculateHandValue = (hand) => {
  let value = 0;
  let aceCount = 0;

  if (Array.isArray(hand) && hand.length > 0 ) {
    hand.forEach((card) => {
      value += card.value;
      if (card.rank === "A") aceCount++;
    });
  } else {
    value = 0;
  }

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
};

export default BlackjackGame;
