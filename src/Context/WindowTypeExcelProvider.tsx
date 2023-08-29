import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";

// export interface WindowTypeExcel {
//   TypeName: string;
//   Height: number;
//   Width: number;
//   HeightCount: number;
//   WidthCount: number;
//   WindowCount: number;
//   AluminiumPriceFormula: string;
//   GlassFormula: string;
//   AcessoriesFormula: string;
// }
export interface WindowTypeExcel {
  TypeName: string;
  ["Height"]: number;
  ["Width"]: number;
  HeightCount: number;
  WidthCount: number;
  WindowCount: number;
  AluminiumPriceFormula: string;
  GlassFormula: string;
  AcessoriesFormula: string;
}

const MOCK_INITIAL_WINDOW_TYPES = [
  {
    TypeName: "Test window 1",
    Height: 1200,
    Width: 2400,
    HeightCount: 1,
    WidthCount: 3,
    WindowCount: 3,
    AluminiumPriceFormula: "(w1+h1) * winCount",
    GlassFormula: "(w2+h1) * Height",
    AcessoriesFormula: "(w3+h1) * Width",
  },
  {
    TypeName: "Test window 2",
    Height: 2200,
    Width: 3400,
    HeightCount: 2,
    WidthCount: 4,
    WindowCount: 3,
    AluminiumPriceFormula: "(w1+h1) * winCount",
    GlassFormula: "(w2+h1) * Height",
    AcessoriesFormula: "(w3+h1) * Width",
  },
];

export interface WindowTypeExcelContextValue {
  windowTypesExcel: WindowTypeExcel[];
  setWindowTypesExcel: (windowTypes: WindowTypeExcel[]) => void;
}

export const WindowTypeExcelContext = createContext<
  WindowTypeExcelContextValue | undefined
>(undefined);

export function useWindowTypeExcel() {
  const context = useContext(WindowTypeExcelContext);
  if (!context) {
    throw new Error("No provider for window type");
  }
  return context;
}

export default function WindowTypeExcelProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [windowTypesExcel, setWindowTypesExcel] = useState<WindowTypeExcel[]>(
    MOCK_INITIAL_WINDOW_TYPES
  );
  const windowTypesExcelContextValue = useMemo(() => {
    return {
      windowTypesExcel,
      setWindowTypesExcel,
    };
  }, [windowTypesExcel, setWindowTypesExcel]);

  return (
    <WindowTypeExcelContext.Provider value={windowTypesExcelContextValue}>
      {children}
    </WindowTypeExcelContext.Provider>
  );
}
