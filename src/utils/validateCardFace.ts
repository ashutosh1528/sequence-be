export default (cardFace: string) => {
  if (!cardFace) return false;
  if (typeof cardFace !== "string") return false;
  if (cardFace.length !== 2) return false;
  const suits = ["H", "D", "C", "S"];
  const cards = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
  ];
  if (!cards.includes(cardFace[0])) return false;
  if (!suits.includes(cardFace[1])) return false;
  return true;
};
