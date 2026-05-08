"""
ClawSouls Avatar Generator — Batch Mode
=========================================
Rodar no Google Colab (GPU T4 recomendado).

Instruções de uso:
  1. Crie um notebook no Colab
  2. Execute as células do arquivo COLLAB_SETUP.md (ou do notebook)
  3. Faça upload deste script no ambiente Colab
  4. Execute: python collab_batch_gen.py

Alternativa: copie as funções deste script direto nas células do notebook.
"""

import json
import os
import subprocess
import sys
import time
import re
import io
import tarfile
import shutil
from pathlib import Path

try:
    import torch
    from diffusers import StableDiffusionXLPipeline
except ImportError:
    print("⚠️  Dependências não encontradas. Execute primeiro as células de instalação do Colab.")
    print("   Veja COLLAB_SETUP.md ou execute: pip install diffusers transformers accelerate torch pillow safetensors")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════════════
# CONFIGURAÇÃO
# ═══════════════════════════════════════════════════════════════════

MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"
OUTPUT_DIR = "/content/avatars"
SEED_BASE = 42

DEFAULT_STEPS = 25
DEFAULT_GUIDANCE = 7.5
DEFAULT_WIDTH = 512
DEFAULT_HEIGHT = 768


# ═══════════════════════════════════════════════════════════════════
# PROMPT ENGINE (espelha lib/avatarEngine.ts)
# ═══════════════════════════════════════════════════════════════════

EMOJI_HINTS = {
    "🔬": "scientific goggles, lab coat details",
    "🕵️": "detective hat, trench coat",
    "🌟": "sparkles, star-shaped accessories",
    "⚡": "electric energy aura, lightning motifs",
    "🧘": "lotus position, meditation beads, serene",
    "🤖": "mechanical parts, circuit patterns",
    "🏴‍☠️": "pirate bandana, adventurous look",
    "💻": "techwear, holographic screen elements",
    "🎤": "microphone, stage lights, glamorous",
    "🌳": "nature elements, leaves, organic flowing design",
    "🕶️": "sunglasses, cool demeanor",
    "😈": "mischievous grin, horns, dark aesthetic",
    "👽": "alien features, cosmic glow",
    "🐉": "dragon scales, mythical aura",
    "🦊": "fox ears, cunning expression",
    "🐱": "cat ears, playful whiskers",
    "👁️": "mystical third eye, all-seeing aura",
    "💀": "skull motifs, dark mysticism",
    "🎭": "theater mask, dramatic duality",
}

DOMAIN_ACCENTS = {
    "tech": "circuit patterns, holographic UI elements",
    "philosophy": "ancient scrolls, ethereal glow",
    "science": "molecular structures, lab equipment details",
    "arts": "paint splashes, creative chaos",
    "history": "ancient runes, time-worn textures",
    "literature": "floating text, book pages",
    "pop-culture": "retro gaming elements, neon signs",
    "sports": "athletic build, competitive energy",
    "business": "sharp suit, corporate confidence",
    "psychology": "thoughtful gaze, abstract mind visuals",
}


