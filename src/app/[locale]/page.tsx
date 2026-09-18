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
import { LanguageSelector } from "./language-selector";

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
      <Box component="header" className="site-header">
        <Container maxWidth="lg" className="header-inner">
          <Box
            component="a"
            href={`/${locale}#inicio`}
            className="brand"
            aria-label={`Arrow Learn Games, ${m.nav.home.toLowerCase()}`}
          >
            <span className="brand-mark" aria-hidden="true">
              ↗
            </span>
            <span>
              arrow<span className="brand-accent">learn</span>
              <small>games</small>
            </span>
          </Box>
          <Box
            component="nav"
            aria-label={m.nav.navigation}
            className="navigation"
          >
            <a href="#como-funciona">{m.nav.how}</a>
            <a href="#proximamente">{m.nav.news}</a>
          </Box>
          <Box className="header-actions">
            <LanguageSelector locale={locale} label={m.nav.language} />
            <Button
              component="a"
              href="#proximamente"
              tone="primary"
              variant="contained"
              className="header-cta"
            >
              {m.nav.discover}
            </Button>
          </Box>
        </Container>
      </Box>

      <Box component="section" className="hero" aria-labelledby="hero-title">
        <Container maxWidth="lg" className="hero-inner">
          <Box className="hero-copy">
            <Box className="eyebrow">
              <AutoAwesomeRoundedIcon fontSize="small" /> {m.hero.eyebrow}
            </Box>
            <Typography component="h1" id="hero-title" className="hero-title">
              {m.hero.titleBefore}
              <span>{m.hero.titleAccent}</span>
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
                href="#como-funciona"
                tone="primary"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                {m.hero.primary}
              </Button>
              <Button
                component="a"
                href="#proximamente"
                tone="neutral"
                variant="outlined"
                size="large"
              >
                {m.hero.secondary}
              </Button>
            </Stack>
            <Box className="hero-note">
              <span className="note-stars">✦ ✦ ✦</span> {m.hero.note}
            </Box>
          </Box>
          <Box className="hero-art" aria-hidden="true">
            <span className="art-orbit orbit-one" />
            <span className="art-orbit orbit-two" />
            <span className="art-spark spark-one">✦</span>
            <span className="art-spark spark-two">✧</span>
            <span className="art-spark spark-three">✦</span>
            <div className="game-card game-card-back">
              <span>ABC</span>
              <strong>{m.art.letsGo}</strong>
              <small>{m.art.discover}</small>
            </div>
            <div className="game-card game-card-front">
              <span className="card-top">
                {m.art.newChallenge} <span>✦</span>
              </span>
              <strong>{m.art.play}</strong>
              <span className="puzzle-row">
                <i>★</i>
                <i>2</i>
                <i>↗</i>
              </span>
              <small>{m.art.adventure}</small>
            </div>
            <div className="floating-badge">
              +1 <span>{m.art.newIdea}</span>
            </div>
          </Box>
        </Container>
      </Box>

      <Box
        component="section"
        id="como-funciona"
        className="features-section"
        aria-labelledby="features-title"
      >
        <Container maxWidth="lg">
          <Box className="section-heading">
            <span className="section-kicker">{m.features.kicker}</span>
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

      <Box
        component="section"
        id="proximamente"
        className="coming-section"
        aria-labelledby="coming-title"
      >
        <Container maxWidth="lg">
          <Box className="coming-panel">
            <Box>
              <span className="section-kicker">{m.coming.kicker}</span>
              <Typography component="h2" id="coming-title">
                {m.coming.title}
              </Typography>
              <Typography>{m.coming.description}</Typography>
            </Box>
            <span className="coming-symbol" aria-hidden="true">
              ↗
            </span>
          </Box>
        </Container>
      </Box>

      <Box component="footer" className="site-footer">
        <Container maxWidth="lg">
          <span>
            ↗ arrow<span className="brand-accent">learn</span> games
          </span>
          <span>{m.footer}</span>
        </Container>
      </Box>
    </Box>
  );
}
