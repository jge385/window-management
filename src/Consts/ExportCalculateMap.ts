export interface AluminiumThickStatusMap {
  [key: string]: number;
}

export const ALUMINIUM_THICK_1_STATUS_MAP: AluminiumThickStatusMap = {
  fixedCost: 68.8,
  awningCost: 68.8,
  slidingFixedCost: 110,
  slidingAwningCost: 110,
  slidingDoorCost: 110,
  slidingTwoFixedCost: 156.8,
  slidingTwoAwningCost: 156.8,
  slidingTwoDoorCost: 156.8,
  doorCost: 48,
};

export const ALUMINIUM_THICK_2_STATUS_MAP: AluminiumThickStatusMap = {
  fixedCost: 67,
  awningCost: 67,
  slidingFixedCost: 69,
  slidingAwningCost: 69,
  slidingDoorCost: 69,
  slidingTwoFixedCost: 90.9,
  slidingTwoAwningCost: 90.9,
  slidingTwoDoorCost: 90.9,
  doorCost: 46,
};

export const ALUMINIUM_THICK_3_STATUS_MAP: AluminiumThickStatusMap = {
  fixedCost: 1.8,
  awningCost: 1.8,
  slidingFixedCost: 41,
  slidingAwningCost: 41,
  slidingDoorCost: 41,
  slidingTwoFixedCost: 65.9,
  slidingTwoAwningCost: 65.9,
  slidingTwoDoorCost: 65.9,
  doorCost: 2,
};

export const ALUMINIUM_THICK_4_STATUS_MAP: AluminiumThickStatusMap = {
  fixedCost: 0,
  awningCost: 0,
  slidingFixedCost: 28.3,
  slidingAwningCost: 28.3,
  slidingDoorCost: 28.3,
  slidingTwoFixedCost: 50.8,
  slidingTwoAwningCost: 50.8,
  slidingTwoDoorCost: 50.8,
  doorCost: 0,
};

export interface AluminiumThickStatusNumberMap {
  [key: string]: AluminiumThickStatusMap;
}

export const ALUMINIUM_NUMBER_MAP: AluminiumThickStatusNumberMap = {
  Alu1: ALUMINIUM_THICK_1_STATUS_MAP,
  Alu2: ALUMINIUM_THICK_2_STATUS_MAP,
  Alu3: ALUMINIUM_THICK_3_STATUS_MAP,
  Alu4: ALUMINIUM_THICK_4_STATUS_MAP,
};
