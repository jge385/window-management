import {
  SHARED_WINDOW_STATUS_VARIABLES_AB,
  SHARED_WINDOW_THICKNESS_VARIABLES,
  ALUMINIUM_VARIABLES,
} from "../Consts/SharedVariables";

const UNSHARED_WINDOW_VARIABLES = ["height", "width", "revelWidth"];

export const convertPriceStringToFormula = (
  formula: string,
  widthCount: number,
  heightCount: number,
  windowCount: number
) => {
  const paramList: string[] = [];
  for (let i = 1; i <= widthCount; i++) {
    paramList.push("w" + i);
  }
  for (let j = 1; j <= heightCount; j++) {
    paramList.push("h" + j);
  }
  for (let k = 1; k <= windowCount; k++) {
    paramList.push("win" + k);
  }
  return new Function(
    [
      ...paramList,
      ...SHARED_WINDOW_STATUS_VARIABLES_AB,
      ...SHARED_WINDOW_THICKNESS_VARIABLES,
    ].join(","),
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

// if the field is win1, the value will be like "fixedCost", need to use shared variable data
export const containWin = (value: string) => {
  return value.includes("win");
};

export const convertCalculateStringToFormula = (formula: string) => {
  return Function(
    [
      ...SHARED_WINDOW_THICKNESS_VARIABLES,
      ...ALUMINIUM_VARIABLES,
      ...UNSHARED_WINDOW_VARIABLES,
    ].join(","),
    `return (${formula});`
  );
};

export const isWindowBasedField = (value: string) => {
  return UNSHARED_WINDOW_VARIABLES.includes(value);
};

export const findClosestSmallNumber = (range: number[], target: number) => {
  let closest = null;
  for (let i = 0; i < range.length; i++) {
    if (range[i] <= target) {
      if (
        closest === null ||
        Math.abs(target - range[i]) < Math.abs(target - closest)
      ) {
        closest = range[i];
      }
    }
  }
  return closest;
};
