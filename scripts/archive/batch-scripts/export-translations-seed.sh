#!/usr/bin/env bash
# Export preset_translations from Supabase to a SQL seed file
# Usage: bash scripts/export-translations-seed.sh

set -euo pipefail

# Load env
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

SUPABASE_URL="${SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

OUTPUT="data/migrations/003_seed_translations.sql"

echo "-- Seed: preset_translations" > "$OUTPUT"
echo "-- Auto-generated on $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$OUTPUT"
echo "-- Run after 003_preset_translations.sql to restore translated data" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "INSERT INTO preset_translations (preset_id, locale, name, description, creature, vibe, tags) VALUES" >> "$OUTPUT"

# Fetch all translations in batches
OFFSET=0
FIRST=true
TOTAL=0

while true; do
  BATCH=$(curl -s "${SUPABASE_URL}/rest/v1/preset_translations?select=preset_id,locale,name,description,creature,vibe,tags&limit=1000&offset=${OFFSET}&order=preset_id,locale" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}")

  COUNT=$(echo "$BATCH" | jq 'length')
  if [ "$COUNT" -eq 0 ]; then
    break
  fi

  echo "$BATCH" | jq -r '.[] | @json' | while IFS= read -r row; do
    PRESET_ID=$(echo "$row" | jq -r '.preset_id')
    LOCALE=$(echo "$row" | jq -r '.locale')
    NAME=$(echo "$row" | jq -r '.name // ""' | sed "s/'/''/g")
    DESC=$(echo "$row" | jq -r '.description // ""' | sed "s/'/''/g")
    CREATURE=$(echo "$row" | jq -r '.creature // ""' | sed "s/'/''/g")
    VIBE=$(echo "$row" | jq -r '.vibe // ""' | sed "s/'/''/g")
    TAGS=$(echo "$row" | jq -r '.tags // "[]"' | sed "s/'/''/g")

    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      echo "," >> "$OUTPUT"
    fi

    printf "  ('%s', '%s', '%s', '%s', '%s', '%s', '%s::json')" \
      "$PRESET_ID" "$LOCALE" "$NAME" "$DESC" "$CREATURE" "$VIBE" "$TAGS" >> "$OUTPUT"
  done

  TOTAL=$((TOTAL + COUNT))
  OFFSET=$((OFFSET + 1000))
  echo "  Fetched $TOTAL translations..." >&2
done

echo "" >> "$OUTPUT"
echo "ON CONFLICT (preset_id, locale) DO UPDATE SET" >> "$OUTPUT"
echo "  name = EXCLUDED.name," >> "$OUTPUT"
echo "  description = EXCLUDED.description," >> "$OUTPUT"
echo "  creature = EXCLUDED.creature," >> "$OUTPUT"
echo "  vibe = EXCLUDED.vibe," >> "$OUTPUT"
echo "  tags = EXCLUDED.tags," >> "$OUTPUT"
echo "  updated_at = NOW();" >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "-- Total: $TOTAL translations" >> "$OUTPUT"

echo "✅ Exported $TOTAL translations to $OUTPUT"
