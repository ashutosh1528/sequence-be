export default (cellId: string) => {
  if (!cellId) return false;
  if (typeof cellId !== "string") return false;
  const parts = cellId.split(".");
  if (parts.length !== 2) return false;
  const [x, y] = parts;
  const intX = parseInt(x, 10);
  const intY = parseInt(y, 10);
  if (isNaN(intX) || isNaN(intY)) return false;
  if (intX < 0 || intX > 9 || intY < 0 || intY > 9) return false;
  return true;
};
