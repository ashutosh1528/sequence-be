import validateCellId from "./validateCellId";

export default (cellId: string) => {
  if (!validateCellId(cellId)) return [];
  return cellId.split(".").map((id) => parseInt(id, 10));
};
