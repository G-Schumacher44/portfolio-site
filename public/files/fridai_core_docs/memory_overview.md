# Memory Package Overview

**Last Updated**: 2025-11-25

The Memory package (`fridai_memory_mcp`) provides persistent storage and semantic search for spec cards (and future run-history cards). It exposes a FastAPI service (search/write/recent) consumed by the hub; FastMCP entrypoints are removed.

---

## Components

### Memory Stores
| Store | Path | Purpose |
|-------|------|---------|
| `LocalStore` | `src/fridai_memory_mcp/stores/local.py` | JSONL store for dev/offline. |
| `PineconeStore` | `src/fridai_memory_mcp/stores/pinecone.py` | Vector store (production index). |
| `GCSStubStore` / `GCSLiveStore` | `src/fridai_memory_mcp/stores/gcs*.py` | Archive/rotation target (stub for local, live for GCS). |
| `HybridVectorGCSStore` | `src/fridai_memory_mcp/stores/hybrid.py` | Pinecone index + GCS authoritative archive. |

All stores implement `MemoryStore` (`write`, `search`, `list_recent`, `rotate`). The FastAPI service instantiates the configured store (env → preset → config/human) and exposes async wrappers.

### Memory Cards
- Generated via `packages/memory/scripts/ingest_specs.py` (spec summaries).
- Card payloads include `spec_id`, `{intent,plan,tasks}_hash`, `timestamp`, and source refs. JSON schema lives under `packages/memory/schemas/`.
- `memory.search` returns cards enriched with `relevance`, `tags`, and version hashes so `spec_find` can surface fresh specs.

### FastAPI Service
- Entry: `fridai_memory_mcp.api_app:app` (uvicorn; used by `mcp start`).
- Endpoints:
  - `POST /tools/memory.search` – vector/keyword search for cards.
  - `POST /tools/memory.write` – upsert cards.
  - `GET /resources/memory.recent` – most recent cards.
  - `GET /health` – health check.
- API key required via `X-API-Key` or `Authorization: Bearer` (`FRIDAI_MCP_API_KEY`, or `memory_api_key` via `config/secrets.yaml`).

---

## Configuration

**Config File**: `config/human/memory.yaml`
**Preset Overrides**: `config/presets/*.yaml` → `execution.memory`

**Environment Variables** (overrides):
- `FRIDAI_MEMORY_STORE` – `local`, `pinecone`, `gcs`, `hybrid`, or `vector_gcs` (hybrid/vector_gcs = Pinecone + GCS).
- `FRIDAI_MEMORY_LOCAL_PATH` – JSONL path for local store.
- `FRIDAI_MEMORY_PINECONE_API_KEY` / `FRIDAI_MEMORY_PINECONE_ENV` / `FRIDAI_MEMORY_PINECONE_INDEX` – vector index config.
- `FRIDAI_MEMORY_NAMESPACE` – namespace per env/profile.
- `FRIDAI_MEMORY_GCS_BUCKET` / `FRIDAI_MEMORY_GCS_PREFIX` – GCS archive location.
- `FRIDAI_MEMORY_GCS_DRIVER` – `stub` (local) or `live` (real GCS).
- `FRIDAI_MEMORY_GCS_STUB_ROOT` – local stub root for GCS in dev.
- `FRIDAI_MEMORY_ARCHIVE_BUCKET` – archive bucket (rotation).
- `FRIDAI_MEMORY_EMBED_MODEL` – embedding model override (Pinecone store).

---

## Usage

### Start Memory MCP
```bash
# With hub via CLI (recommended)
mcp start            # starts hub + memory FastAPI services

# Standalone FastAPI
cd packages/memory
uvicorn fridai_memory_mcp.api_app:app --factory --host 127.0.0.1 --port 3922
```

### Ingest Specs → Load Cards
```bash
cd packages/memory
python scripts/ingest_specs.py --spec-root ../system/specs/active --output memory/spec_cards.json
python scripts/load_memory_cards.py memory/spec_cards.json
```
Each spec directory **must** include a `spec.yaml` describing owner/inputs/outputs (validated by `packages/system/schemas/spec_yaml.schema.json`). The translator injects that metadata into every card payload (`payload.spec`), so downstream clients (CLI, MCP `spec_find`) can display structured contract info instead of scraping Markdown. Missing or invalid `spec.yaml` files now stop the publish flow.

One-shot publish helper (honors `--store` overrides so CI can aim at Pinecone):
```bash
python scripts/publish_specs.py \
  --spec-root ../system/specs/active \
  --output tmp/spec_cards.json \
  --store pinecone \
  --namespace spec-prod
```

### Search
```bash
python scripts/search_memory.py "status" --scope spec --limit 3
```

---

## Architecture
```
Spec Markdown → ingest_specs.py → memory/spec_cards.json
      ↓                       ↓
  load_memory_cards.py  → MemoryStore (Local/Pinecone)
      ↓                       ↓
FastAPI `memory.search`  → `spec_find` / assistants
```

---

## Active Work
- [x] Memory card/spec metadata schemas aligned with system docs (`memory_card.schema.json`, `packages/system/schemas/spec_yaml.schema.json`).
- [ ] Rotation scripts (local + Pinecone → GCS) documented in runbooks.
- [x] Memory smoke pipeline (ingest → load → search) wired into CI.
