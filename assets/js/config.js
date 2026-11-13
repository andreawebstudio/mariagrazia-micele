/*
 * CONFIGURAZIONE DEL SITO — Mariagrazia Micele, Osteopata D.O.
 * ------------------------------------------------------------------
 * MODULO CONTATTI
 * Il form invia i dati via POST (JSON) all'endpoint indicato.
 * Opzione A — Formspree: crea un modulo su formspree.io e incolla qui
 *   l'URL, es. "https://formspree.io/f/abcdwxyz". accessKey: "".
 * Opzione B — Web3Forms: endpoint "https://api.web3forms.com/submit"
 *   e accessKey = la chiave ricevuta via email da web3forms.com.
 * Finché endpoint è vuoto il modulo NON simula invii: mostra un
 * messaggio che invita a scrivere via email o telefono.
 */
window.SITE_CONFIG = {
  form: {
    endpoint: "",
    accessKey: "",
    oggetto: "Nuova richiesta dal sito — Mariagrazia Micele Osteopata D.O."
  }
};
