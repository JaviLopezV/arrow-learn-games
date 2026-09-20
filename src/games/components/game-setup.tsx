"use client";

import { Surface, Typography } from "@jlopvil/mui-kit";
import {
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { languages } from "@/lib/animals";
import type { GameController } from "../engines/use-game";
import { GameLanguageSettings } from "./game-language-settings";

export function GameSetup({ game }: { game: GameController }) {
  const { m, mode, source, target, topic, locale } = game;
  return (
    <Surface
      padding="none"
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: "24px",
        borderColor: "#e4e1f2",
        bgcolor: "#fff",
        boxShadow: "none",
      }}
      className="game-setup"
    >
      <GameLanguageSettings game={game} />
      <Typography
        component="p"
        sx={{ mt: 2.75, color: "#70748d", fontSize: 13, lineHeight: 1.7 }}
      >
        {mode === "matching" ? m.matchingRules : m.rules}
      </Typography>
      {topic.reference === "subject-pronouns" && (
        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            id="pronouns-summary"
            aria-controls="pronouns-reference"
          >
            {m.pronounsList}
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="p">{m.pronounsNote}</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th" scope="col">
                      {m.pronounsContext}
                    </TableCell>
                    <TableCell component="th" scope="col">
                      {languages[source]}
                    </TableCell>
                    <TableCell component="th" scope="col">
                      {languages[target]}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topic.items.map((pronoun) => (
                    <TableRow key={pronoun.id}>
                      <TableCell component="th" scope="row">
                        {pronoun.context?.[locale]}
                      </TableCell>
                      <TableCell lang={source}>
                        {pronoun.words[source][0]}
                      </TableCell>
                      <TableCell lang={target}>
                        {pronoun.words[target][0]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </Surface>
  );
}
