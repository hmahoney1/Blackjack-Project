// deck.js

export const createDeck = () => {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = [
      { rank: "A", value: 11 },
      { rank: "2", value: 2 },
      { rank: "3", value: 3 },
      { rank: "4", value: 4 },
      { rank: "5", value: 5 },
      { rank: "6", value: 6 },
      { rank: "7", value: 7 },
      { rank: "8", value: 8 },
      { rank: "9", value: 9 },
      { rank: "10", value: 10 },
      { rank: "J", value: 10 },
      { rank: "Q", value: 10 },
      { rank: "K", value: 10 },
    ];
  
    const deck = [];
    suits.forEach((suit) => {
      ranks.forEach(({ rank, value }) => {
        deck.push({ suit, rank, value });
      });
    });
  
    return deck;
  };
  
  export const shuffleDeck = (deck) => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };
  
  export const dealCard = (deck) => deck.pop();
  