"use client";

import { Box, Button, SelectField, Typography } from "@jlopvil/mui-kit";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { languages, type Language } from "@/lib/animals";
import type { GameController } from "./use-animal-game";

const languageOptions = Object.entries(languages).map(([value, label]) => ({
  value: value as Language,
  label,
}));

function LanguageField({
  id,
  label,
  value,
  onChange,
  exclude,
}: {
  id: string;
  label: string;
  value: Language;
  onChange: (value: Language) => void;
  exclude?: Language;
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        component="label"
        htmlFor={id}
        id={`${id}-label`}
        sx={{
          display: "block",
          mb: 1,
          fontSize: 13,
          fontWeight: 800,
          color: "#1e2933",
        }}
      >
        {label}
      </Typography>
      <SelectField<Language>
        id={id}
        value={value}
        onChange={onChange}
        fullWidth
        options={languageOptions.filter((option) => option.value !== exclude)}
        slotProps={{ select: { labelId: `${id}-label` } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 50,
            borderRadius: "12px",
            bgcolor: "#fff",
            color: "#292c56",
            fontSize: 14,
            fontWeight: 700,
          },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d2d2e8" },
          "& .MuiSelect-icon": { color: "#34385f" },
        }}
      />
    </Box>
  );
}

export function GameLanguageSettings({ game }: { game: GameController }) {
  const { m, mode, source, setSource, target, setTarget, start, ready } = game;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-end" },
        gap: 2.25,
        mt: 3.5,
      }}
    >
      {mode !== "picture" && (
        <LanguageField
          id="source-language"
          label={m.source}
          value={source}
          onChange={setSource}
          exclude={target}
        />
      )}
      <LanguageField
        id="target-language"
        label={m.target}
        value={target}
        onChange={(value) => {
          setTarget(value);
          if (value === source) setSource(target);
        }}
      />
      <Button
        variant="contained"
        onClick={start}
        disabled={!ready}
        endIcon={<NorthEastRoundedIcon sx={{ fontSize: "16px !important" }} />}
        sx={{
          flexShrink: 0,
          minHeight: 50,
          px: 3,
          gap: 1.5,
          borderRadius: "12px",
          bgcolor: "#484dd8",
          boxShadow: "none",
          "&:hover": { bgcolor: "#3b40c4", boxShadow: "none" },
        }}
      >
        {m.start}
      </Button>
    </Box>
  );
}
