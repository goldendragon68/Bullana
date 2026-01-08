import React from "react";
import ThemesProvider from "./provider.theme";
import StoreProvider from "./provider.store";

interface AllProviderProps {
  children: React.ReactNode;
}
const AllProvider: React.FC<AllProviderProps> = ({ children }) => {
  return (
    <ThemesProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </ThemesProvider>
  );
};

export default AllProvider;
