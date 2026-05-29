export type Lang = "en" | "es" | "pt" | "fr" | "de" | "it";

const supported: Lang[] = ["en", "es", "pt", "fr", "de", "it"];

export const translations: Record<Lang, {
  accentLabel: string;
  heroTitle: string;
  heroLine2: string;
  heroSubtitle: string;
  heroSubtitleLine2: string;
  navSignIn: string;
  navSignUp: string;
  placeholders: string[];
  modalSignUp: string;
  modalSignIn: string;
  modalSubSignUp: string;
  modalSubSignIn: string;
  googleBtn: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  submitSignUp: string;
  submitSignIn: string;
  privacyNote: string;
  checkEmail: string;
  errorGeneric: string;
  chatGreeting: string;
  chatEmpty: string;
  chatInputPlaceholder: string;
  chatError: string;
  chatSignOut: string;
  sendLabel: string;
}> = {
  en: {
    accentLabel: "your space",
    heroTitle: "a place to",
    heroLine2: "talk",
    heroSubtitle: "here you can speak freely —",
    heroSubtitleLine2: "I listen without judgment, without rush",
    navSignIn: "sign in",
    navSignUp: "create account",
    placeholders: [
      "what brings you here today?",
      "tell me, how are you feeling?",
      "is there something weighing on you lately?",
      "what's on your mind?",
      "how can I be with you today?",
    ],
    modalSignUp: "create account",
    modalSignIn: "sign in",
    modalSubSignUp: "create your space — free and confidential",
    modalSubSignIn: "continue from where you left off",
    googleBtn: "continue with Google",
    namePlaceholder: "what's your name?",
    emailPlaceholder: "email address",
    passwordPlaceholder: "password (min. 6 characters)",
    submitSignUp: "start",
    submitSignIn: "enter",
    privacyNote: "your conversations are private and confidential",
    checkEmail: "Check your email to confirm your account.",
    errorGeneric: "Something went wrong.",
    chatGreeting: "hi, {name}",
    chatEmpty: "tell me, how are you feeling today?",
    chatInputPlaceholder: "write here...",
    chatError: "sorry, I couldn't respond right now.",
    chatSignOut: "sign out",
    sendLabel: "Send",
  },
  es: {
    accentLabel: "tu espacio",
    heroTitle: "un lugar para",
    heroLine2: "conversar",
    heroSubtitle: "aquí puedes hablar libremente —",
    heroSubtitleLine2: "escucho sin juzgar, sin prisa",
    navSignIn: "iniciar sesión",
    navSignUp: "crear cuenta",
    placeholders: [
      "¿qué te trae por aquí hoy?",
      "cuéntame, ¿cómo te sientes?",
      "¿hay algo que te pesa últimamente?",
      "¿qué tienes en mente?",
      "¿en qué puedo acompañarte hoy?",
    ],
    modalSignUp: "crear cuenta",
    modalSignIn: "iniciar sesión",
    modalSubSignUp: "crea tu espacio — es gratis y confidencial",
    modalSubSignIn: "continúa desde donde lo dejaste",
    googleBtn: "continuar con Google",
    namePlaceholder: "¿cómo te llamas?",
    emailPlaceholder: "correo electrónico",
    passwordPlaceholder: "contraseña (mín. 6 caracteres)",
    submitSignUp: "empezar",
    submitSignIn: "entrar",
    privacyNote: "tus conversaciones son privadas y confidenciales",
    checkEmail: "Revisa tu correo para confirmar la cuenta.",
    errorGeneric: "Algo salió mal.",
    chatGreeting: "hola, {name}",
    chatEmpty: "cuéntame, ¿cómo te sientes hoy?",
    chatInputPlaceholder: "escribe aquí...",
    chatError: "lo siento, no pude responder ahora.",
    chatSignOut: "salir",
    sendLabel: "Enviar",
  },
  pt: {
    accentLabel: "seu espaço",
    heroTitle: "um lugar para",
    heroLine2: "conversar",
    heroSubtitle: "aqui você pode falar livremente —",
    heroSubtitleLine2: "ouço sem julgamentos, sem pressa",
    navSignIn: "entrar",
    navSignUp: "criar conta",
    placeholders: [
      "o que te traz aqui hoje?",
      "me conta, como você está se sentindo?",
      "há algo te pesando ultimamente?",
      "o que está passando pela sua cabeça?",
      "como posso te acompanhar hoje?",
    ],
    modalSignUp: "criar conta",
    modalSignIn: "entrar",
    modalSubSignUp: "crie seu espaço — gratuito e confidencial",
    modalSubSignIn: "continue de onde parou",
    googleBtn: "continuar com Google",
    namePlaceholder: "qual é o seu nome?",
    emailPlaceholder: "endereço de e-mail",
    passwordPlaceholder: "senha (mín. 6 caracteres)",
    submitSignUp: "começar",
    submitSignIn: "entrar",
    privacyNote: "suas conversas são privadas e confidenciais",
    checkEmail: "Verifique seu e-mail para confirmar a conta.",
    errorGeneric: "Algo deu errado.",
    chatGreeting: "olá, {name}",
    chatEmpty: "me conta, como você está se sentindo hoje?",
    chatInputPlaceholder: "escreva aqui...",
    chatError: "desculpe, não consegui responder agora.",
    chatSignOut: "sair",
    sendLabel: "Enviar",
  },
  fr: {
    accentLabel: "votre espace",
    heroTitle: "un endroit pour",
    heroLine2: "parler",
    heroSubtitle: "ici vous pouvez parler librement —",
    heroSubtitleLine2: "j'écoute sans jugement, sans hâte",
    navSignIn: "se connecter",
    navSignUp: "créer un compte",
    placeholders: [
      "qu'est-ce qui vous amène aujourd'hui ?",
      "dites-moi, comment vous sentez-vous ?",
      "y a-t-il quelque chose qui vous pèse ?",
      "qu'avez-vous en tête ?",
      "comment puis-je vous accompagner ?",
    ],
    modalSignUp: "créer un compte",
    modalSignIn: "se connecter",
    modalSubSignUp: "créez votre espace — gratuit et confidentiel",
    modalSubSignIn: "continuez là où vous vous étiez arrêté",
    googleBtn: "continuer avec Google",
    namePlaceholder: "comment vous appelez-vous ?",
    emailPlaceholder: "adresse e-mail",
    passwordPlaceholder: "mot de passe (min. 6 caractères)",
    submitSignUp: "commencer",
    submitSignIn: "entrer",
    privacyNote: "vos conversations sont privées et confidentielles",
    checkEmail: "Vérifiez votre e-mail pour confirmer votre compte.",
    errorGeneric: "Quelque chose s'est mal passé.",
    chatGreeting: "bonjour, {name}",
    chatEmpty: "dites-moi, comment vous sentez-vous aujourd'hui ?",
    chatInputPlaceholder: "écrivez ici...",
    chatError: "désolé, je n'ai pas pu répondre maintenant.",
    chatSignOut: "déconnexion",
    sendLabel: "Envoyer",
  },
  de: {
    accentLabel: "dein Raum",
    heroTitle: "ein Ort zum",
    heroLine2: "Reden",
    heroSubtitle: "hier kannst du frei sprechen —",
    heroSubtitleLine2: "ich höre ohne Urteile, ohne Eile",
    navSignIn: "anmelden",
    navSignUp: "Konto erstellen",
    placeholders: [
      "was bringt dich heute her?",
      "erzähl mir, wie fühlst du dich?",
      "gibt es etwas, das dich beschäftigt?",
      "was liegt dir auf dem Herzen?",
      "wie kann ich dich heute begleiten?",
    ],
    modalSignUp: "Konto erstellen",
    modalSignIn: "anmelden",
    modalSubSignUp: "erstelle deinen Raum — kostenlos und vertraulich",
    modalSubSignIn: "mach weiter, wo du aufgehört hast",
    googleBtn: "mit Google fortfahren",
    namePlaceholder: "wie heißt du?",
    emailPlaceholder: "E-Mail-Adresse",
    passwordPlaceholder: "Passwort (mind. 6 Zeichen)",
    submitSignUp: "loslegen",
    submitSignIn: "einloggen",
    privacyNote: "deine Gespräche sind privat und vertraulich",
    checkEmail: "Überprüfe deine E-Mail zur Bestätigung des Kontos.",
    errorGeneric: "Etwas ist schiefgelaufen.",
    chatGreeting: "hallo, {name}",
    chatEmpty: "erzähl mir, wie fühlst du dich heute?",
    chatInputPlaceholder: "schreib hier...",
    chatError: "entschuldigung, ich konnte gerade nicht antworten.",
    chatSignOut: "abmelden",
    sendLabel: "Senden",
  },
  it: {
    accentLabel: "il tuo spazio",
    heroTitle: "un luogo per",
    heroLine2: "parlare",
    heroSubtitle: "qui puoi parlare liberamente —",
    heroSubtitleLine2: "ascolto senza giudicare, senza fretta",
    navSignIn: "accedi",
    navSignUp: "crea account",
    placeholders: [
      "cosa ti porta qui oggi?",
      "raccontami, come ti senti?",
      "c'è qualcosa che ti pesa?",
      "cosa hai in mente?",
      "come posso accompagnarti oggi?",
    ],
    modalSignUp: "crea account",
    modalSignIn: "accedi",
    modalSubSignUp: "crea il tuo spazio — gratuito e riservato",
    modalSubSignIn: "continua da dove hai lasciato",
    googleBtn: "continua con Google",
    namePlaceholder: "come ti chiami?",
    emailPlaceholder: "indirizzo email",
    passwordPlaceholder: "password (min. 6 caratteri)",
    submitSignUp: "inizia",
    submitSignIn: "entra",
    privacyNote: "le tue conversazioni sono private e riservate",
    checkEmail: "Controlla la tua email per confermare l'account.",
    errorGeneric: "Qualcosa è andato storto.",
    chatGreeting: "ciao, {name}",
    chatEmpty: "raccontami, come ti senti oggi?",
    chatInputPlaceholder: "scrivi qui...",
    chatError: "scusa, non ho potuto rispondere adesso.",
    chatSignOut: "esci",
    sendLabel: "Invia",
  },
};

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const code = navigator.language.split("-")[0].toLowerCase() as Lang;
  return supported.includes(code) ? code : "en";
}

export function getT(lang: Lang) {
  return translations[lang] ?? translations.en;
}
