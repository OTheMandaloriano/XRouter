export default {
  id: "orcarouter",
  priority: 40,
  hasFree: true,
  alias: "orca",
  uiAlias: "orca",
  display: {
    name: "OrcaRouter",
    icon: "router",
    color: "#0EA5E9",
    textIcon: "ORC",
    website: "https://www.orcarouter.ai",
    notice: {
      text: "200+ modelos atras de uma API. Modelos free (deepseek-v4-flash-free, qwen3.8-27b-free, hy3-free) precisam de conta gratis + API key.",
      apiKeyUrl: "https://www.orcarouter.ai/console",
    },
  },
  category: "freeTier",
  authType: "apikey",
  authModes: ["apikey"],
  transport: {
    baseUrl: "https://api.orcarouter.ai/v1/chat/completions",
    thinkingFormat: "openai",
  },
  models: [
    { id: "orcarouter/free", name: "OrcaRouter Free (auto)" },
    { id: "deepseek/deepseek-v4-flash-free", name: "DeepSeek V4 Flash (Free)" },
    { id: "qwen/qwen3.8-27b-free", name: "Qwen 3.8 27B (Free)" },
    { id: "tencent/hy3-free", name: "Tencent HY3 (Free)" },
  ],
  modelsFetcher: { url: "https://api.orcarouter.ai/v1/models", type: "orcarouter-free" },
  passthroughModels: true,
};