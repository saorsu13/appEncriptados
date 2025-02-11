import React from "react";
import { render, screen } from "@testing-library/react-native";

import { ThemeProvider } from "@shopify/restyle";

import { useDarkModeTheme } from "@/hooks/useDarkModeTheme";

import HeaderEncrypted from "@/components/molecules/HeaderEncrypted/HeaderEncrypted";
import { ThemeCustom } from "@/config/theme2";

jest.mock("@shopify/restyle", () => ({
  useTheme: jest.fn().mockReturnValue({
    colors: {
      backgroundAlternate: "gray",
      white: "white",
      primaryText: "black",
      neutro: "gray",
    },
  }),
}));

jest.mock("@/hooks/useDarkModeTheme", () => ({
  useDarkModeTheme: jest.fn().mockReturnValue({
    themeMode: "light",
    toggleThemeMode: jest.fn(),
  }),
}));

describe("HeaderEncrypted", () => {
  it("should render correctly with title", () => {
    render(<HeaderEncrypted title="Test Title" />);

    expect(screen.getByText("Test Title")).toBeTruthy();
  });
});
