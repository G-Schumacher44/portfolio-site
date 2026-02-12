# Getting Started with FridAI Core

Welcome! This guide gets you running with FridAI Core's spec-driven automation stack.

For build history, LLM lessons learned, and performance discoveries, see [Dev Notes](guides/DEV_NOTES.md).

---

## What is FridAI Core?

**FridAI Core = spec-driven automation with MCP-based assistant integration.**

- **Specs** define automation in a unified `spec.yaml` (intent, plan, tasks).
- **System** validates specs against guardrails before execution.
- **Approvals** gate sensitive operations.
- **MCP Hub** exposes tools/resources to AI assistants.
- **Memory** enables spec discovery and context retrieval.

**Architecture:**
1. **System** - validate → plan → execute → notify
2. **MCP Hub** - tool/resource gateway (JSON-RPC)
3. **Memory** - spec discovery + context retrieval
4. **Common** - shared notifications + secrets

---

## Prerequisites

- **Python 3.11+**
- **Conda** or **venv**
- **Git**
- **Optional:** Google Cloud SDK (for GSM), Pinecone (for vector search)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/garrettschumacher/fridai-core.git
cd fridai-core
```

### 2. Create Environment

**Option A: Conda**
```bash
conda env create -f environment.yml
conda activate fridai-core
```

**Option B: venv**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e ./packages/common
pip install -e ./packages/system
pip install -e ./packages/mcp
pip install -e ./packages/memory
pip install -e ./packages/llm
```

### 3. Verify Packages

```bash
pip list | grep fridai
# fridai-common, fridai-system, fridai-mcp, fridai-memory-mcp, fridai-llm-handlers
```

---

## Quick Start

### Start MCP Services

```bash
# Start system (8000) + memory (3922) + hub (3921)
mcp start

# Start with remotes initialized (optional)
mcp start --enable-remotes

# Check status
mcp status

# View logs
mcp logs

# Stop services
mcp stop
```

**API Key (local dev):**
```bash
export FRIDAI_MCP_API_KEY="your-dev-key"
```

### Validate Specs

`fridai validate` checks all specs under `packages/system/specs/active`.

```bash
fridai validate
fridai validate --output json
```

### Execute a Spec

```bash
# Dry run (no external notifications)
fridai exec --spec spec.system_primary --dry-run

# Execute with notifications
fridai exec --spec spec.system_primary --notify cli --notify slack
```

### Search for Specs

```bash
# Publish specs to memory
fridai spec publish --spec-root packages/system/specs/active

# Search published specs
fridai spec find "deployment automation"
```

---

## Presets & Configuration

Runtime config is preset-driven. Presets live in `config/presets/*.yaml` and are selected via
`FRIDAI_PROFILE` or `mcp start --profile <name>`.

```bash
export FRIDAI_PROFILE=default
# or
mcp start --profile production
```

---

## Sandbox Security (Heads-up)

- Docker-only sandbox provider today.
- Default: non-root, caps dropped, read-only rootfs, `network=none`.
- Network access requires approval-gated tasks + explicit approval.
- Sandbox config is driven by `execution.sandbox` in presets.

See `docs/guides/SANDBOX_GUIDE.md` for details.

---

## Run Tests

```bash
# Lint
make lint

# Unit/integration tests
make test

# Smoke tests (in-process MCP + Memory)
make smoke-test
```

Note: `make test` runs mcp/system/memory/llm tests. Run `pytest packages/common/tests/` separately if needed.

---

## Understanding the Architecture

### Execution Flow

```
1. Load spec.yaml
2. Validate guardrails
3. Plan tasks
4. Check approvals
5. Execute handlers (sandboxed if required)
6. Append run history
7. Send notifications
```

### Key Components

| Component | Purpose | Location |
| --- | --- | --- |
| Execution Loop | validate → plan → execute → notify | `packages/system/src/fridai_system/execution/loop.py` |
| Handler Registry | Decorator-based handler registration | `packages/system/src/fridai_system/execution/registry.py` |
| System Bridge | Hub → System HTTP bridge | `packages/mcp/src/fridai_mcp/system_bridge.py` |
| Memory Service | Search + storage backends | `packages/memory/src/fridai_memory_mcp/` |
| Notifications | Slack/Email/Jira clients | `packages/common/src/fridai_common/notifications/` |
| Secrets | Env → secrets.yaml → GSM | `packages/common/src/fridai_common/secrets/` |

---

## Environment Variables

### Core

```bash
FRIDAI_MCP_API_KEY=your-key
FRIDAI_PROFILE=default
FRIDAI_TMP_DIR=/tmp/fridai-core
```

### System/MCP

```bash
FRIDAI_SYSTEM_URL=http://127.0.0.1:8000
FRIDAI_MCP_ALLOWLIST=spec_exec,spec_validate
FRIDAI_ALLOW_INSECURE_MCP=1  # dev only
```

### Memory

