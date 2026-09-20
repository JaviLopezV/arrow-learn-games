"use client";

import { useEffect, useRef, useState } from "react";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import type { Locale } from "@/i18n/messages";

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const copy = {
  es: {
    button: "Instalar app",
    title: "Llévate el aprendizaje contigo",
    text: "Abre esta página en Safari, pulsa Compartir y elige «Añadir a la pantalla de inicio». Activa «Abrir como app» si aparece y pulsa Añadir.",
    close: "Entendido",
  },
  ca: {
    button: "Instal·la l’app",
    title: "Emporta’t l’aprenentatge",
    text: "Obre aquesta pàgina a Safari, prem Compartir i tria «Afegir a la pantalla d’inici». Activa «Obrir com a app» si apareix i prem Afegir.",
    close: "Entesos",
  },
  en: {
    button: "Install app",
    title: "Take learning with you",
    text: "Open this page in Safari, tap Share and choose “Add to Home Screen”. Enable “Open as Web App” if shown, then tap Add.",
    close: "Got it",
  },
};

export function InstallApp({ locale }: { locale: Locale }) {
  const prompt = useRef<InstallPrompt | null>(null);
  const [available, setAvailable] = useState(false);
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);
  const m = copy[locale];

  useEffect(() => {
    const display = window.matchMedia("(display-mode: standalone)");
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const installed = () =>
      display.matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const update = () => {
      setAvailable(!installed() && (ios || Boolean(prompt.current)));
      if (installed()) setHelp(false);
    };
    const onPrompt = (event: Event) => {
      event.preventDefault();
      prompt.current = event as InstallPrompt;
      update();
    };
    const onInstalled = () => {
      prompt.current = null;
      setAvailable(false);
      setHelp(false);
    };
    update();
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    display.addEventListener("change", update);
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
        console.error("Service worker registration failed", error);
      });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      display.removeEventListener("change", update);
    };
  }, []);

  async function install() {
    const pending = prompt.current;
    if (!pending) {
      setHelp(true);
      return;
    }
    setBusy(true);
    try {
      await pending.prompt();
      await pending.userChoice;
    } catch {
      // A consumed prompt cannot be reused; wait for the browser's next event.
    } finally {
      prompt.current = null;
      setAvailable(false);
      setBusy(false);
    }
  }

  if (!available) return null;
  return (
    <>
      <button className="install-app-button" onClick={install} disabled={busy}>
        <DownloadRounded fontSize="small" aria-hidden="true" />
        <span>{m.button}</span>
      </button>
      <Dialog
        open={help}
        onClose={() => setHelp(false)}
        aria-labelledby="install-title"
        slotProps={{ paper: { sx: { borderRadius: 5, p: 1, maxWidth: 420 } } }}
      >
        <DialogTitle id="install-title">{m.title}</DialogTitle>
        <DialogContent>
          <p className="install-help">{m.text}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelp(false)}>{m.close}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
