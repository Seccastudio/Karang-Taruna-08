import { createContext, useContext, useState } from "react";

// Membuat context untuk loader
const LoaderContext = createContext();

// Provider untuk loader context
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false); // State untuk status loading

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Hook untuk mengakses LoaderContext
export const useLoader = () => useContext(LoaderContext);
