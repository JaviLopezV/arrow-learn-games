"use client";

import { MyUiProvider } from "@jlopvil/mui-kit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyUiProvider
      defaultMode="light"
      themeOptions={{
        colorScheme: "light",
        typography: {
          fontFamily: '"DM Sans", Arial, sans-serif',
          h5: { fontFamily: "Outfit, sans-serif", fontWeight: 700 },
          h6: { fontFamily: "Outfit, sans-serif", fontWeight: 700 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 12,
                fontWeight: 700,
                minHeight: 48,
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: { backgroundColor: "#fcfbf8", color: "#20234b" },
            },
          },
        },
        brand: {
          primary: { main: "#3B46C5" },
          secondary: { main: "#F26B4F" },
        },
      }}
    >
      {children}
    </MyUiProvider>
  );
}
