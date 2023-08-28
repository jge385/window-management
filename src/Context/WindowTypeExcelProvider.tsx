import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";

export interface WindowTypeExcel {
  TypeName: string;
  Height: number;
  Width: number;
  HeightCount: number;
  WidthCount: number;
  WindowCount: number;
  AluminiumPriceFormula: string;
  GlassFormula: string;
  AcessoriesFormula: string;
}

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
    []
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
