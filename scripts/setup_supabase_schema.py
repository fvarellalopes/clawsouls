#!/usr/bin/env python3
"""
Cria schema no Supabase via API de Admin.
"""

import requests
import sys
import json

SUPABASE_URL = "https://qsnmcomdjreewaiwzzxl.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm1jb21kanJlZXdhaXd6enhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5MjcwOCwiZXhwIjoyMDg2NDY4NzA4fQ.GjoZ9_P2aK8ki48nqvtAg3DfXXoyzn-OrE_2r0SbE70"

def create_table_via_api():
    """Cria tabela usando a API de Management do Supabase."""
    endpoint = f"{SUPABASE_URL}/v1/management/tables"
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
    }

    # Definir schema da tabela
    table_def = {
        "name": "presets",
        "schema": "public",
        "columns": [
            {"name": "id", "type": "text", "is_primary": True},
            {"name": "name", "type": "text", "is_nullable": False},
            {"name": "creature", "type": "text", "default": "Human"},
            {"name": "vibe", "type": "text"},
            {"name": "emoji", "type": "text", "default": "😊"},
            {"name": "avatar", "type": "text"},
            {"name": "core_truths_helpful", "type": "bool", "default": True},
            {"name": "core_truths_opinions", "type": "bool", "default": True},
            {"name": "core_truths_resourceful", "type": "bool", "default": True},
            {"name": "core_truths_trustworthy", "type": "bool", "default": True},
            {"name": "core_truths_respectful", "type": "bool", "default": True},
            {"name": "boundaries_private", "type": "bool", "default": True},
            {"name": "boundaries_ask_before_acting", "type": "bool", "default": False},
            {"name": "boundaries_no_half_baked", "type": "bool", "default": False},
            {"name": "boundaries_not_voice_proxy", "type": "bool", "default": True},
            {"name": "vibe_style", "type": "text", "default": "balanced"},
            {"name": "humor", "type": "int4", "default": 50},
            {"name": "formality", "type": "int4", "default": 50},
            {"name": "emoji_usage", "type": "int4", "default": 10},
            {"name": "verbosity", "type": "int4", "default": 50},
            {"name": "consciousness", "type": "int4", "default": 50},
            {"name": "questioning", "type": "int4", "default": 30},
            {"name": "description", "type": "text"},
            {"name": "tags", "type": "jsonb", "default": "[]"},
            {"name": "source", "type": "text", "default": "character"},
            {"name": "created_at", "type": "timestamptz", "default": "now()"},
            {"name": "updated_at", "type": "timestamptz", "default": "now()"}
        ],
        "indexes": [
            {"columns": ["source"], "name": "idx_presets_source"},
            {"columns": ["creature"], "name": "idx_presets_creature"},
            {"columns": ["tags"], "name": "idx_presets_tags"},
            {"columns": ["name"], "name": "idx_presets_name"}
        ],
        "row_level_security": True,
        "comment": "Presets de personalidade para o ClawSouls"
    }

    print("🗃️  Criando tabela 'presets' via API de Admin...")
    response = requests.post(endpoint, headers=headers, json=table_def)

    if response.status_code in (200, 201):
        print("   ✅ Tabela criada com sucesso!")
        table_info = response.json()
        print(f"   Nome: {table_info.get('name')}")
        print(f"   Schema: {table_info.get('schema')}")
        return True
    else:
        print(f"   ❌ Erro {response.status_code}: {response.text}")
        if "already exists" in response.text.lower():
            print("   ℹ️  Tabela já existe, continuando...")
            return True
        return False

def create_policies():
    """Cria políticas de RLS via API."""
    # As políticas precisam ser criadas via SQL, pois a API de management não tem suporte
    print("\n🔒 Configurando Row Level Security (RLS)...")
    print("   ℹ️  As políticas de RLS precisam ser criadas manualmente via SQL Editor do Supabase.")
    print("   Execute o seguinte SQL no Supabase SQL Editor:")
    print("""
    ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public read access" ON presets FOR SELECT USING (true);
    CREATE POLICY "Service role write access" ON presets FOR ALL USING (auth.role() = 'service_role');
    """)
    return True

def main():
    print("🔗 Configurando Supabase via API de Admin...")

    # 1. Criar tabela
    if not create_table_via_api():
        print("\n❌ Falha na criação da tabela. Abortando.")
        sys.exit(1)

    # 2. Instruir sobre RLS
    create_policies()

    print("\n✅ Schema criado! Continue com a migração de dados.")

if __name__ == "__main__":
    main()
