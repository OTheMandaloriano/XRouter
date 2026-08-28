export default {
  id: "inferx",
  priority: 45,
  hasFree: true,
  alias: "ix",
  uiAlias: "ix",
  display: {
    name: "InferX",
    icon: "memory",
    color: "#7C3AED",
    textIcon: "IX",
    website: "https://model.inferx.net",
    notice: {
      text: "Modelos self-hosted (Devstral, Qwen3 Coder/Instruct). Precisa de conta + API key em model.inferx.net.",
      apiKeyUrl: "https://model.inferx.net/login",
    },
  },
  category: "apikey",
  authType: "apikey",
  authModes: ["apikey"],
  transport: {
    baseUrl: "https://model.inferx.net/v1/chat/completions",
    thinkingFormat: "openai",
  },
  models: [
    { id: "Devstral-2-123B-Instruct-2512-int4-AutoRound", name: "Devstral 2 123B Instruct" },
    { id: "Qwen3-Coder-Next-FP8", name: "Qwen3 Coder Next" },
    { id: "Qwen3.6-35B-A3B-FP8", name: "Qwen3.6 35B A3B" },
    { id: "Qwen3.8-27B-FP8", name: "Qwen3.8 27B" },
  ],
  serviceKinds: ["llm"],
};