import { useState, useEffect } from "react";
import { createDeck, shuffleDeck, dealCard } from "../utils/deck";
import Image from 'next/image';

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

  // for card animations:
  const [animatedCard, setAnimatedCard] = useState(null); // Card to animate
  const [cardPosition, setCardPosition] = useState({ x: "-100%", y: "50%" }); // Initial position
  const [isAnimating, setIsAnimating] = useState(false); // Animation state


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

  const hitStart = () => {
    const newDeck = [...deck];
    const newCard = dealCard(newDeck);
    setDeck(newDeck);

    animateCard(newCard, 'player');
    setTimeout(() => {
      hit(newCard);
    }, 1600);
  };

  const hit = (newCard) => {

    const newPlayerHand = [...playerHand, newCard];
    setPlayerHand(newPlayerHand);

    const value = calculateHandValue(newPlayerHand);
    setPlayerTotal(value);
    if (value > 21) {
      setMessage("You busted!");
      setGameOver(true);
      setPlayerTurnOver(true);
    }
  };

  const animateCard = (card, person) => {
    setAnimatedCard(card);
    setCardPosition({x: "50%", y: "0%" });
    setIsAnimating(true);

    setTimeout(() => {
      if (person === 'dealer') {
        setCardPosition({ x: "50%", y: "30%" });
      } else if (person === 'player') {
        setCardPosition({ x: "50%", y: "60%" });
      }
    }, 100);

    setTimeout(() => {
      setIsAnimating(false);
      setAnimatedCard(null);
    }, 1600)
  }

  const betUp = () => {
    setBet(bet + 10); // Increase bet by 10
    setBalance(balance - 10); // Decrease balance by 10
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
  // const clearBets = () => {
  //   setBalance(balance + bet); // Add bet back to balance
  //   setBet(0); // Reset bet to 0
  // }
{/*}
  const stand = () => {
    setPlayerTurnOver(true);

    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    if (calculateHandValue(newDealerHand) < 17) {
      dealerHitStart();
    } else {
      dealerDone();
    }
  };
*/}
  const dealerDone = () => {

    let newDealerHand = [...dealerHand];

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

    let newDeck = [...deck];

    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setMessage(outcome);
    setGameOver(true);
  };

  {/*}
  const dealerHit = () => {
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];
    
    const newCard = dealCard(newDeck);
  
    animateCard(newCard, 'dealer');
    newDealerHand.push(newCard);
    let value = calculateHandValue(newDealerHand);

    dealerHit1(newCard);

  };
  
  const dealerHit1 = (newCard) => {
    setTimeout(() => {
      let newDealerHand = [...dealerHand]
      newDealerHand.push(newCard);
      setDealerHand(newDealerHand);
      setDealerTotal(calculateHandValue(dealerHand));

      const dealerTotal = calculateHandValue(dealerHand);
      if (dealerTotal < 17) {
        dealerHit();
        console.log("Dealer hits again. Total: " + value);
      } else {
        dealerDone();
        console.log("Dealer is done. Final total: " + value);
      }
    }, 1600);
  } */}

  {/* 
  const dealerHitStart = () => {
    const newDeck = [...deck];
    const newCard = dealCard(newDeck);
    setDeck(newDeck);

    console.log("Dealer hits before animation. New card: " + newCard1);
    animateCard(newCard, 'dealer');
    setTimeout(() => {
      dealerHit(newCard);
    }, 1600);
  };

  const dealerHit = (newCard) => {

    const newDealerHand = [...dealerHand, newCard];
    console.log("Dealer hits. New card: " + newCard);
    setDealerHand(newDealerHand);

    const value = calculateHandValue(newDealerHand);
    setDealerTotal(value);
    if (value >= 17) {
      dealerDone();
    } else {
      dealerHitStart();
    }
  };

*/}

  const renderCard = (card, hidden = false) => {
    if (hidden) {
      return (
        <div>
          <Image
  src="/cardpics/back.png"
  alt="Face Down Card"
  width={80}
  height={115}
  className="w-16 sm:w-20 h-29 rounded shadow-md"
  unoptimized
/>
        </div>
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
      <Image
  src={imagePath}
  alt={`${card.rank} of ${card.suit}`}
  width={80}
  height={115}
  className="w-16 sm:w-20 h-auto rounded shadow-lg"
  unoptimized
/>
    );
  };
  

  return (
    <div
      className="text-white p-4 flex flex-col justify-start items-center"
      style={backgroundImageStyle}
    >
      {/* Title */}
      <Image
  src="/blackjacklogo.png"
  alt="Blackjack Logo"
  width={200} // estimate based on w-50, you can adjust
  height={80} // estimate based on aspect ratio
  className="w-50 h-auto drop-shadow-lg"
  unoptimized
/>

      <div className="text-white text-lg font-semibold drop-shadow">
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

      {isAnimating && animatedCard && (
        <div
          style={{
            position: "absolute",
            top: cardPosition.y,
            left: cardPosition.x,
            transform: "translate(-50%, -50%)",
            transition: "all 1s ease",
          }}
        >
          {renderCard(animatedCard)}
        </div>
      )}

      {/* Game Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {!gameOver && (
          <>
            <button
              onClick={hitStart}
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
