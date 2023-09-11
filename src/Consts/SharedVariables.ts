export interface WindowStatusVariablesMap {
  [key: string]: string;
}

export const SHARED_WINDOW_STATUS_VARIABLES = [
  "fixedCost",
  "awningCost",
  "slidingCost",
  "slidingTwoCost",
  "doorCost",
];

export const SHARED_WINDOW_STATUS_VARIABLES_AB = [
  "FC",
  "AC",
  "SC",
  "STC",
  "DC",
];

export const SHARED_WINDOW_STATUS_VARIABLES_AB_MAP: WindowStatusVariablesMap = {
  FC: "fixedCost",
  AC: "awningCost",
  SC: "slidingCost",
  STC: "slidingTwoCost",
  DC: "doorCost",
};

export const SHARED_WINDOW_THICKNESS_VARIABLES = [
  "JHLinea",
  "JHOblique",
  "brick",
];

export const ALUMINIUM_VARIABLES = ["Alu1", "Alu2", "Alu3", "Alu4"];
