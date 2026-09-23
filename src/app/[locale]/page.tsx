import { notFound } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Stack,
  Surface,
  Typography,
} from "@jlopvil/mui-kit";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ExtensionRoundedIcon from "@mui/icons-material/ExtensionRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import { isLocale, messages } from "@/i18n/messages";
import { SiteHeader } from "./site-header";

const featureStyles = [
  { icon: <ExtensionRoundedIcon fontSize="large" />, color: "lilac" },
  { icon: <LightbulbRoundedIcon fontSize="large" />, color: "peach" },
  { icon: <RocketLaunchRoundedIcon fontSize="large" />, color: "mint" },
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = messages[locale];

  return (
    <Box component="main" id="inicio">
      <SiteHeader locale={locale} />

      <Box component="section" className="hero" aria-labelledby="hero-title">
        <Container maxWidth="lg" className="hero-inner">
          <Box className="hero-copy">
            <Box className="eyebrow">
              <AutoAwesomeRoundedIcon fontSize="small" /> {m.hero.eyebrow}
            </Box>
            <Typography component="h1" id="hero-title" className="hero-title">
              {m.hero.titleBefore}
              <Box component="span">{m.hero.titleAccent}</Box>
            </Typography>
            <Typography className="hero-description">
              {m.hero.description}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              className="hero-actions"
            >
              <Button
                component="a"
                href={`/${locale}/games`}
                tone="primary"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                {m.hero.primary}
              </Button>
              <Button
                component="a"
                href="#how-it-works"
                tone="neutral"
                variant="outlined"
                size="large"
              >
                {m.hero.secondary}
              </Button>
            </Stack>
            <Box className="hero-note">
              <Box component="span" className="note-stars">
                ✦ ✦ ✦
              </Box>{" "}
              {m.hero.note}
            </Box>
          </Box>
          <Box className="hero-art" aria-hidden="true">
            <Box component="span" className="art-orbit orbit-one" />
            <Box component="span" className="art-orbit orbit-two" />
            <Box component="span" className="art-spark spark-one">
              ✦
            </Box>
            <Box component="span" className="art-spark spark-two">
              ✧
            </Box>
            <Box component="span" className="art-spark spark-three">
              ✦
            </Box>
            <Box className="game-card game-card-back">
              <Box component="span">ABC</Box>
              <Box component="strong">{m.art.letsGo}</Box>
              <Box component="small">{m.art.discover}</Box>
            </Box>
            <Box className="game-card game-card-front">
              <Box component="span" className="card-top">
                {m.art.newChallenge} <Box component="span">✦</Box>
              </Box>
              <Box component="strong">{m.art.play}</Box>
              <Box component="span" className="puzzle-row">
                <Box component="i">★</Box>
                <Box component="i">2</Box>
                <Box component="i">↗</Box>
              </Box>
              <Box component="small">{m.art.adventure}</Box>
            </Box>
            <Box className="floating-badge">
              +1 <Box component="span">{m.art.newIdea}</Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        id="how-it-works"
        className="features-section"
        aria-labelledby="features-title"
      >
        <Container maxWidth="lg">
          <Box className="section-heading">
            <Box component="span" className="section-kicker">
              {m.features.kicker}
            </Box>
            <Typography component="h2" id="features-title">
              {m.features.title}
            </Typography>
            <Typography>{m.features.description}</Typography>
          </Box>
          <Box className="features-grid">
            {m.features.items.map((feature, index) => (
              <Surface
                key={feature.title}
                variant="outlined"
                padding="comfortable"
                className={`feature-card ${featureStyles[index].color}`}
              >
                <Box className="feature-icon">{featureStyles[index].icon}</Box>
                <Typography component="h3" variant="h6">
                  {feature.title}
                </Typography>
                <Typography>{feature.description}</Typography>
              </Surface>
            ))}
          </Box>
        </Container>
      </Box>

      <Box component="footer" className="site-footer">
        <Container maxWidth="lg">
          <Box component="span">
            ↗ arrow
            <Box component="span" className="brand-accent">
              learn
            </Box>{" "}
            games
          </Box>
          <Box component="span">{m.footer}</Box>
        </Container>
      </Box>
    </Box>
  );
}