```bash
FRIDAI_MEMORY_MCP_URL=http://127.0.0.1:3922
FRIDAI_MEMORY_STORE=local              # local, gcs, pinecone, hybrid, vector_gcs
FRIDAI_MEMORY_GCS_DRIVER=stub          # stub, live
FRIDAI_MEMORY_LOCAL_PATH=/tmp/fridai-core/memory/local_store
FRIDAI_MEMORY_PINECONE_API_KEY=xxx
FRIDAI_MEMORY_PINECONE_ENV=us-east-1
FRIDAI_MEMORY_PINECONE_INDEX=fridai
FRIDAI_MEMORY_GCS_BUCKET=your-bucket
FRIDAI_MEMORY_GCS_PREFIX=memory/
```

### Notifications (Optional)

```bash
FRIDAI_SLACK_WEBHOOK_URL=...
FRIDAI_EMAIL_USERNAME=...
FRIDAI_EMAIL_PASSWORD=...
FRIDAI_JIRA_USER=...
FRIDAI_JIRA_TOKEN=...
```

---

## Common Workflows

### Create Spec Companion Docs

`fridai spec init` creates `intent.md`, `plan.md`, and `tasks.md` for the primary spec.
The canonical spec lives under `packages/system/specs/active/<spec>/spec.yaml`.

```bash
fridai spec init
fridai spec edit intent
```

### Approvals

```bash
# List pending approvals
fridai approvals list --status pending

# Approve a request
fridai approvals decide <record_id> --decision approve --approver ops-lead

# Deny a request
fridai approvals decide <record_id> --decision deny --approver ops-lead --notes "Needs more testing"
```

### Notifications

```bash
cat <<'JSON' > tmp/notify_summary.json
{
  "run_id": "manual-test",
  "status": "success",
  "tasks": [],
  "issues": []
}
JSON

fridai notify --channel slack --summary-file tmp/notify_summary.json
```

### Run History & Approvals Rotation

```bash
# Run history rotation
fridai history --dry-run
fridai history --apply --upload

# Approval log rotation
fridai approvals rotate --dry-run
fridai approvals rotate --skip-upload
```

---

## Development Workflow

1. Edit code in `packages/*/src/`
2. Run tests: `make test`
3. Run lint: `make lint`
4. Run smoke tests: `make smoke-test`
5. Commit (editable installs reflect changes immediately)

---

## Adding a Handler (System)

```python
from fridai_system.execution.decorators import register_handler
from fridai_system.execution.models import HandlerClass
from fridai_system.execution.types import ExecutableTask, ExecutionContext, TaskResult

@register_handler(
    "my.handler",
    handler_class=HandlerClass.READ_ONLY,
    requires_approval=False,
)
def my_handler(task: ExecutableTask, context: ExecutionContext, request=None) -> TaskResult:
    return TaskResult(
        task_id=task.id,
        status="success",
        artefacts={"output": "done"},
    )
```

---

## Adding an MCP Tool

```python
from fridai_mcp.server import mcp_tool

@mcp_tool(name="my_tool", description="Describe the tool")
def my_tool(arg1: str, arg2: int) -> dict:
    return {"result": "success"}
```

---

## Key Documentation

### Runbooks
- `docs/runbooks/HUB_MCP_RUNBOOK.md`
- `docs/runbooks/SYSTEM_RUNBOOK.md`
- `docs/runbooks/MEMORY_RUNBOOK.md`
- `docs/runbooks/COMMON_RUNBOOK.md`
- `docs/runbooks/SYSTEM_FLOW.md`

### Guides
- `docs/guides/CLI_REFERENCE.md`
- `docs/guides/SCHEMA_GUIDE.md`
- `docs/guides/DEVELOPER_REFERENCE.md`
- `docs/guides/MCP-SERVICES-GUIDE.md`
- `docs/guides/SECRETS_ROTATION.md`

### Testing & CI
- `docs/testing_and_CI/TESTING.md`
- `docs/testing_and_CI/TESTING_FLOW.md`
- `docs/testing_and_CI/CI_WORKAROUNDS.md`

### Project Logs
- `docs/CHANGELOG.md`
- `docs/DECISION_LOG.md`

---

## Troubleshooting

### Services Won't Start

```bash
# Check ports
lsof -nP -iTCP:3921 -iTCP:3922 -iTCP:8000

# Stop services
mcp stop

# Restart
mcp restart
```

### Tests Failing

```bash
export CI=true
export FRIDAI_MEMORY_STORE=local
export FRIDAI_MEMORY_GCS_DRIVER=stub

make test
```

### Import Errors

```bash
pip list | grep fridai
# Reinstall missing packages:
pip install -e ./packages/common -e ./packages/system -e ./packages/mcp -e ./packages/memory -e ./packages/llm
```

---

## Getting Help

- **Docs**: start with this file, then runbooks/guides
- **Logs**: `mcp logs` or check `tmp/logs/`
- **Tests**: `make test` and `make smoke-test`
- **Issues**: https://github.com/garrettschumacher/fridai-core/issues

---

*Last Updated: 2025-12-12*
