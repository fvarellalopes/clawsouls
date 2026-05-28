#!/usr/bin/env python3
"""Classify presets via gateway using curl subprocess (more reliable than urllib)."""
import json, os, subprocess, re, sys, time, os

GATEWAY = "https://opengateway.gitlawb.com/v1/chat/completions"
TOKEN = os.environ.get("GATEWAY_TOKEN", "")
RESULTS_FILE = "/tmp/llm_classifications.json"

CATEGORIES = ["masculino","feminino","robo","animal","divindade","ficção","histórico","mitológico","contemporâneo","calmo","agressivo","sarcástico","otimista","sombrio","energético","trabalho","lifestyle","escrita","educação","tecnologia","ciência","arte","negócios","saúde","segurança","engenharia","marvel","dc","anime","videogame","HQ","filme","herói","vilão","anti-herói","mentor","líder","companheiro","cantor","artista","escritor","cientista","guerreiro"]

SYSTEM = f"""Classify each character into 1-6 categories from this list ONLY:
{json.dumps(CATEGORIES)}

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

Return ONLY a JSON dict mapping id to array of categories. Nothing else."""

def classify_batch(batch, batch_num):
    chars = [f"- {p['id']}: {p['name']} | {p['creature']} | {p['desc'][:120]}" for p in batch]
    user_msg = "Classify. Return ONLY JSON dict:\n\n" + "\n".join(chars)
    
    payload = json.dumps({
        "model": "mimo-v2.5-pro",
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user_msg}
        ],
        "max_tokens": 3000,
        "temperature": 0.1,
    })
    
    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", "300", GATEWAY,
             "-H", f"authorization: Bearer {TOKEN}",
             "-H", "content-type: application/json",
             "-d", payload],
            capture_output=True, text=True, timeout=310
        )
        
        if result.returncode != 0:
            print(f"  curl error: {result.stderr[:200]}", flush=True)
            return None
        
        data = json.loads(result.stdout)
        msg = data["choices"][0]["message"]
        text = (msg.get("content") or "") + (msg.get("reasoning") or "")
        
        # Find JSON blocks
        json_blocks = re.findall(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text)
        for jb in reversed(json_blocks):
            try:
                parsed = json.loads(jb)
                if len(parsed) >= max(3, len(batch) * 0.4):
                    return parsed
            except:
                continue
        return None
    except Exception as e:
        print(f"  Error: {e}", flush=True)
        return None


def main():
    with open('/tmp/presets_for_llm.json') as f:
        presets = json.load(f)
    
    # Load existing results (resume support)
    all_results = {}
    if os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE) as f:
            all_results = json.load(f)
        print(f"Resuming: {len(all_results)} already classified", flush=True)
    
    batch_size = 10
    batches = [presets[i:i+batch_size] for i in range(0, len(presets), batch_size)]
    
    for i, batch in enumerate(batches):
        # Skip if all presets in this batch already classified
        if all(p['id'] in all_results for p in batch):
            print(f"[{i+1}/{len(batches)}] Skip (already done)", flush=True)
            continue
        
        ids = [p['id'] for p in batch]
        print(f"[{i+1}/{len(batches)}] {ids[0]}...{ids[-1]}", flush=True)
        
        result = classify_batch(batch, i+1)
        
        if result:
            all_results.update(result)
            matched = sum(1 for p in batch if p['id'] in result)
            print(f"  OK: {matched}/{len(batch)} matched", flush=True)
            
            # Save after each batch (checkpoint)
            with open(RESULTS_FILE, 'w') as f:
                json.dump(all_results, f, indent=2, ensure_ascii=False)
        else:
            print(f"  FAILED", flush=True)
        
        if i < len(batches) - 1:
            time.sleep(3)
    
    print(f"\n=== DONE: {len(all_results)}/{len(presets)} ===", flush=True)
    for pid in ['deadpool', 'adele', 'batman', 'goku', 'wolverine', 'beyonce', 'britney-spears']:
        if pid in all_results:
            print(f"  {pid}: {all_results[pid]}", flush=True)


if __name__ == '__main__':
    main()
