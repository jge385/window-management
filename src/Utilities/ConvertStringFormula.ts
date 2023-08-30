const SHARED_VARIABLES = ["fixedCost"];

export const convertStringToFormula = (
  formula: string,
  widthCount: number,
  heightCount: number
) => {
  const paramList: string[] = [];
  for (let i = 1; i <= widthCount; i++) {
    paramList.push("w" + i);
  }
  for (let j = 1; j <= heightCount; j++) {
    paramList.push("h" + j);
  }
  return new Function(
    [...paramList, ...SHARED_VARIABLES].join(","),
    `return (${formula});`
  );
};

export const extractFunctionParams = (func: any) => {
  const funcAsString = func.toString();
  const paramStart = funcAsString.indexOf("(") + 1;
  const paramEnd = funcAsString.indexOf(")");
  const paramString = funcAsString.slice(paramStart, paramEnd);
  const params = paramString.split(",").map((param: string) => param.trim());
  return params.filter((param: string) => param !== "");
};

export const containDigit = (value: string) => {
  return /\d/.test(value);
};
