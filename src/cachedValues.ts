const initialValue = localStorage.getItem("initialValue");
const upFactor = localStorage.getItem("upFactor");
const downFactor = localStorage.getItem("downFactor");

const returnIfExists = (val: string | null) =>
  val === null ? null : parseInt(val);

export const cache = {
  initialValue: returnIfExists(initialValue),
  upFactor: returnIfExists(upFactor),
  downFactor: returnIfExists(downFactor),
};