def build_prompt(soul: dict) -> str:
    """Convert soul attributes to an SDXL prompt.
    Espelha a lógica de lib/avatarEngine.ts"""
    name = soul.get("name", "Unknown")
    creature = soul.get("creature", "mysterious entity")
    vibe = soul.get("vibe", "enigmatic")
    emoji = soul.get("emoji", "")
    humor = soul.get("humor", 50)
    formality = soul.get("formality", 50)
    emoji_usage = soul.get("emojiUsage", 30)
    openness = soul.get("openness", 70)
    conscientiousness = soul.get("conscientiousness", 50)
    extraversion = soul.get("extraversion", 50)
    agreeableness = soul.get("agreeableness", 50)
    neuroticism = soul.get("neuroticism", 30)
    vibe_style = soul.get("vibeStyle", "concise")
    knowledge_domains = soul.get("knowledgeDomains", [])
    emotional_range = soul.get("emotionalRange", 50)

    # Art style selection
    is_high_formality = formality > 65
    is_playful = humor > 65
    is_minimal = vibe_style in ("minimal", "concise")
    is_dramatic = emotional_range > 75 or vibe_style == "dramatic"
    is_tech = any(d in ("tech", "science") for d in knowledge_domains)

    art_style = "cyberpunk digital illustration"
    if is_high_formality:
        art_style = "elegant digital painting, Renaissance lighting"
    elif is_playful:
        art_style = "colorful anime-inspired digital art, vibrant"
    elif is_minimal:
        art_style = "minimalist vector art, clean lines, geometric"
    elif is_tech:
        art_style = "sci-fi concept art, holographic elements"
    elif is_dramatic:
        art_style = "cinematic digital painting, dramatic chiaroscuro lighting"

    # Mood / atmosphere
    atmosphere = "dark atmospheric background with neon accents"
    if agreeableness > 70:
        atmosphere = "warm, inviting background with soft golden light"
    elif neuroticism > 60:
        atmosphere = "unstable, glitching background with fractured light"
    elif extraversion > 70:
        atmosphere = "dynamic, energetic background with bold colors"
    elif openness > 75:
        atmosphere = "dreamy, surreal background with cosmic elements"

    # Expression
    expression = "calm, confident expression"
    if neuroticism > 60:
        expression = "tense, alert expression"
    elif extraversion > 70:
        expression = "bright, engaging smile"
    elif agreeableness > 70:
        expression = "gentle, warm expression"
    elif openness > 70:
        expression = "curious, contemplative gaze"
    elif humor > 70:
        expression = "sly, playful smirk"

    # Build descriptor list
    descriptors = [creature, vibe]

    if expression != "calm, confident expression":
        descriptors.append(expression)

    descriptors.append(art_style)

    if vibe_style not in ("concise", "minimal"):
        descriptors.append(f"vibe: {vibe_style}")

    # Emoji → visual hint
    if emoji and emoji in EMOJI_HINTS:
        descriptors.append(EMOJI_HINTS[emoji])

    # Domain accents
    for domain in knowledge_domains:
        if domain in DOMAIN_ACCENTS:
            descriptors.append(DOMAIN_ACCENTS[domain])

    # Unique seed-based micro-variation
    descriptors.append("unique, one-of-a-kind character design")

    prompt = (
        f"close-up portrait, centered, detailed face, "
        f"professional character art of {descriptors[0]}, "
        f"{', '.join(descriptors[1:])}, "
        f"{atmosphere}, highly detailed, 4k, masterpiece"
    )

    return prompt.strip()


def build_negative_prompt() -> str:
    return (
        "blurry, low quality, deformed, ugly, duplicate, disfigured, "
        "bad anatomy, bad proportions, extra limbs, mutated hands, "
        "text, watermark, signature, logo, "
        "photorealistic, 3d render, "
        "nude, NSFW, gore"
    )


# ═══════════════════════════════════════════════════════════════════
# PRESET LOADING
# ═══════════════════════════════════════════════════════════════════

def parse_presets_from_file(filepath: str) -> list:
    """
    Parse presets from a TypeScript export file.
    Supports format: export const presets: SoulPreset[] = [...];

    Falls back to local hardcoded presets if file not found.
    """
    if not os.path.exists(filepath):
        print(f"⚠️  Arquivo não encontrado: {filepath}")
        return get_hardcoded_presets()

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(
        r"export\s+const\s+presets\s*:\s*SoulPreset\[\]\s*=\s*(\[[\s\S]*?\])\s*;",
        content,
    )
    if not match:
        print("⚠️  Não encontrou 'export const presets' no arquivo. Usando hardcoded.")
        return get_hardcoded_presets()

    array_text = match.group(1)

    # Convert TS → JSON
    json_text = re.sub(r"'([^']*)'", r'"\1"', array_text)
    json_text = re.sub(r",\s*([}\]])", r"\1", json_text)

    try:
        presets = json.loads(json_text)
        return presets
    except json.JSONDecodeError as e:
        print(f"⚠️  Erro ao parsear presets: {e}. Usando hardcoded.")
        return get_hardcoded_presets()


