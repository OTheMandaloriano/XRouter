# Changelog

Todas as mudanças relevantes do **XRouter** serão documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [1.0.0] - 2026-08-14

Primeira release oficial do **XRouter** — o fork parte da última versão do 9router e passa a ter versionamento próprio a partir daqui.

### Adicionado
- Fork inicial do [9router](https://github.com/decolua/9router) como **XRouter**, projeto pessoal.
- README, NOTICE e CHANGELOG próprios; metadados do `package.json` (nome, autor, licença, repositório, keywords).
- Arquivos de *community standards*: `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, templates de issue e pull request.
- Workflow de CI para publicar a imagem Docker no **GHCR** (`.github/workflows/docker-ghcr.yml`).
- Labels OCI (`title`, `description`, `source`, `licenses`) na imagem Docker.

### Mantido
- Estrutura e identificadores internos do 9router preservados (compatibilidade total com configurações/login existentes). A personalização do interno será feita gradualmente.

### Removido
- Workflows de CI que publicavam para os serviços do upstream (Docker Hub / GitBook).

---

> Base: 9router **0.5.55** (github.com/decolua/9router, MIT). Histórico do upstream em [CHANGELOG.upstream.md](./CHANGELOG.upstream.md).
