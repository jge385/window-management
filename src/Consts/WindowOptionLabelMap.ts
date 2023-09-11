export interface WindowLabelMap {
  [key: string]: string;
}

export const WINDOW_STATUS_LABEL_MAP: WindowLabelMap = {
  fixedCost: "Fixed",
  awningCost: "Awning",
  slidingCost: "Sliding",
  slidingTwoCost: "Sliding Two",
  doorCost: "Door",
};

export const WINDOW_THICKNESS_LABEL_MAP: WindowLabelMap = {
  JHLinea: "JH linea",
  JHOblique: "JH oblique",
  brick: "brick veneer",
};
