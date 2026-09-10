// Free OpenCode models that don't use the "-free" id suffix
const KNOWN_FREE_OPENCODE_MODELS = ["big-pickle"];

export const FILTERS = {
  "openrouter-free": (models) =>
    models
      .filter(
        (m) =>
          m.pricing?.prompt === "0" &&
          m.pricing?.completion === "0" &&
          m.context_length >= 200000
      )
      .map((m) => ({ id: m.id, name: m.name, contextLength: m.context_length }))
      .sort((a, b) => b.contextLength - a.contextLength),

  "openrouter-openai": (models) =>
    (Array.isArray(models) ? models : [])
      .filter((m) => typeof m.id === "string" && m.id.startsWith("openai/") && !m.id.endsWith(":batch"))
      .map((m) => {
        const id = m.id.replace(/^openai\//, "");
        const name = (m.name || id).replace(/^OpenAI:\s*/i, "");
        return { id, name, contextLength: m.context_length };
      }),

  "openrouter-codex": (models) =>
    (Array.isArray(models) ? models : [])
      .filter((m) => typeof m.id === "string" && m.id.startsWith("openai/") && !m.id.endsWith(":batch"))
      .map((m) => {
        const id = m.id.replace(/^openai\//, "");
        const name = (m.name || id).replace(/^OpenAI:\s*/i, "");
        return { id, name, contextLength: m.context_length };
      })
      .filter((m) => m.id.startsWith("gpt-6") || m.id.startsWith("gpt-5") || m.id.startsWith("o3") || m.id.startsWith("o4") || m.id.startsWith("o1")),

  "openai": (models) =>
    (Array.isArray(models) ? models : [])
      .map((m) => ({ id: m.id, name: m.name || m.id, contextLength: m.context_length })),

  "opencode-free": (models) =>
    models
      .filter((m) => m.id?.endsWith("-free") || KNOWN_FREE_OPENCODE_MODELS.includes(m.id))
      .map((m) => ({ id: m.id, name: m.id })),

  "opencode-zen": (models) =>
    (Array.isArray(models) ? models : [])
      .map((m) => ({ id: m.id, name: m.name || m.id })),

  // models.dev returns a large catalog; keep only mimo models
  "mimo-free": (models) =>
    (Array.isArray(models) ? models : [])
      .filter((m) => m.id?.startsWith("mimo") || m.name?.toLowerCase().includes("mimo"))
      .map((m) => ({ id: m.id, name: m.name || m.id })),

  "orcarouter-free": (models) =>
    (Array.isArray(models) ? models : [])
      .filter((m) => typeof m.id === "string" && (m.id.endsWith("-free") || m.id.endsWith(":free") || m.id === "orcarouter/free" || m.id.startsWith("orcarouter/fusion") || m.id === "orcarouter/auto"))
      .map((m) => ({ id: m.id, name: m.id })),
};
