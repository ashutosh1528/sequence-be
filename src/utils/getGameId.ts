import { customAlphabet } from "nanoid";
// 10k ID with collisiom 0.27%
export default () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 3);
  return `${nanoid()}-${nanoid()}-${nanoid()}`;
};
