import getCellIndices from "./getCellIndices";
import getRanges from "./getRanges";
import validateCellId from "./validateCellId";

const getDistance = (x1: number, x2: number, y1: number, y2: number) => {
  if (x1 === x2) return Math.abs(y2 - y1) + 1;
  if (y1 === y2) return Math.abs(x2 - x1) + 1;
  return Math.abs(x2 - x1) + 1;
};

const getCellIdsInRange = (
  startPt: number[],
  endPt: number[],
  dx: number,
  dy: number
) => {
  const [x1, y1] = [startPt?.[0], startPt?.[1]];
  const [x2, y2] = [endPt?.[0], endPt?.[1]];
  const distance = getDistance(x1, x2, y1, y2);
  if (distance <= 4) return [];
  const result = [];
  for (let i = 0; i < distance; i += 1) {
    const id = `${x1 + i * dx}.${y1 + i * dy}`;
    result.push(id);
  }
  return result;
};

const findSequence = (sortedInput: string[], cellIdsInRange: string[]) => {
  if (cellIdsInRange.length < 5) return false;
  let found = false;
  cellIdsInRange = cellIdsInRange.sort();
  if (cellIdsInRange.length) {
    const len = cellIdsInRange.length;
    let j = 0;
    for (let i = 0; i < len; i += 1) {
      if (j === 4 && found) break;
      if (sortedInput[j] === cellIdsInRange[i] && !found) {
        found = true;
        j += 1;
      } else if (sortedInput[j] === cellIdsInRange[i] && found) {
        j += 1;
      } else if (sortedInput[j] !== cellIdsInRange[i] && found) {
        found = false;
        break;
      }
    }
  }
  return found;
};

const isSequenceInLine = (sequenceArr: string[]) => {
  const [x1, y1] = getCellIndices(sequenceArr[0]);
  const ranges = getRanges(x1, y1);
  const sortedInput = sequenceArr.sort();
  const isFound = Object.values(ranges).some((range, idx) => {
    const cellIdsInRange = getCellIdsInRange(
      range[0],
      range[1],
      range[2][0],
      range[3][0]
    );
    const isFound = findSequence(sortedInput, cellIdsInRange);
    return isFound;
  });
  return isFound;
};

export default (sequenceArr: string[]) => {
  if (typeof sequenceArr !== "object" || sequenceArr.length !== 5) return false;
  const isValid = sequenceArr.every((cell) => validateCellId(cell));
  if (!isValid) return false;
  const sequenceInLine = isSequenceInLine(sequenceArr);
  return sequenceInLine;
};
