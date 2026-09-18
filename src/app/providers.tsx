"use client";

import { MyUiProvider } from "@jlopvil/mui-kit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyUiProvider
      defaultMode="light"
      themeOptions={{
        colorScheme: "light",
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
