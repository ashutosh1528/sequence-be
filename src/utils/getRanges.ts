export default (x: number, y: number) => {
  const result = {
    rangeH: [[], []],
    rangeV: [[], []],
    rangeDL: [[], []],
    rangeDNL: [[], []],
  };
  if (typeof x !== "number" && typeof y !== "number") return result;
  if (x < 0 || x > 9 || y < 0 || y > 9) return result;

  const isInRange = (xt: number, yt: number) => {
    if (xt >= 0 && xt <= 9 && yt >= 0 && yt <= 9) return true;
    return false;
  };
  const getDiaRange = (isLeading = 1) => {
    const pts = [];
    for (let i = -4; i <= 4; i++) {
      const newX = x + i * isLeading;
      const newY = y + i;
      if (isInRange(newX, newY)) pts.push([newX, newY]);
    }
    if (pts.length === 0) return [[], []];
    return [pts[0], pts[pts.length - 1], [isLeading], [1]];
  };
  return {
    rangeH: [[x, Math.max(0, y - 4)], [x, Math.min(9, y + 4)], [0], [1]],
    rangeV: [[Math.max(0, x - 4), y], [Math.min(9, x + 4), y], [1], [0]],
    rangeDL: getDiaRange(1),
    rangeDNL: getDiaRange(-1),
  };
};
