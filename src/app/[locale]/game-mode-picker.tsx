"use client";

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@jlopvil/mui-kit";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import type { Mode } from "@/lib/animals";
import type { GameController } from "./use-animal-game";

const appearances = {
  picture: {
    background: "#e8e3ff",
    color: "#514d67",
    symbol: <PetsRoundedIcon sx={{ fontSize: 29 }} />,
  },
  translation: { background: "#ffeddf", color: "#a45b30", symbol: "Aa ↔" },
  matching: { background: "#e4f1ff", color: "#315c87", symbol: "A ↔ B" },
  pronouns: { background: "#e4f7ee", color: "#286c56", symbol: "Yo ↔ I" },
};

export function GameModePicker({ game }: { game: GameController }) {
  const { m, mode, setMode, gameTitle } = game;
  return (
    <FormControl fullWidth component="fieldset">
      <FormLabel
        component="legend"
        id="mode-label"
        sx={{
          color: "#1e2933",
          fontFamily: "Outfit, sans-serif",
          fontSize: 23,
          fontWeight: 800,
          "&.Mui-focused": { color: "#1e2933" },
        }}
      >
        {m.choose}
      </FormLabel>
      <RadioGroup
        aria-labelledby="mode-label"
        name="game-mode"
        value={mode}
        onChange={(_, value) => setMode(value as Mode)}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2.25,
          mt: 2.75,
        }}
      >
        {(["picture", "translation", "pronouns", "matching"] as const).map(
          (value) => (
            <FormControlLabel
              key={value}
              value={value}
              disableTypography
              control={
                <Radio
                  sx={{
                    position: "absolute",
                    right: 14,
                    top: 14,
                    color: "#9292a5",
                    "&.Mui-checked": { color: "#595ce4" },
                  }}
                />
              }
              sx={{
                position: "relative",
                m: 0,
                p: 3,
                minWidth: 0,
                alignItems: "stretch",
                border: "2px solid",
                borderRadius: "18px",
                borderColor: mode === value ? "#6463ea" : "#e8e6f1",
                bgcolor: mode === value ? "#f5f3ff" : "#fff",
                transition:
                  "border-color 160ms ease, background-color 160ms ease",
                "&:hover": { borderColor: "#9691ec", bgcolor: "#f8f7ff" },
                "&:has(.Mui-focusVisible)": {
                  outline: "3px solid #aa6d16",
                  outlineOffset: 4,
                },
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
              label={
                <Box sx={{ width: "100%" }}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 62,
                      height: 58,
                      mb: 2,
                      borderRadius: "15px",
                      bgcolor: appearances[value].background,
                      color: appearances[value].color,
                      fontSize:
                        value === "matching"
                          ? m.matchingDescription
                          : value === "pronouns"
                            ? 20
                            : 25,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {appearances[value].symbol}
                  </Box>
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      mb: 1.75,
                      color: "#1e2933",
                      fontSize: 19,
                      fontWeight: 800,
                      lineHeight: 1.35,
                    }}
                  >
                    {gameTitle(value)}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      color: "#70748d",
                      fontSize: 14,
                      lineHeight: 1.65,
                    }}
                  >
                    {value === "picture"
                      ? m.pictureDescription
                      : value === "matching"
                        ? m.matchingDescription
                        : value === "pronouns"
                          ? m.pronounsDescription
                          : m.translationDescription}
                  </Typography>
                </Box>
              }
            />
          ),
        )}
      </RadioGroup>
    </FormControl>
  );
}
