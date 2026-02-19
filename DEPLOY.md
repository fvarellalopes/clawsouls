# 🚀 Deploy ClawSouls to IPFS (Storacha)

## Visão Geral

O deploy agora é feito via **IPFS** usando **Storacha** para armazenamento e Pinata para pin redundante.

## Prerequisites

- GitHub repository: https://github.com/ClawdAI2-brazil/clawsouls
- Conta Storacha (https://storacha.network)
- Conta Pinata (https://pinata.cloud) - opcional para redundância

## Configuração

### 1. Configure Storacha

```bash
# Instalar Storacha CLI
npm install -g @storacha/cli

# Login
storacha login

# Criar space (equivalente a bucket S3)
storacha space create clawsouls

# Criar signing key
storacha key create --json > storacha-key.json

# Criar UCAN proof
storacha delegation create <DID_DO_KEY> -c space/blob/add -c space/index/add -c filecoin/offer -c upload/add --base64 > storacha-proof.json
```

### 2. Configure GitHub Secrets

No repo GitHub, vá em **Settings → Secrets and variables → Actions** e adicione:

| Secret | Valor |
|--------|-------|
| `STORACHA_KEY` | Conteúdo do campo `base64` do arquivo `storacha-key.json` |
| `STORACHA_PROOF` | Conteúdo do arquivo `storacha-proof.json` (string base64) |
| `PINATA_JWT` | JWT da API Pinata (opcional) |

### 3. Obter credenciais Storacha via web

Alternativamente, você pode obter as credenciais em:
- https://dash.storacha.network/

## Deploy

O deploy é automático:

- **Push para `main`** → Production deploy
- **Pull Request** → Preview deploy com comentário no PR

## Verificação

Após o deploy, você verá:
- CID do IPFS nos logs do GitHub Action
- Comentário no PR com links de acesso

### Acessar o site

```
Gateway: https://ipfs.io/ipfs/<CID>
Storacha: https://w3s.link/ipfs/<CID>
Dweb: https://dweb.link/ipfs/<CID>
```

### DNS (Opcional)

Para domínio próprio via IPNS, configure:
```bash
# Publicar IPNS
storacha name publish <CID>

# Configurar DNS CNAME para gateway
```

## Estrutura do Workflow

O workflow está em `.github/workflows/deploy-to-ipfs.yml`:

```yaml
# Build automático
npm run build

# Deploy para IPFS
ipshipyard/ipfs-deploy-action@v1
```

## Troubleshooting

**Action falha na autenticação**: Verifique se `STORACHA_KEY` e `STORACHA_PROOF` estão válidos.

**CID não aparece**: Aguarde ~30s para o IPFS propagar.

**Preview não funciona**: Alguns gateways IPFS podem demorar para replicar.

## Monitoramento

- GitHub Actions → workflows → deploy-to-ipfs
- Logs do GitHub Action mostram o CID e links

## FAQ

### IPFS é permanente?
Sim, uma vez feito o pin, o conteúdo fica disponível desde que alguém mantenha o pin.

### Posso usar domínio próprio?
Sim, via IPNS ou configurando um gateway próprio.

### E se Storacha sair do ar?
O conteúdo está pinado em Pinata (se configurado), então há redundância.

---

**Nota**: Este projeto usa build estático com `output: 'export'` no Next.js. O diretório de saída é `./dist`, não `.next`.
