# Testing Philosophy & Methods

> Guide to testing strategy, patterns, and execution in fridai-core

**Last Updated:** 2025-12-12

---

## Overview

We follow a layered testing approach:

**unit tests** → **integration tests** → **smoke tests** → **manual validation** → **adversarial (opt-in)**.

**Principles:**
- **Hermetic by default**: avoid external services unless explicitly enabled
- **Deterministic**: no flaky or timing-dependent tests
- **Focused**: each test proves a single behavior or interaction
- **Fast feedback**: unit/integration tests run quickly; smoke/adversarial are opt-in

---

## Quick Commands

```bash
# Lint (ruff only)
make lint

# Run all tests (mcp/system/memory/llm)
make test

# Run tests quietly
make test-quick

# Run smoke tests (in-process MCP + Memory)
make smoke-test

# Run opt-in adversarial sandbox suite (Docker required)
make adversarial-test

# Run agent runtime unit tests (stub provider)
pytest packages/system/tests/sandbox/test_agent_runtime.py -v -m agent

# Run local LLM agent tests (Ollama required)
make test-local-llm

# Run full pre-commit checks
pre-commit run --all-files
```

---

## Per-Package Tests

```bash
# System package
cd packages/system
pytest tests/ -v -m "not e2e and not adversarial"

# MCP package
cd packages/mcp
pytest tests/ -v

# Memory package
cd packages/memory
pytest tests/ -v

# LLM package
cd packages/llm
pytest tests/ -v

# Common package (not included in make test)
cd packages/common
pytest tests/ -v
```

---

## CI Notes (Current)

- **PR CI is lightweight**: unit + integration tests only. Adversarial and local-LLM suites are excluded.
- **Heavy suites run on-demand or scheduled**:
  - `ci-heavy.yml` (memory tests, schemas, pip-audit, adversarial stress)
  - `test-local-llm.yml` (Ollama/local LLM)
  - `sandbox-build-deploy.yml` (publishes sandbox images)
- **MCP CLI + secrets**: if presets include GSM secrets, ensure local auth:
  - `gcloud auth application-default login`
  - or bypass with `FRIDAI_SKIP_SECRET_FETCH=1`.

---

## Coverage

```bash
pytest \
  --cov=fridai_system \
  --cov=fridai_mcp \
  --cov=fridai_memory_mcp \
  --cov=fridai_common \
  --cov-report=html

open htmlcov/index.html
```

---

## Testing Layers

### 1. Unit Tests

**Purpose:** Test individual functions/classes in isolation.

**Traits:**
- No external I/O
- Small, deterministic inputs
- Heavy use of fixtures/mocks

---

### 2. Integration Tests

**Purpose:** Validate interactions between components.

**Traits:**
- May use temp files
- May use in-process services
- Should still be hermetic

---

### 3a. Agent Runtime Tests

Agent tests are opt-in and split into:

- **Stubbed unit tests:** `packages/system/tests/sandbox/test_agent_runtime.py` (no external deps).
- **Local LLM tests:** `packages/system/tests/sandbox/test_agent_runtime_local.py` (requires Docker + Ollama).

Enable local LLM tests with:

```bash
FRIDAI_RUN_LOCAL_LLM_TESTS=1 \
FRIDAI_SANDBOX_IMAGE=fridai-sandbox:local \
make test-local-llm
```

---

### 3. Smoke Tests (In-Process)

Smoke tests run via `tests/smoke_test_mcp.py` and are **in-process**:

- Initialize `FridaiMCPServer` and `MemoryServer` in Python
- Stub system bridge HTTP calls (no FastAPI server required)
- Exercise tool/resource paths and memory ops

**Run:**
```bash
make smoke-test
# or
python tests/smoke_test_mcp.py
```

**Key Notes:**
- No port binding (no 3921/3922/8000)
- Defaults to `FRIDAI_MEMORY_STORE=local` and `FRIDAI_MEMORY_GCS_DRIVER=stub`
- `spec_find` only runs when `FRIDAI_MEMORY_MCP_URL` is set

---

### 4. Adversarial Tests (Opt-in)

Adversarial sandbox tests live under `packages/system/tests/sandbox_adversarial/` and are opt-in.

**Run:**
```bash
make adversarial-test
# or
./scripts/run_adversarial.sh -vv
```

**Optional flags:**
```bash
export FRIDAI_ADVERSARIAL_LOGS=1
export FRIDAI_ADVERSARIAL_STRESS=1
```

---

### 5. Manual Validation

Manual validation is reserved for end-to-end or UX workflows that require human judgement.

Example:
- Start services with `mcp start` (optional)
- Publish specs
- Run `fridai spec find` and validate results

---

## Testing Strategy by Package

### System Package

**Focus:** Spec validation/execution, approvals, handlers, run history

**Key Areas:**
- Validation guardrails
- Planning and execution loop
- Handler registration + invocation
- ApprovalService + ApprovalLog
- Run history append + rotation
- Sandbox execution + allowlists

---

### MCP Package

**Focus:** Hub routing, auth, tool dispatch, bridge integration

**Key Areas:**
- API key auth
- Tool allowlist enforcement
- Tool argument validation
- System bridge (HTTP)
- Memory proxy

---

### Memory Package

**Focus:** Store implementations and memory API

**Key Areas:**
- Local store
- Pinecone store
- GCS live/stub store
- Hybrid/vector_gcs orchestration
- API endpoints: `/tools/memory.search`, `/tools/memory.write`, `/resources/memory.recent`

---

### Common Package

**Focus:** Secret resolution, notification clients

**Key Areas:**
- SecretResolver (env → secrets.yaml → GSM)
- Notification client filters
- Slack/email/Jira client behavior

---

## Spec Discovery Smoke Checklist

Because the CLI defaults to `specs/active` (legacy), specify the repo path explicitly.

### 1. Publish Spec Cards

```bash
fridai spec publish \
  --spec-root packages/system/specs/active \
  --output tmp/spec_cards.json
```

### 2. CLI Discovery

```bash
fridai spec find "slack status" --limit 3
```

### 3. MCP Tool Invocation

```bash
curl -X POST http://127.0.0.1:3921/mcp \
  -H "X-API-Key: $FRIDAI_MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "spec_find",
      "arguments": {"query": "slack status", "limit": 3}
    },
    "id": 1
  }'
```

---

## Test Organization

```
packages/
├── system/tests/
├── mcp/tests/
├── memory/tests/
├── llm/tests/
└── common/tests/

tests/
└── smoke_test_mcp.py
```

---

## Pre-commit Checks

`.pre-commit-config.yaml` runs:
- ruff (with fixes)
- ruff-format
- black
- yamllint
- check-json + whitespace hooks
- schema freshness check
- run-history rotation dry run
- full pytest suite + smoke tests

---

## See Also

- [CI_WORKAROUNDS.md](./CI_WORKAROUNDS.md) - CI patterns and debugging
- [TESTING_FLOW.md](./TESTING_FLOW.md) - Visual test execution flows
- [pytest Documentation](https://docs.pytest.org/)
