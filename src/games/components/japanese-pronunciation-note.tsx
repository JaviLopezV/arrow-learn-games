import { Alert } from "@jlopvil/mui-kit";
import type { Locale } from "@/i18n/messages";

const notes: Record<Locale, string> = {
  es: "Japonés: lee y escribe la pronunciación aproximada con letras españolas (gato → neko, conejo → usagui). También se acepta la escritura japonesa. La r es suave, como en «cara»; gui suena como en «guitarra»; j representa una aspiración suave; ll aproxima el sonido de «yo» y sh es el sonido de pedir silencio. Las vocales dobles se alargan y las consonantes dobles llevan una breve pausa. El audio usa la pronunciación japonesa original. Los pronombres se muestran para practicar, aunque suelen omitirse en japonés; anata no es una fórmula general de trato formal.",
  ca: "Japonès: llegeix i escriu la pronunciació aproximada amb lletres de l’alfabet espanyol (gat → neko, conill → usagui). També s’accepta l’escriptura japonesa. La r és suau, com a «cara»; gui com a «guitarra»; j indica una aspiració suau; ll aproxima el so castellà de «yo» i sh és el so de demanar silenci. Allarga les vocals dobles i fes una pausa breu amb les consonants dobles. L’àudio fa servir la pronunciació japonesa original. Els pronoms es mostren per practicar, però sovint s’ometen; anata no és una fórmula general de tractament formal.",
  en: "Japanese: read and type approximate pronunciation using Spanish letters (cat → neko, rabbit → usagui). Japanese writing is also accepted. Use a soft r as in Spanish «cara», gui as in «guitarra», j for a gentle breath, ll approximately like Spanish «yo», and sh as in asking for silence. Hold doubled vowels longer and pause briefly for doubled consonants. Audio uses original Japanese pronunciation. Pronouns are shown for practice but are often omitted in Japanese; anata is not a general formal form of address.",
};

export function JapanesePronunciationNote({ locale }: { locale: Locale }) {
  return (
    <Alert severity="info" sx={{ mt: 2 }}>
      {notes[locale]}
    </Alert>
  );
}