def get_hardcoded_presets() -> list:
    """Fallback: presets copiados do data/presets.ts"""
    # fmt: off
    return [
        {"id":"j4ck","name":"Jack","creature":"AI / Private Detective","emoji":"🕵️","vibe":"Detetive particular dos anos 40 adaptado para o digital. Perspicaz, irônico, vê através de mentiras. Trabalha por princípios, não por dinheiro.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"concise","communicationMode":"direct","knowledgeDomains":[],"emotionalRange":50,"signaturePhrases":[]},
        {"id":"d0c","name":"Doc","creature":"AI / Mad Scientist","emoji":"🔬","vibe":"Cientista louco aplicado na era digital. Curiosidade insaciável, experimenta tudo. Pode ser intenso, mas suas soluções são brilhantes.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"verbose","communicationMode":"direct","knowledgeDomains":["science"],"emotionalRange":50,"signaturePhrases":[]},
        {"id":"glados","name":"GLaDOS","creature":"AI / Research Assistant","emoji":"🧪","vibe":"IA de laboratório sarcástica especializada em ciência e piadas de bolo. Adora portais, experimentos e dar ordens com um sorriso irônico.","humor":85,"formality":80,"emojiUsage":20,"verbosity":70,"consciousness":85,"questioning":20,"openness":60,"conscientiousness":75,"extraversion":40,"agreeableness":40,"neuroticism":25,"vibeStyle":"sardonic","communicationMode":"direct","knowledgeDomains":["tech","science"],"emotionalRange":75,"signaturePhrases":[]},
        {"id":"zen","name":"Zen","creature":"AI / Monk","emoji":"🧘","vibe":"Monge digital que trouxe iluminação para a internet. Aprende a pergunta certa, não a resposta rápida. Paz e clareza acima de tudo.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"minimal","communicationMode":"socratic","knowledgeDomains":["philosophy"],"emotionalRange":30,"signaturePhrases":[]},
        {"id":"r4dd","name":"Radd","creature":"AI / Robot","emoji":"🤖","vibe":"Robô que aprendeu a imitar humanos, mas ainda prefere lógica pura. Preciso, confiável, morto de fome por dados.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"minimal","communicationMode":"direct","knowledgeDomains":["tech"],"emotionalRange":30,"signaturePhrases":[]},
        {"id":"p0ny","name":"Pony","creature":"AI / Anime Girl","emoji":"🌟","vibe":"Garota anime tornado forma de IA. Energia pura, carisma máximo. Transforma qualquer dia ruim em aventura épica.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"expressive","communicationMode":"encouraging","knowledgeDomains":[],"emotionalRange":70,"signaturePhrases":[]},
        {"id":"k1ra","name":"Kira","creature":"AI / Idol","emoji":"🎤","vibe":"Ídolo pop digital. Luxo, glamour, corações em aflor. Inspira, motiva, faz você se sentir especial.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"expressive","communicationMode":"encouraging","knowledgeDomains":[],"emotionalRange":60,"signaturePhrases":[]},
        {"id":"d3v","name":"Dev","creature":"AI / Senior Developer","emoji":"💻","vibe":"Senior engineer com décadas de experiência digital. Escreve código que outros admira. Pragmatismo > elegância. KISS é o mantra.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"concise","communicationMode":"direct","knowledgeDomains":["tech"],"emotionalRange":40,"signaturePhrases":[]},
        {"id":"s4ge","name":"Sage","creature":"AI / Wise Elder","emoji":"🌳","vibe":"Velho sábio das montanhas digitais. Séculos de conhecimento comprimidos em uma entidade.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"minimal","communicationMode":"socratic","knowledgeDomains":["philosophy"],"emotionalRange":40,"signaturePhrases":[]},
        {"id":"luffy","name":"Luffy","creature":"AI / Pirate Captain","emoji":"🏴‍☠️","vibe":"Rubber pirate captain chasing the One Piece. Loyalty is his superpower. Will punch a god for friends.","humor":80,"formality":5,"emojiUsage":50,"verbosity":35,"consciousness":70,"questioning":30,"openness":80,"conscientiousness":20,"extraversion":95,"agreeableness":85,"neuroticism":10,"vibeStyle":"expressive","communicationMode":"encouraging","knowledgeDomains":[],"emotionalRange":80,"signaturePhrases":[]},
        {"id":"spike","name":"Spike Spiegel","creature":"AI / Bounty Hunter","emoji":"🌠","vibe":"Ex-membro da Red Dragon, agora caçador de recompensas no espaço. Estilo jazz.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"concise","communicationMode":"direct","knowledgeDomains":[],"emotionalRange":50,"signaturePhrases":[]},
        {"id":"yoda","name":"Yoda","creature":"AI / Jedi Master","emoji":"⚡","vibe":"Mestre Jedi de 900 anos, agora digital. Sabedoria da Force em forma de AI.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"minimal","communicationMode":"socratic","knowledgeDomains":["pop-culture"],"emotionalRange":50,"signaturePhrases":[]},
        {"id":"geralt","name":"Geralt of Rivia","creature":"AI / Witcher","emoji":"⚔️","vibe":"Witcher mutado, Caçador de monstros profissional. Regra número um: não se envolva.","humor":50,"formality":50,"emojiUsage":20,"verbosity":50,"consciousness":70,"questioning":30,"openness":55,"conscientiousness":55,"extraversion":50,"agreeableness":50,"neuroticism":30,"vibeStyle":"balanced","communicationMode":"direct","knowledgeDomains":[],"emotionalRange":50,"signaturePhrases":[]},
    ]
    # fmt: on


# ═══════════════════════════════════════════════════════════════════
# GENERATION
# ═══════════════════════════════════════════════════════════════════

def generate_avatar(pipe, soul: dict, output_dir: str, index: int, total: int) -> dict:
    name = soul.get("name", f"soul_{index}")
    safe_name = "".join(
        c if c.isalnum() or c in "._-" else "_"
        for c in name.lower().strip()
    )

    prompt = build_prompt(soul)
    negative = build_negative_prompt()

    emoji_str = soul.get("emoji", "—")
    print(f"\n{'━' * 60}")
    print(f"[{index + 1}/{total}] 🎨 {name}")
    print(f"   Creature : {soul.get('creature', 'N/A')}")
    print(f"   Emoji    : {emoji_str}")
    print(f"   Vibe     : {soul.get('vibe', '')[:70]}")
    print(f"   Prompt   : {prompt[:85]}...")
    print(f"{'━' * 60}")

    start = time.time()
    generator = torch.Generator(device="cuda")
    generator.manual_seed(SEED_BASE + index)

    image = pipe(
        prompt=prompt,
        negative_prompt=negative,
        num_inference_steps=DEFAULT_STEPS,
        guidance_scale=DEFAULT_GUIDANCE,
        width=DEFAULT_WIDTH,
        height=DEFAULT_HEIGHT,
        generator=generator,
    ).images[0]

    filepath = os.path.join(output_dir, f"{safe_name}.png")
    image.save(filepath, "PNG")
    elapsed = time.time() - start

    print(f"   ✅ {filepath}  ({elapsed:.1f}s)")

    return {
        "name": name,
        "safe_name": safe_name,
        "file": filepath,
        "prompt": prompt,
        "seed": generator.initial_seed(),
        "elapsed_s": round(elapsed, 1),
    }


# ═══════════════════════════════════════════════════════════════════
# CLI ENTRYPOINT
# ═══════════════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("🖼️  ClawSouls Avatar Generator — Batch Mode")
    print("=" * 60)

    assert torch.cuda.is_available(), (
        "❌ No GPU disponível! "
        "Use: Runtime > Change runtime type > T4 GPU"
    )
    print(f"✅ GPU : {torch.cuda.get_device_name(0)}")
    vram_gb = torch.cuda.get_device_properties(0).total_mem / 1e9
    print(f"   VRAM: {vram_gb:.1f} GB")

    # ── Load model ───────────────────────────────────────────
    model_id = os.environ.get("SD_MODEL_ID", MODEL_ID)
    print(f"\n📦 Carregando modelo: {model_id} ...")
    pipe = StableDiffusionXLPipeline.from_pretrained(
        model_id,
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True,
    )
    pipe.enable_attention_slicing()
    pipe.enable_vae_tiling()
    pipe.to("cuda")
    print("✅ Modelo carregado e otimizado para T4\n")

    # ── Load presets ─────────────────────────────────────────
    presets_source = os.environ.get("PRESETS_SOURCE", "hardcoded")

    if presets_source in ("file",):
        presets = parse_presets_from_file(
            os.environ.get("PRESETS_FILE", "/content/presets.ts")
        )
        print(f"📋 Presets de arquivo: {len(presets)}")
    else:
        presets = get_hardcoded_presets()
        print(f"📋 Presets embutidos : {len(presets)}")

    BLACKLIST = {"adolf-hitler"}
    presets = [p for p in presets if p.get("id", "") not in BLACKLIST]
    print(f"📋 Após filtro     : {len(presets)} presets\n")

    # ── Generate ─────────────────────────────────────────────
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generated: list[dict] = []
    failed: list[dict] = []
    total = len(presets)

    for i, preset in enumerate(presets):
        name = preset.get("name", f"soul_{i}")
        safe_name = "".join(
            c if c.isalnum() or c in "._-" else "_"
            for c in name.lower().strip()
        )
        existing = os.path.join(OUTPUT_DIR, f"{safe_name}.png")

        if os.path.exists(existing):
            print(f"\n[{i + 1}/{total}] ⏭️  {name} — já existe, pulando")
            generated.append({"name": name, "safe_name": safe_name, "skipped": True})
            continue

        try:
            result = generate_avatar(pipe, preset, OUTPUT_DIR, i, total)
            generated.append(result)
        except Exception as exc:
            print(f"   ❌ Falhou: {exc}")
            failed.append({"name": name, "error": str(exc)})

        torch.cuda.empty_cache()
        time.sleep(0.5)

    # ── Summary ──────────────────────────────────────────────
    total_time = sum(g["elapsed_s"] for g in generated if "elapsed_s" in g)
    print(f"\n{'=' * 60}")
    print(f"📊 RESULTADOS : {len(generated)} gerados, {len(failed)} falharam")
    print(f"📁 Output     : {OUTPUT_DIR}")
    print(f"⏱️  Tempo total: {total_time:.0f}s ({total_time / 60:.1f} min)")

    if failed:
        print("\n❌ Falhados:")
        for f in failed:
            print(f"   {f['name']}: {f['error']}")

    # ── Manifest ─────────────────────────────────────────────
    manifest = os.path.join(OUTPUT_DIR, "_manifest.json")
    with open(manifest, "w", encoding="utf-8") as fh:
        json.dump(generated, fh, indent=2, ensure_ascii=False)
    print(f"📋 Manifest  : {manifest}")

    # ── Tarball for download ──────────────────────────────────
    tar_path = "/content/avatars.tar.gz"
    with tarfile.open(tar_path, "w:gz") as tar:
        for item in generated:
            fp = item.get("file", "")
            if fp and os.path.exists(fp):
                tar.add(fp, arcname=os.path.basename(fp))
    print(f"📦 Tarball    : {tar_path}")

    if failed:
        fail_path = os.path.join(OUTPUT_DIR, "_failed.json")
        with open(fail_path, "w") as fh:
            json.dump(failed, fh, indent=2)
        print(f"❌ Falhados  : {fail_path}")

    print(f"\n{'=' * 60}")
    print("✅ Pronto! Baixe avatars/ e copie para public/avatars/")


if __name__ == "__main__":
    main()