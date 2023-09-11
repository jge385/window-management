import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";

export interface WindowTypeExcel {
  TypeName: string;
  HeightCount: number;
  WidthCount: number;
  WindowCount: number;
  AluminiumFormula: string;
}

const MOCK_INITIAL_WINDOW_TYPES = [
  {
    TypeName: "Test window 1",
    HeightCount: 3,
    WidthCount: 3,
    WindowCount: 3,
    AluminiumFormula: "(w1+h1) * win1 + 1",
  },
  {
    TypeName: "Test window 2",
    HeightCount: 2,
    WidthCount: 4,
    WindowCount: 3,
    AluminiumFormula: "(w1+h1) * 1",
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
