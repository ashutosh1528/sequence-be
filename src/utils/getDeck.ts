import WHOLE_DECK from "../constants/WHOLE_DECK";

const getRandomCardIndex = (lastIndex = 0) => {
  return Math.floor(Math.random() * lastIndex);
};

const getDeck = () => {
  let cardStack = [...WHOLE_DECK, ...WHOLE_DECK];
  let cardStackLen = cardStack.length;
  const deck = [];
  while (cardStackLen > 0) {
    cardStackLen = cardStack.length;
    const randomCardIndex = getRandomCardIndex(cardStackLen - 1);
    deck.push(...cardStack.splice(randomCardIndex, 1));
  }
  return deck;
};

export default getDeck;
