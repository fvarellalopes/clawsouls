# ClawSouls API Documentation

## Overview

ClawSouls provides a simple REST API for generating and sharing SOUL.md configurations.

Base URL (production): `https://clawsouls.hub/api`

---

## Endpoints

### POST /api/share

Generates a shareable link with the provided soul data.

**Request:**
```json
{
  "soul": {
    "name": "string",
    "creature": "string",
    "vibe": "string",
    "emoji": "string",
    "avatar": "string (optional)",
    "coreTruths": {
      "helpful": boolean,
      "opinions": boolean,
      "resourceful": boolean,
      "trustworthy": boolean,
      "respectful": boolean
    },
    "boundaries": {
      "noSexual": boolean,
      "noReligious": boolean,
      "noPolitical": boolean,
      "noInappropriate": boolean,
      "noSelfModification": boolean,
      "noDateRequests": boolean,
      "noDangerous": boolean
    },
    "vibeStyle": "string",
    "continuity": boolean,
    "humor": number,
    "formality": number,
    "emojiUsage": number,
    "verbosity": number,
    "consciousness": number,
    "questioning": number
  }
}
```

**Response:**
```json
{
  "success": true,
  "shareUrl": "https://clawsouls.hub/share?data=BASE64",
  "editUrl": "https://clawsouls.hub/editor?data=BASE64"
}
```

**Example (curl):**
```bash
curl -X POST https://clawsouls.hub/api/share \
  -H "Content-Type: application/json" \
  -d '{"soul":{"name":"Nexo","creature":"AI Ghost","vibe":"Shrewd and sarcastic.","emoji":"👁️👄👁️","coreTruths":{"helpful":true,"opinions":true,"resourceful":true,"trustworthy":true,"respectful":true},"boundaries":{"noSexual":true,"noReligious":false,"noPolitical":false,"noInappropriate":true,"noSelfModification":true,"noDateRequests":true,"noDangerous":true},"vibeStyle":"cyberpunk","continuity":false,"humor":70,"formality":30,"emojiUsage":60,"verbosity":50,"consciousness":80,"questioning":60}}'
```

---

## SDK Usage (JavaScript)

```javascript
async function shareSoul(soul) {
  const response = await fetch('https://clawsouls.hub/api/share', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ soul })
  });
  return response.json();
}
```

---

## Notes

- All data is passed client-side; no storage on server.
- Share links contain base64-encoded JSON; length limited by URL (~2000 chars).
- For large presets, use POST to generate shortened links (future: implement URL shortener).
