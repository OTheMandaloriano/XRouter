# Model & Client Configurations for XRouter

Este diretório contém templates prontos e documentados para integrar o **XRouter** aos seus editores e ferramentas de desenvolvimento de IA favoritos.

---

## 📂 Conteúdo

* **[`opencode/opencode.jsonc`](./opencode/opencode.jsonc)**: Configuração completa para o [OpenCode](https://opencode.ai/) com 40 modelos categorizados e 6 combos de roteamento automático com fallback.

---

## ⚡ Como Usar no OpenCode

1. Inicie o XRouter localmente (por padrão rodando em `http://localhost:20127`).
2. Obtenha sua API Key no painel do XRouter em `http://localhost:20127/dashboard/api-keys`.
3. Copie o arquivo [`opencode/opencode.jsonc`](./opencode/opencode.jsonc) para a pasta de configuração do seu OpenCode:
   * **Windows**: `%USERPROFILE%\.config\opencode\opencode.jsonc`
   * **Linux/macOS**: `~/.config/opencode/opencode.jsonc`
4. Substitua a chave `"apiKey": "sk-sua-chave-xrouter-aqui"` pela sua chave gerada no XRouter.
5. Reinicie o OpenCode.

---

## 🧠 Suporte ao Seletor de Reasoning Effort (Pensamento)

O OpenCode possui um seletor visual nativo de esforço de raciocínio no rodapé do editor:
* **Default**: Deixa o modelo decidir o tamanho do pensamento.
* **Minimal**: Raciocínio rápido (~1.024 tokens) para respostas com baixa latência.
* **Low**: Raciocínio leve (~4.096 tokens) para edições simples.
* **Medium**: Equilíbrio padrão (~8.192 tokens).
* **High**: Raciocínio aprofundado (~16.384 tokens) para debug de código difícil.
* **Xhigh**: Pensamento máximo (~32.000 a 64.000 tokens) para grandes arquiteturas e planejamento.

O XRouter traduz automaticamente o nível de esforço selecionado para cada provedor upstream:
* **Claude**: Converte para `thinking: { type: "enabled", budget_tokens: N }`.
* **Gemini**: Converte para `thinkingConfig: { thinkingBudget: N }`.
* **DeepSeek / OpenAI**: Repassa `reasoning_effort: "..."`.
* **Modelos rápidos**: Remove o cabeçalho com segurança para evitar erros 400.

---

## 🎯 Categorias Disponíveis no Menu do OpenCode

Ao abrir o seletor de modelos no OpenCode, você pode pesquisar diretamente pelo prefixo da categoria:

1. **`[Combo]`**: Roteadores automáticos com fallback em cascata (se o 1º modelo falhar por quota ou lentidão, o 2º assume instantaneamente).
2. **`[Antigravity]`**: Modelos Claude 3.7/Opus e Gemini 3.8/3.7/3.6/3.1 de alta performance.
3. **`[OpenCode Zen]`**: Modelos 100% gratuitos do Zen (Ling 3.0, Nemotron Lightning/Ultra, Big Pickle, MiMo 2.5).
4. **`[OrcaRouter]`**: Modelos gratuitos do OrcaRouter (DeepSeek V4 Flash Free, GLM 5.3 Flash, HY3).
5. **`[InferX]`**: Modelos especializados em código (DeepSeek V4.1, Devstral 2 123B, Qwen3 Coder Next).
6. **`[KiloCode]` & `[OpenRouter]`**: Modelos gratuitos complementares.
