<div align="center">

# XRouter

**Seu gateway de IA pessoal.** Conecte Claude Code, Codex, Cursor, Cline, Copilot e outras ferramentas a dezenas de provedores de IA com *fallback* automático, economia de tokens e um painel web para gerenciar tudo.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)]()

</div>

---

## Sobre

**XRouter** é um roteador/proxy de IA que fica entre as suas ferramentas de desenvolvimento e os provedores de modelos (Claude, GPT, Gemini e afins). Ele traduz formatos de API, faz balanceamento entre contas, aplica *fallback* inteligente e ainda comprime saídas de ferramentas para gastar menos tokens — tudo controlado por um dashboard web local.

Este é um **projeto pessoal**, mantido e personalizado por [@OTheMandaloriano](https://github.com/OTheMandaloriano). É um *fork* do excelente [9router](https://github.com/decolua/9router) (MIT), que está sendo adaptado gradualmente ao meu fluxo de trabalho. Veja os créditos em [NOTICE.md](./NOTICE.md).

## Recursos

- 🔀 **Fallback em camadas** — assinatura → barato → grátis, com troca automática quando uma conta esgota a cota.
- 🧠 **RTK Token Saver** — comprime saídas de ferramentas e reduz tokens de entrada (~20–40%).
- 🔌 **Tradução de formatos** — OpenAI ⇄ Claude ⇄ Gemini e outros.
- 📊 **Cotas em tempo real** — acompanha consumo e contagem de reset por conta.
- 👥 **Múltiplas contas** — balanceia carga entre várias contas do mesmo provedor.
- 🖥️ **Painel web** — configuração e monitoramento via navegador (local, loopback).

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · SQLite · OAuth 2.0 (PKCE) + JWT + API Keys · Node.js 20+

## Começando

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento (dashboard em http://localhost:20127)
npm run dev

# build de produção
npm run build

# iniciar em produção
npm start
```

> Os dados (banco SQLite, chaves, logs) ficam **fora do repositório**, no diretório de dados do usuário. Nenhum segredo é versionado — `.env*` está no `.gitignore`.

## Roadmap (personalização gradual)

- [ ] Rebrand da interface (título, landing, textos) de 9Router → XRouter
- [ ] Migração dos identificadores internos e do diretório de dados
- [ ] Ajustes de provedores/rotas ao meu gosto
- [ ] CI próprio (lint + build)

## Créditos

XRouter é um *fork* personalizado de **[9router](https://github.com/decolua/9router)** por *decolua and contributors*, usado sob a **Licença MIT**. Todo o crédito pela base original vai para os autores do 9router. As modificações deste repositório são de [@OTheMandaloriano](https://github.com/OTheMandaloriano).

## Licença

[MIT](./LICENSE) — mantida do projeto original, conforme exige a licença.
