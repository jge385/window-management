export interface WindowLabelMap {
  [key: string]: string;
}

export const WINDOW_STATUS_LABEL_MAP: WindowLabelMap = {
  fixedCost: "Fixed",
  awningCost: "Awning",
  slidingFixedCost: "Sliding Fixed",
  slidingAwningCost: "Sliding Awning",
  slidingDoorCost: "Sliding Door",
  slidingTwoFixedCost: "Sliding Two Fixed",
  slidingTwoAwningCost: "Sliding Two Awning",
  slidingTwoDoorCost: "Sliding Two Door",
  doorCost: "Door",
};

export const WINDOW_THICKNESS_LABEL_MAP: WindowLabelMap = {
  JHLinea: "JH linea",
  JHOblique: "JH oblique",
  brick: "brick veneer",
};
