// Centralized locale display flags (shared across UI components)
export const LOCALE_FLAGS = {
  "en": "🇺🇸",
  "vi": "🇻🇳",
  "zh-CN": "🇨🇳",
  "zh-TW": "🇹🇼",
  "ja": "🇯🇵",
  "pt-BR": "🇧🇷",
  "pt-PT": "🇵🇹",
  "ko": "🇰🇷",
  "es": "🇪🇸",
  "de": "🇩🇪",
  "fr": "🇫🇷",
  "he": "🇮🇱",
  "ar": "🇸🇦",
  "ru": "🇷🇺",
  "pl": "🇵🇱",
  "cs": "🇨🇿",
  "nl": "🇳🇱",
  "tr": "🇹🇷",
  "uk": "🇺🇦",
  "tl": "🇵🇭",
  "id": "🇮🇩",
  "th": "🇹🇭",
  "km": "🇰🇭",
  "hi": "🇮🇳",
  "bn": "🇧🇩",
  "ur": "🇵🇰",
  "ro": "🇷🇴",
  "sv": "🇸🇪",
  "it": "🇮🇹",
  "el": "🇬🇷",
  "hu": "🇭🇺",
  "fi": "🇫🇮",
  "da": "🇩🇰",
  "no": "🇳🇴",
  "fa": "🇮🇷",
};

// Codigos de pais (ISO 3166-1 alpha-2, minusculo) para o flag-icons (lipis/flag-icons).
// Emoji de bandeira NAO renderiza no Windows -> usamos SVG via classe `fi fi-<code>`.
export const LOCALE_COUNTRY = {
  "en": "us", "vi": "vn", "zh-CN": "cn", "zh-TW": "tw", "ja": "jp",
  "pt-BR": "br", "pt-PT": "pt", "ko": "kr", "es": "es", "de": "de",
  "fr": "fr", "he": "il", "ar": "sa", "ru": "ru", "pl": "pl",
  "cs": "cz", "nl": "nl", "tr": "tr", "uk": "ua", "tl": "ph",
  "id": "id", "th": "th", "km": "kh", "hi": "in", "bn": "bd",
  "ur": "pk", "ro": "ro", "sv": "se", "it": "it", "el": "gr",
  "hu": "hu", "fi": "fi", "da": "dk", "no": "no", "fa": "ir",
};

// Nomes de exibicao dos idiomas (usados fora do modal, ex.: pagina de perfil).
export const LOCALE_NAMES = {
  "en": "English", "vi": "Tiếng Việt", "zh-CN": "简体中文", "zh-TW": "繁體中文",
  "ja": "日本語", "pt-BR": "Português (Brasil)", "pt-PT": "Português (Portugal)",
  "ko": "한국어", "es": "Español", "de": "Deutsch", "fr": "Français",
  "he": "עברית", "ar": "العربية", "ru": "Русский", "pl": "Polski",
  "cs": "Čeština", "nl": "Nederlands", "tr": "Türkçe", "uk": "Українська",
  "tl": "Tagalog", "id": "Indonesia", "th": "ไทย", "km": "ខ្មែរ",
  "hi": "हिन्दी", "bn": "বাংলা", "ur": "اردو", "ro": "Română",
  "sv": "Svenska", "it": "Italiano", "el": "Ελληνικά", "hu": "Magyar",
  "fi": "Suomi", "da": "Dansk", "no": "Norsk", "fa": "فارسی",
};
