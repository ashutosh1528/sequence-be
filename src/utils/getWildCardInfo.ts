// Only for valid card face, validate card face before calling this function
export default (cardFace: string) => {
  if (!cardFace.includes("J")) return "";
  const TWO_EYED_JACKS_SUITS = ["D", "C"];
  const cardFaceSuit = cardFace?.[1] || "";
  if (!cardFaceSuit) return "";
  if (TWO_EYED_JACKS_SUITS.includes(cardFaceSuit)) return "PLAY_WILDCARD";
  return "REMOVE_WILDCARD";
};
