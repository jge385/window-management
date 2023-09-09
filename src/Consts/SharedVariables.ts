export interface WindowStatusVariablesMap {
  [key: string]: string;
}

export const SHARED_WINDOW_STATUS_VARIABLES = [
  "fixedCost",
  "awningCost",
  "slidingFixedCost",
  "slidingAwningCost",
  "slidingDoorCost",
  "slidingTwoFixedCost",
  "slidingTwoAwningCost",
  "slidingTwoDoorCost",
  "doorCost",
];

export const SHARED_WINDOW_STATUS_VARIABLES_AB = [
  "FC",
  "AC",
  "SFC",
  "SAC",
  "SDC",
  "STFC",
  "STAC",
  "STDC",
  "DC",
];

export const SHARED_WINDOW_STATUS_VARIABLES_AB_MAP: WindowStatusVariablesMap = {
  FC: "fixedCost",
  AC: "awningCost",
  SFC: "slidingFixedCost",
  SAC: "slidingAwningCost",
  SDC: "slidingDoorCost",
  STFC: "slidingTwoFixedCost",
  STAC: "slidingTwoAwningCost",
  STDC: "slidingTwoDoorCost",
  DC: "doorCost",
};

export const SHARED_WINDOW_THICKNESS_VARIABLES = [
  "JHLinea",
  "JHOblique",
  "brick",
];

export const ALUMINIUM_VARIABLES = ["Alu1", "Alu2", "Alu3", "Alu4"];
