import React, { createContext, useState, useContext, ReactNode } from "react";

interface MenuContextType {
  isMenuVisible: boolean;
  toggleMenu: () => void;
  setIsMenuVisible: React.Dispatch<React.SetStateAction<boolean>>; // Añadido
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface MenuProviderProps {
  children: ReactNode;
}

const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuVisible((prevState) => !prevState);
  };

  return (
    <MenuContext.Provider
      value={{ isMenuVisible, toggleMenu, setIsMenuVisible }}
    >
      {children}
    </MenuContext.Provider>
  );
};

const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);

  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }

  return context;
};

export { MenuProvider, useMenu };
