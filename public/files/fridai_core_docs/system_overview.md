# System Package Overview

**Last Updated**: 2025-12-12

The System package (`fridai_system`) is the core automation engine for FridAI. It validates specs, executes automation tasks, manages approvals, handles notifications, and provides secure sandbox execution.

---

## Components

### Execution Loop
**Location**: [src/fridai_system/execution/](../../../packages/system/src/fridai_system/execution/)

The execution loop validates specs, runs handlers, and persists run history.

**Key Classes**:
- `ExecutionLoop` - Main automation orchestration
- `Result` - Execution outcome with status, issues, tasks, next actions

**Key Methods**:
- `validate_spec()` - Validate unified spec.yaml (intent, plan, tasks, metadata)
- `run_async()` - Execute automation loop (async)
- `run()` - Execute automation loop (sync wrapper)

### Approvals System
**Location**: [src/fridai_system/approvals/](../../../packages/system/src/fridai_system/approvals/)

Manages approval workflow for high-risk operations.

**Key Classes**:
- `ApprovalLog` - CRUD operations on approvals.json
- `ApprovalRecord` - Individual approval entry
- `ApprovalStatus` - Enum: PENDING, APPROVED, DENIED

### CLI
**Location**: [src/fridai_system/cli/](../../../packages/system/src/fridai_system/cli/)

Command-line interface for all system operations.

**Commands**:
- `fridai validate` - Validate spec files
- `fridai exec` - Execute automation (with --dry-run)
- `fridai notify` - Test notification channels
- `fridai history` - View/rotate run history
- `fridai spec` - Publish specs to memory
- `fridai approvals` - Manage approval records
- `fridai callbacks` - Register/resume callback tokens
- `fridai config` - Inspect resolved secrets

### Memory Integration
**Location**: [src/fridai_system/memory/](../../../packages/system/src/fridai_system/memory/)

Interfaces with memory MCP for spec discovery.

**Key Functions**:
- `search_memory()` - Local/Pinecone spec search
- `publish_specs()` - Publish spec cards to memory

### Sandbox System
**Location**: [src/fridai_system/sandbox/](../../../packages/system/src/fridai_system/sandbox/)

**Status**: Phase 1-2 complete (77/77 items) - Production-ready secure execution environment

Provides isolated, secure execution for high-risk handlers with comprehensive security controls.

**Key Components**:
- `SandboxConfig` - YAML-based profile system (default/dev/production)
- `bundle.py` - Manifest creation with HMAC-SHA256 signing
- `deploy.py` - Docker image building and GCS deployment
- `launch.py` - Secure execution with resource limits and monitoring
- `artifacts.py` - GCS artifact upload with retry logic
- `logs.py` - Structured log upload and audit logging
- `cleanup.py` - Cleanup utilities for bundles/images/containers

**Security Features** (Phase 1.0-1.4):
- ✅ Non-root user (uid 1000)
- ✅ Capability dropping (--cap-drop=ALL)
- ✅ Read-only rootfs with tmpfs /tmp
- ✅ Resource limits (memory: 512m, CPU: 1.0, PIDs: 256)
- ✅ Network isolation (mode: none by default)
- ✅ Manifest signing & verification
- ✅ Supply chain security (base image digest pinning)

**Operational Features** (Phase 2.1-2.4):
- ✅ Artifact extraction & GCS upload
- ✅ Timeout enforcement (default 600s)
- ✅ Real-time log streaming
- ✅ Docker retry logic with exponential backoff
- ✅ Multi-stage Dockerfile optimization (< 300MB)

**See**: [SANDBOX_GUIDE.md](../../guides/SANDBOX_GUIDE.md) for complete documentation

### Scripts
**Location**: [src/fridai_system/scripts/](../../../packages/system/src/fridai_system/scripts/)

**Utilities**:
- `approval_rotate.py` - Archive old approval records
- `run_history_rotate.py` - Archive old run history

---

## Configuration

**Runtime Config**: Presets → `RuntimeConfig`
- Primary source is `config/presets/*.yaml` loaded by `PresetLoader`.
  - Repository: `config/presets/<preset>.yaml`
  - User-local: `~/.fridai/presets/<preset>.yaml`
- The active preset is resolved via `FRIDAI_PROFILE` or `.active`; the default
  is `config/presets/default.yaml`.
- Legacy `config/profiles/*.yaml` are only used as a fallback when presets are
  missing. `ConfigLoader` maps preset values into a typed `RuntimeConfig`.

**Spec File**: `packages/system/specs/active/<spec>/spec.yaml`
- `spec.yaml` - Unified spec with intent, plan (array), tasks (array), metadata
  - `spec.intent` - What to automate
  - `spec.plan` - Implementation steps
  - `spec.tasks` - Task definitions and handlers

**Run History**: `tmp/logs/system/run_history.json`
- Latest 50 runs (configurable)
- Rotation via `run_history_rotate.py`

---

## Quick Reference

### Validation
```python
from fridai_system.execution.loop import ExecutionLoop

loop = ExecutionLoop()
result = loop.validate_spec()
print(result.status)  # "success", "warning", or "error"
```

### Execution (Async)
```python
from fridai_system.execution.loop import ExecutionLoop

loop = ExecutionLoop()
result = await loop.run_async(allowed_channels={"cli"})
```

### Approvals
```python
from fridai_system.approvals.log import ApprovalLog

log = ApprovalLog()
record = log.create_request(
    handler_id="repo-sync",
    handler_class="infrastructure",
    summary="Sync files to prod",
    requested_by="automation"
)
```

---

## Architecture

```
ExecutionLoop
├── validate_spec()
│   ├── Load spec.yaml
│   ├── Validate structure (intent/plan/tasks)
│   └── Return Result
├── run_async()
│   ├── Validate spec
│   ├── Load handlers
│   ├── Check approvals
│   ├── Execute handlers
│   ├── Send notifications
│   └── Write run_history.json
└── Notification System
    ├── Slack (webhook)
    ├── Gmail (OAuth)
    ├── Jira (API)
    └── CLI (stdout)
```

---

## Testing

**Unit Tests**: `packages/system/tests/` (83 tests)
**Smoke Tests**: `tests/` (16 integration tests)

```bash
# From monorepo root
pytest packages/system/tests/ -v

# Smoke tests
pytest tests/ -v -m smoke
```

---

## See Also

- [Package README](../../../packages/system/README.md) - Installation and quick start
- [CLI Reference](cli.md) - Detailed CLI documentation
- [Handlers](handlers.md) - Writing custom handlers
- [Approvals](approvals.md) - Approval workflow
- [Handler Guide](../../guides/HANDLER_GUIDE.md) - Handler/task contract, approvals, sandbox, retries
