#!/usr/bin/env python3
"""Classify ALL 509 ClawSouls presets via LLM gateway."""
import json, os, urllib.request, sys, time, re

GATEWAY = "https://opengateway.gitlawb.com/v1/chat/completions"
TOKEN = os.environ.get("GATEWAY_TOKEN", "")

CATEGORIES = [
    "masculino", "feminino", "robo", "animal", "divindade",
    "ficção", "histórico", "mitológico", "contemporâneo",
    "calmo", "agressivo", "sarcástico", "otimista", "sombrio", "energético",
    "trabalho", "lifestyle", "escrita", "educação",
    "tecnologia", "ciência", "arte", "negócios", "saúde", "segurança", "engenharia",
    "marvel", "dc", "anime", "videogame", "HQ", "filme",
    "herói", "vilão", "anti-herói", "mentor", "líder", "companheiro",
    "cantor", "artista", "escritor", "cientista", "guerreiro",
]

SYSTEM = """You are a character classifier. Assign 1-6 categories to each character from this EXACT list:
""" + json.dumps(CATEGORIES) + """

RULES:
- Deadpool = anti-herói + marvel + filme + sarcástico + masculino (NOT herói)
- Adele = cantor + feminino + contemporâneo + arte
- Wolverine = anti-herói + marvel + masculino + agressivo (anti-hero, not hero)
- Punisher = anti-herói + marvel + masculino + agressivo + segurança
- Catwoman = anti-herói + dc + feminino
- Use ONLY listed categories. Be precise.

Return ONLY a JSON dictionary mapping character id → array of categories. Nothing else."""


def classify_batch(batch, batch_num):
    chars = []
    for p in batch:
        chars.append(f"- {p['id']}: {p['name']} | {p['creature']} | {p['desc'][:150]}")
    
    user_msg = "Classify. Return ONLY JSON:\n\n" + "\n".join(chars)
    
    payload = json.dumps({
        "model": "mimo-v2.5-pro",
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user_msg}
        ],
        "max_tokens": 8000,
        "temperature": 0.1,
    }).encode()
    
    req = urllib.request.Request(GATEWAY, data=payload, method="POST", headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
    })
    
    try:
        resp = urllib.request.urlopen(req, timeout=300)
        result = json.loads(resp.read())
        msg = result["choices"][0]["message"]
        text = (msg.get("content") or "") + (msg.get("reasoning") or "")
        
        # Find JSON blocks
        json_blocks = re.findall(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text)
        for jb in reversed(json_blocks):
            try:
                data = json.loads(jb)
                if len(data) >= len(batch) * 0.5:  # At least half the batch
                    return data
            except:
                continue
        
        # Try nested JSON
        for jb in reversed(json_blocks):
            try:
                data = json.loads(jb)
                if len(data) >= 3:
                    return data
            except:
                continue
        
        print(f"  WARN: no valid JSON found in batch {batch_num}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  ERROR batch {batch_num}: {e}", file=sys.stderr)
        return None


def main():
    with open('/tmp/presets_for_llm.json', 'r') as f:
        presets = json.load(f)
    
    batch_size = 50
    batches = [presets[i:i+batch_size] for i in range(0, len(presets), batch_size)]
    
    all_results = {}
    failed_batches = []
    
    for i, batch in enumerate(batches):
        ids = [p['id'] for p in batch]
        print(f"[{i+1}/{len(batches)}] Batch of {len(batch)}: {ids[0]}...{ids[-1]}", flush=True)
        
        result = classify_batch(batch, i+1)
        
        if result:
            all_results.update(result)
            matched = sum(1 for p in batch if p['id'] in result)
            print(f"  OK: {matched}/{len(batch)} matched", flush=True)
        else:
            failed_batches.append(i+1)
            print(f"  FAILED", flush=True)
        
        if i < len(batches) - 1:
            time.sleep(3)
    
    with open('/tmp/llm_classifications.json', 'w') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n=== DONE ===", flush=True)
    print(f"Classified: {len(all_results)}/{len(presets)}", flush=True)
    print(f"Failed batches: {failed_batches}", flush=True)
    
    # Examples
    for pid in ['deadpool', 'adele', 'batman', 'goku', 'glados', 'wolverine', 'lara-croft', 'thanos']:
        if pid in all_results:
            print(f"  {pid}: {all_results[pid]}", flush=True)


if __name__ == '__main__':
    main()
