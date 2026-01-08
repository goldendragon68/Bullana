import React from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";

const ThemesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = (): DefaultTheme => {
    return {
      breakpoints: ["400px", "700px", "1024px", "1360px", "1600px"],
      space: [0, 4, 8, 16, 32, 64],
      fontSizes: [12, 14, 16, 20, 24, 32],
      colors: {
        color_danger: "#c52525",
        color_white: "#FFFFFF",
        color_black: "#000000",
        color_1: "#CEBC88",
        color_2: "#DDA603",
        color_3: "#BBB49C",
        color_4: "#777777",
        bg_1: "#000E16",
        bg_2: "#000E15",
        bg_3: "#021120",
        bg_4: "#242424",
        bg_5: "#161616",
        bg_6: "#343434",
        bg_7: "#676767",
        bg_8: "#8C8D8E",
      },
      fonts: [],
      fontWeights: [500, 600, 700, 800],
      lineHeights: [],
      letterSpacings: [],
      sizes: {
        widthLimit: "1200px",
      },
      borders: [],
      borderWidths: [],
      borderStyles: [],
      radii: [],
      shadows: [],
      zIndices: [],
    };
  };
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemesProvider;
