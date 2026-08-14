# Política de Segurança

## Versões suportadas

| Versão | Suportada |
| ------ | --------- |
| 1.0.x  | ✅        |
| < 1.0  | ❌        |

## Reportando uma vulnerabilidade

**Não** abra uma *issue* pública para falhas de segurança.

Use os **GitHub Security Advisories** deste repositório
(aba **Security → Report a vulnerability**) para reportar de forma privada.
O relato será avaliado assim que possível.

## Boas práticas

- Segredos (chaves de API, tokens, `.env`) **nunca** devem ser versionados —
  o `.gitignore` já cobre `.env*`, `data/` e `*.pem`.
- Os dados sensíveis do runtime ficam **fora do repositório**, no diretório de
  dados do usuário.
- O servidor deve escutar apenas em **loopback** (`127.0.0.1`) em uso local.
