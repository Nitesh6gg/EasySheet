
import React, { createContext, useState, ReactNode } from 'react';

interface SpreadsheetContextProps {
  selectedSheet: any;
  setSelectedSheet: (sheet: any) => void;
}

export const SpreadsheetContext = createContext<SpreadsheetContextProps>({
  selectedSheet: null,
  setSelectedSheet: () => {},
});

export const SpreadsheetProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSheet, setSelectedSheet] = useState(null);

  return (
    <SpreadsheetContext.Provider value={{ selectedSheet, setSelectedSheet }}>
      {children}
    </SpreadsheetContext.Provider>
  );
};
