const hexTable = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
];

const getColorFromInt = (color: number): string => {
  let s = "";

  while (color !== 0) {
    s = hexTable[color % 16] + s;
    color = Math.floor(color / 16);
  }

  s = "0".repeat(6 - s.length) + s;

  return "#" + s;
};

export { getColorFromInt };
