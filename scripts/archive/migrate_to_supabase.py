#!/usr/bin/env python3
"""
Migração de presets do SQLite para Supabase via API REST.
"""

import sqlite3
import json
import os
import requests
from datetime import datetime

# Configuração
DB_PATH = "/root/clawsouls/data/database.sqlite"
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Content-Type": "application/json",
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Prefer": "return=minimal"
}

def connect_sqlite():
    """Conecta ao banco SQLite."""
    return sqlite3.connect(DB_PATH)

def migrate():
    """Executa migração completa."""
    print("🔗 Conectando ao SQLite...")
    sqlite_conn = connect_sqlite()
    sqlite_conn.row_factory = sqlite3.Row
    cursor = sqlite_conn.cursor()

    print("📊 Lendo presets do SQLite...")
    cursor.execute("SELECT * FROM presets")
    rows = cursor.fetchall()
    print(f"   Encontrados {len(rows)} registros")

    print("🚀 Iniciando migração para Supabase...")
    success_count = 0
    error_count = 0

    for i, row in enumerate(rows, 1):
        try:
            # Converter sqlite3.Row para dict
            data = dict(row)

            # Mapeamento de campos conforme schema do Supabase
            preset = {
                "id": data["id"],
                "name": data["name"],
                "creature": data.get("creature", "Human"),
                "vibe": data.get("vibe"),
                "emoji": data.get("emoji", "😊"),
                "avatar": data.get("avatar"),
                "core_truths_helpful": bool(data.get("core_truths_helpful", 1)),
                "core_truths_opinions": bool(data.get("core_truths_opinions", 1)),
                "core_truths_resourceful": bool(data.get("core_truths_resourceful", 1)),
                "core_truths_trustworthy": bool(data.get("core_truths_trustworthy", 1)),
                "core_truths_respectful": bool(data.get("core_truths_respectful", 1)),
                "boundaries_private": bool(data.get("boundaries_private", 1)),
                "boundaries_ask_before_acting": bool(data.get("boundaries_ask_before_acting", 0)),
                "boundaries_no_half_baked": bool(data.get("boundaries_no_half_baked", 0)),
                "boundaries_not_voice_proxy": bool(data.get("boundaries_not_voice_proxy", 1)),
                "vibe_style": data.get("vibe_style", "balanced"),
                "humor": data.get("humor", 50),
                "formality": data.get("formality", 50),
                "emoji_usage": data.get("emoji_usage", 10),
                "verbosity": data.get("verbosity", 50),
                "consciousness": data.get("consciousness", 50),
                "questioning": data.get("questioning", 30),
                "description": data.get("description"),
                "tags": json.loads(data.get("tags", "[]")),
                "source": data.get("source", "character"),
                "created_at": data.get("created_at"),
                "updated_at": data.get("updated_at", datetime.utcnow().isoformat())
            }

            # Upsert via POST para /rest/v1/presets?on_conflict=id
            params = {"on_conflict": "id"}
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/presets",
                headers=HEADERS,
                params=params,
                json=preset
            )

            if response.status_code in (200, 201):
                if i % 50 == 0:
                    print(f"   Processados {i}/{len(rows)}...")
                success_count += 1
            else:
                print(f"   ❌ Erro {response.status_code} no registro {data.get('id')}: {response.text}")
                error_count += 1

        except Exception as e:
            print(f"   ❌ Exceção no registro {data.get('id', 'UNKNOWN')}: {e}")
            error_count += 1

    print(f"\n✅ Migração concluída!")
    print(f"   Sucesso: {success_count}")
    print(f"   Erros: {error_count}")

    # Verificar contagem final
    try:
        result = requests.get(
            f"{SUPABASE_URL}/rest/v1/presets?select=id&count=exact",
            headers=HEADERS
        )
        if result.status_code == 200:
            # A contagem vem nos headers
            total = result.headers.get("Content-Range", "").split("/")[1] if "/" in result.headers.get("Content-Range", "") else "?"
            print(f"   Total no Supabase: {total}")
        else:
            print(f"   Não foi possível verificar contagem final: {result.status_code}")
    except Exception as e:
        print(f"   Erro na verificação: {e}")

    sqlite_conn.close()

if __name__ == "__main__":
    migrate()
