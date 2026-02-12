# Schema Guide

Reference for JSON Schemas generated from Pydantic models across FridAI Core.

---

## Where schemas live

```
packages/mcp/schemas/          # MCP hub tool/resource schemas
packages/memory/schemas/       # Memory MCP schemas
packages/system/schemas/       # System execution schemas
```

---

## How schemas are generated

- Pydantic models marked with `@schema_exportable` are the source of truth.
- `scripts/generate_schemas.py` imports exportable models and writes JSON to the
  schema directories above.
- Do not hand-edit schema JSON files.

Regenerate:

```bash
python scripts/generate_schemas.py          # all packages
python scripts/generate_schemas.py --package mcp
python scripts/generate_schemas.py --package system
python scripts/generate_schemas.py --package memory
```

---

## System schemas

Generated from:

- `packages/system/src/fridai_system/spec_metadata.py` → `spec_yaml.schema.json`
- `packages/system/src/fridai_system/execution/types.py` → execution context/task/task_result schemas
- `packages/system/src/fridai_system/execution/models.py` → retry policy schema
- `packages/system/src/fridai_system/system_service.py` → API response schemas

Notes:

- `spec.sandbox` is defined by the shared `SpecSandbox` model and includes
  `requires_network`, `ttl_minutes`, `fork_allowed`, etc.
- `tasks[].sandbox` is intentionally a free-form object in the spec schema.
- `TaskResult` fields include `task_id`, `status`, `duration_seconds`,
  `notes`, `artefacts`, `error_code`, `remediation_hints`.
- Approval schemas include optional provenance binding fields:
  `spec_hash`, `artifact_hash`, `handler_params_hash`, `workspace_root`.

---

## MCP schemas

Generated from `packages/mcp/src/fridai_mcp/models.py`. Examples include:

- `spec_validate_request.schema.json`
- `spec_execute_request.schema.json`
- `runs.history.get.request.schema.json`
- `approvals.recent.get.request.schema.json`
- `callbacks.register.request.schema.json`
- `system_world.schema.json`

MCP schemas describe tool inputs/outputs and resource payloads for the hub.

---

## Memory schemas

Generated from `packages/memory/src/fridai_memory_mcp/models.py`. Examples include:

- `memory.search.request.json`
- `memory.search.response.json`
- `memory.write.request.json`
- `memory.recent.response.json`
- `spec.find.request.json`
- `spec.find.response.json`
- `spec.help.request.json`

---

## Schema catalog (selected)

| Area | Schema file | Purpose |
| --- | --- | --- |
| MCP | `spec_execute_request.schema.json` | Run a spec via the MCP hub tool. |
| MCP | `runs.history.get.request.schema.json` | Query run history. |
| MCP | `approvals_request.schema.json` | Request an approval from an approver. |
| MCP | `callbacks.register.request.schema.json` | Register a callback for async resume. |
| MCP | `system_world.schema.json` | Resource payload for `system.world`. |
| Memory | `memory.search.request.json` | Search memory. |
| Memory | `memory.write.request.json` | Write to memory. |
| System | `spec_yaml.schema.json` | YAML spec structure (the canonical spec schema). |
| System | `execution.task_result.schema.json` | Per-task runtime result data. |

---

## Examples

### Spec YAML sandbox block

`spec.sandbox` uses the shared `SpecSandbox` schema:

```yaml
spec:
  sandbox:
    include_template: true
    template_version: v1
    ttl_minutes: 15
    base_branch: main
    branch_prefix: sandbox
    fork_allowed: false
    requires_network: false
    target_repo: git@github.com:org/repo.git
```

`tasks[].sandbox` is free-form in the schema. Typical usage:

```yaml
tasks:
  - id: git-clone
    handler: git_clone
    handler_class: sensitive
    requires_approval: true
    sandbox:
      required: true
      providers: [docker]
      requires_network: true
```

### MCP tool request example

`spec_execute_request.schema.json`:

```json
{
  "spec_id": "spec.git_pipeline",
  "dry_run": true,
  "notify": false,
  "allowed_channels": ["cli"],
  "profile": "default"
}
```

`runs.history.get.request.schema.json`:

```json
{
  "limit": 10,
  "offset": 0,
  "status": "success",
  "sort": "desc",
  "spec_id": "spec.git_pipeline"
}
```

### Approval flow examples

`approvals_request.schema.json`:

```json
{
  "handler_id": "slack",
  "handler_class": "notifications",
  "summary": "Approve running spec.git_pipeline on main.",
  "requested_by": "cli",
  "run_id": "run_2025_01_15_120100",
  "channels_notified": ["cli"],
  "spec_hash": "sha256:abc123...",
  "artifact_hash": "sha256:def456...",
  "handler_params_hash": "sha256:ghi789...",
  "workspace_root": "/path/to/workspace"
}
```

`approvals_decision_request.schema.json`:

```json
{
  "id": "appr_2025_01_15_120200",
  "decision": "approved",
  "approver": "garrett",
  "notes": "Looks good."
}
```

### Callback registration/resume

`callbacks.register.request.schema.json`:

```json
{
  "run_id": "run_2025_01_15_120100",
  "task_id": "deploy",
  "callback_url": "https://example.com/fridai/callback",
  "ttl_minutes": 30
}
```

`callbacks.resume.request.schema.json`:

```json
{
  "token": "cb_2025_01_15_120500",
  "payload": {
    "status": "ok"
  }
}
```

### System world payload

`system_world.schema.json`:

```json
{
  "system_status": "idle",
  "approval_policy": {
    "mode": "required"
  },
  "pending_approvals": [],
  "handler_catalog": [],
  "recent_artifacts": [],
  "last_updated": "2025-01-15T12:05:00Z"
}
```

### Run history response

`runs.history.response.schema.json`:

```json
{
  "total": 2,
  "limit": 10,
  "offset": 0,
  "runs": [
    {
      "run_id": "run_2025_01_15_120100",
      "spec_id": "spec.git_pipeline",
      "status": "success",
      "timestamp": "2025-01-15T12:01:00Z"
    },
    {
      "run_id": "run_2025_01_15_120300",
      "spec_id": "spec.git_pipeline",
      "status": "failed",
      "timestamp": "2025-01-15T12:03:00Z"
    }
  ]
}
```

### Memory request example

`memory.search.request.json`:

```json
{
  "query": "git pipeline",
  "limit": 5
}
```

### TaskResult example

`execution.task_result.schema.json`:

```json
{
  "task_id": "git-clone",
  "status": "error",
  "duration_seconds": 0.42,
  "error_code": "REPO_NOT_ALLOWED",
  "notes": "Repo not allowlisted",
  "remediation_hints": [
    "Add repo to spec.sandbox.allowed_repos"
  ],
  "artefacts": []
}
```

---

## Usage patterns

### Tool input/output validation

MCP tools validate requests and return responses matching the corresponding
schema files in `packages/mcp/schemas/`.

### CLI validation

```bash
# Validation report is schema-backed
fridai validate --output json
```

### Python validation

```python
from fridai_system.execution.models import RetryPolicy
from pydantic import ValidationError

try:
    RetryPolicy(max_attempts=3, backoff_multiplier=2.0)
except ValidationError as exc:
    print(exc)
```

---

## See Also

- `docs/guides/CLI_REFERENCE.md`
- `docs/runbooks/SYSTEM_RUNBOOK.md`
- `docs/runbooks/HUB_MCP_RUNBOOK.md`
