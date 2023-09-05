import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";

export interface StoredDataContextValue {
  storedData: any;
  setStoredData: (data: any) => void;
}

export const StoredDataContext = createContext<
  StoredDataContextValue | undefined
>(undefined);

export function useStoredData() {
  const context = useContext(StoredDataContext);
  if (!context) {
    throw new Error("No provider for window type");
  }
  return context;
}

export default function StoredDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [storedData, setStoredData] = useState<any>();

  const windowTypesExcelContextValue = useMemo(() => {
    return {
      storedData,
      setStoredData,
    };
  }, [storedData, setStoredData]);

  return (
    <StoredDataContext.Provider value={windowTypesExcelContextValue}>
      {children}
    </StoredDataContext.Provider>
  );
}
