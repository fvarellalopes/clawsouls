# COLLAB Setup — ClawSouls Avatar Generator

Este guia descreve como configurar e executar o gerador de avatares em lote no Google Colab.

## Pré-requisitos

- Conta Google com acesso ao Google Colab
- GPU T4 ou superior (alterar em: Runtime > Change runtime type > T4 GPU)

## Passo a passo

### 1. Abrir o Colab

Abra https://colab.research.google.com/ e crie um novo notebook.

### 2. Montar Google Drive (opcional, para acessar o repositório)

Na primeira célula do notebook:

```python
from google.colab import drive
drive.mount('/content/drive')
```

### 3. Instalar dependências

Crie uma célula e execute:

```python
!pip install -q diffusers transformers accelerate torch torchvision \
    pillow safetensors omegaconf sentencepiece protobuf
```

Isso instala as bibliotecas necessárias do PyTorch e Diffusers.

### 4. Fazer upload do script

Faça upload do arquivo `collab_batch_gen.py` para o ambiente Colab:

**Opção A — Upload direto:**
```python
from google.colab import files
uploaded = files.upload()  # Selecione collab_batch_gen.py
```

**Opção B — Clonar o repositório:**
```python
!git clone https://github.com/disconexo/clawsouls.git /content/clawsouls
%cd /content/clawsouls
```

### 5. Configurar variáveis de ambiente (opcional)

Se quiser carregar presets do arquivo TypeScript em vez dos hardcoded:

```python
import os
os.environ["PRESETS_SOURCE"] = "file"
os.environ["PRESETS_FILE"] = "/content/clawsouls/data/presets.ts"
# OU se montou o Drive:
# os.environ["PRESETS_FILE"] = "/content/drive/MyDrive/clawsouls/data/presets.ts"
```

### 6. Executar a geração

```python
%cd /content/clawsouls  # ou onde estiver o script
!python collab_batch_gen.py
```

O script vai:
- Carregar o modelo SDXL na GPU
- Gerar um avatar para cada preset (skip se já existir)
- Salvar em `/content/avatars/`
- Criar um `_manifest.json` com metadados
- Criar `/content/avatars.tar.gz` para download fácil

### 7. Baixar os avatares

```python
from google.colab import files
files.download('/content/avatars.tar.gz')
```

### 8. Copiar para o repositório

Descompacte `avatars.tar.gz` e copie o conteúdo para `public/avatars/` no repositório Clawsouls:

```bash
tar -xzf avatars.tar.gz -C /caminho/para/clawsouls/public/avatars/
```

### 9. Commitar

```bash
cd /caminho/para/clawsouls
git add public/avatars/
git commit -m "feat: add batch-generated SDXL avatars"
git push
```

## Personalização

### Gerar apenas personagens específicos

Editar `get_hardcoded_presets()` no script e comentar os que não quer gerar.

### Mudar resolução

Ajustar `DEFAULT_WIDTH` e `DEFAULT_HEIGHT` no script. Para SDXL: 512×768 (portrait) ou 768×512 (landscape).

### Mudar modelo

Alterar `MODEL_ID` no script. Exemplos:
- `"stabilityai/stable-diffusion-xl-base-1.0"` (padrão)
- `"stabilityai/stable-diffusion-xl-refiner-1.0"` (refinamento)

## Solução de problemas

| Erro | Solução |
|------|---------|
| `CUDA out of memory` | Reduzir `DEFAULT_WIDTH` para 384 ou usar `DEFAULT_STEPS = 15` |
| `No GPU available` | Verificar: Runtime > Change runtime type > T4 GPU |
| Modelo demora muito | É normal no primeiro carregamento (~5 min com T4) |
| Prompt em inglês | Os prompts são em inglês para melhor compatibilidade com SDXL |

## Notas

- A lista `KNOWN_AVATARS` em `lib/avatar.ts` deve ser atualizada após cada batch para refletir quais avatares existem.
- O `_manifest.json` gerado contém prompts e seeds para regeneração.
- Para gerar novos personagens, adicione entradas em `get_hardcoded_presets()`.