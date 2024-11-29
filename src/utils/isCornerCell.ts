import getCellIndices from "./getCellIndices";

export default (cellId: string) => {
  const [x, y] = getCellIndices(cellId);
  if (x === 0 && y === 0) return true;
  if (x === 0 && y === 9) return true;
  if (x === 9 && y === 0) return true;
  if (x === 9 && y === 9) return true;
  return false;
};
