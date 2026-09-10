export default {
  id: "opencode-zen",
  priority: 45,
  hasFree: true,
  alias: "zen",
  aliases: [
    "opencode-zen",
    "ocz",
  ],
  uiAlias: "zen",
  display: {
    name: "OpenCode Zen",
    icon: "terminal",
    color: "#E87040",
    textIcon: "ZEN",
    website: "https://opencode.ai/auth",
    notice: {
      text: "OpenCode Zen Gateway: Modelos curados e verificados com suporte a modelos gratuitos e chaves de API.",
      apiKeyUrl: "https://opencode.ai/auth",
    },
  },
  category: "freeTier",
  authType: "apikey",
  authModes: ["apikey"],
  transport: {
    baseUrl: "https://opencode.ai",
    headers: {
      "x-opencode-client": "desktop",
    },
    auth: { combined: true, header: "Authorization", scheme: "bearer" },
  },
  models: [
    { id: "big-pickle", name: "Big Pickle (MiMo)" },
    { id: "deepseek-v4-flash-free", name: "DeepSeek V4 Flash (Free)" },
    { id: "mimo-v2.5-free", name: "MiMo V2.5 (Free)" },
    { id: "nemotron-3-ultra-free", name: "Nemotron 3 Ultra (Free)" },
    { id: "nemotron-3.5-lightning-free", name: "Nemotron 3.5 Lightning (Free)" },
    { id: "ling-3.0-flash-fin-free", name: "Ling 3.0 Flash Fin (Free)" },
    { id: "muse-spark-1.3-contributor-free", name: "Muse Spark 1.3 Contributor (Free)" },
    { id: "muse-spark-1.2-contributor-free", name: "Muse Spark 1.2 Contributor (Free)" },
  ],
  modelsFetcher: { url: "https://opencode.ai/zen/v1/models", type: "opencode-zen" },
  passthroughModels: true,
};
