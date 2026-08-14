# Contribuindo com o XRouter

Obrigado pelo interesse! Este é um projeto pessoal ([fork](./NOTICE.md) do
[9router](https://github.com/decolua/9router), MIT) mantido por
[@OTheMandaloriano](https://github.com/OTheMandaloriano).

## Ambiente de desenvolvimento

```bash
npm install
npm run dev      # dashboard em http://localhost:20127
npm run build    # build de produção
npm start        # inicia em produção
```

Requisitos: **Node.js 20+**.

## Fluxo de trabalho

1. Crie uma branch a partir de `main`: `git checkout -b feat/minha-mudanca`.
2. Faça mudanças pequenas e focadas (um objetivo por PR).
3. Rode o lint antes de commitar: `npx eslint .`.
4. Abra um Pull Request descrevendo **o quê** e **por quê**.

## Padrão de commits

- Mensagem em **português**, técnica e objetiva.
- Prefixo por tipo: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Uma mudança concluída = um commit.

## Rebrand gradual

Muitos identificadores internos ainda usam `9router` **de propósito** (data dir,
chaves de config, integração com clientes). Não faça *find-and-replace* global:
isso quebra login e integrações. A migração do interno é feita por etapas, com
cuidado. Veja o roadmap no [README](./README.md).
