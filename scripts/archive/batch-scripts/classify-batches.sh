#!/bin/bash
# Classify presets via gateway using curl
# Each batch: 10 characters, saves to /tmp/llm_batch_N.json

GATEWAY="https://opengateway.gitlawb.com/v1/chat/completions"
TOKEN="${GATEWAY_TOKEN}"
RESULTS_DIR="/tmp/llm_batches"
mkdir -p "$RESULTS_DIR"

# Categories
CATS='["masculino","feminino","robo","animal","divindade","ficção","histórico","mitológico","contemporâneo","calmo","agressivo","sarcástico","otimista","sombrio","energético","trabalho","lifestyle","escrita","educação","tecnologia","ciência","arte","negócios","saúde","segurança","engenharia","marvel","dc","anime","videogame","HQ","filme","herói","vilão","anti-herói","mentor","líder","companheiro","cantor","artista","escritor","cientista","guerreiro"]'

SYSTEM_MSG="Classify each character into 1-6 categories from this list ONLY:
$CATS

RULES:
- Deadpool=anti-herói+marvel+filme+sarcástico+masculino (NOT herói)
- Adele=cantor+feminino+contemporâneo+arte
- Wolverine=anti-herói+marvel+masculino+agressivo
- Punisher=anti-herói+marvel+masculino+segurança
- Catwoman=anti-herói+dc+feminino
- Beyonce=cantor+feminino+contemporâneo+arte
- Britney Spears=cantor+feminino+contemporâneo+arte
- For real people (singers, actors): add contemporâneo
- For anime characters: add anime
- For DC characters: add dc
- For Marvel characters: add marvel
- For video game characters: add videogame

Return ONLY a JSON dict mapping id to array of categories. Nothing else."

# Read presets file and create batches
python3 -c "
import json, sys
with open('/tmp/presets_for_llm.json') as f:
    presets = json.load(f)
batch_size = 10
for i in range(0, len(presets), batch_size):
    batch = presets[i:i+batch_size]
    lines = []
    for p in batch:
        lines.append(f\"- {p['id']}: {p['name']} | {p['creature']} | {p['desc'][:120]}\")
    print(json.dumps({'batch_num': i//batch_size + 1, 'chars': '\n'.join(lines)}))
" | while IFS= read -r line; do
    BATCH_NUM=$(echo "$line" | python3 -c "import sys,json; print(json.load(sys.stdin)['batch_num'])")
    CHARS=$(echo "$line" | python3 -c "import sys,json; print(json.load(sys.stdin)['chars'])")
    OUTFILE="$RESULTS_DIR/batch_${BATCH_NUM}.json"
    
    # Skip if already done
    if [ -f "$OUTFILE" ] && [ -s "$OUTFILE" ]; then
        echo "Batch $BATCH_NUM: already done, skipping"
        continue
    fi
    
    echo "Batch $BATCH_NUM: sending..."
    
    USER_MSG="Classify. Return ONLY JSON dict:
$CHARS"
    
    # Escape for JSON
    ESCAPED_SYSTEM=$(echo "$SYSTEM_MSG" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))")
    ESCAPED_USER=$(echo "$USER_MSG" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))")
    
    PAYLOAD="{\"model\":\"mimo-v2.5-pro\",\"messages\":[{\"role\":\"system\",\"content\":$ESCAPED_SYSTEM},{\"role\":\"user\",\"content\":$ESCAPED_USER}],\"max_tokens\":3000,\"temperature\":0.1}"
    
    curl -s --max-time 300 "$GATEWAY" \
        -H "authorization: Bearer $TOKEN" \
        -H "content-type: application/json" \
        -d "$PAYLOAD" > "$OUTFILE" 2>/dev/null
    
    if [ $? -eq 0 ] && [ -s "$OUTFILE" ]; then
        echo "Batch $BATCH_NUM: OK ($(wc -c < "$OUTFILE") bytes)"
    else
        echo "Batch $BATCH_NUM: FAILED"
        rm -f "$OUTFILE"
    fi
    
    sleep 2
done

echo "=== All batches done ==="
echo "Results in $RESULTS_DIR"
