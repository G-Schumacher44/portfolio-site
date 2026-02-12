# CLI Reference

Pure command reference for FridAI Core CLIs. For tutorials and workflows, see [START_HERE.md](../START_HERE.md).

---

## `mcp` - MCP Service Management

Manage MCP hub, system service, memory, and remote services.

### Main Command

```
Usage: mcp [OPTIONS] COMMAND [ARGS]...

  MCP Control - Manage MCP services and adapters.

  This tool manages the Fridai Hub MCP server, remote MCP clients, and STDIO
  adapters for desktop integration. FastMCP entrypoints and legacy bin scripts
  are deprecated; use this CLI instead.

  Examples:
    mcp start                 # Start system + memory + hub (remotes disabled by default)
    mcp start --enable-remotes  # Start system + memory + hub and initialize enabled remotes
    mcp start-system          # Start only system service (validate/execute)
    mcp start-memory          # Start only memory MCP
    mcp start-hub             # Start only hub MCP
    mcp remote start github_local  # Explicitly start a stdio remote
    mcp status                # Check status of hub/remotes/adapters
    mcp validate-config       # Validate remotes.yaml/adapters.yaml
    mcp --dry-run start       # Preview what would happen

  Environment Variables:
    FRIDAI_PROFILE             Preset for remote targeting (e.g., dev, ci)
    FRIDAI_SKIP_REMOTE_INIT    Default remote init behavior (1 = skip, 0 = init)
    FRIDAI_SKIP_SECRET_FETCH   Skip automatic secret fetching
    FRIDAI_TMP_DIR             Temp directory for logs/PIDs
    MCP_DEBUG                  Enable debug output
    MCP_DRY_RUN                Enable dry-run mode

Options:
  --dry-run  Show what would be executed without actually doing it
  --help     Show this message and exit.

Commands:
  adapter          Manage STDIO adapters.
  profile          Manage MCP presets (list/status/use).
  restart-remote   Reload remote configuration (optional --profile).
  install          Install launchd services (auto-start on login).
  logs             View server logs in follow mode.
  restart          Restart all MCP services (system + memory + hub).
  restart-system   Restart only system service.
  restart-hub      Restart only Hub MCP service.
  restart-memory   Restart only Memory MCP service.
  start            Start all MCP services (system + memory + hub).
  start-system     Start only system service.
  start-hub        Start only Hub MCP service.
  start-memory     Start only Memory MCP service.
  start-remote     Start hub and initialize specific remote.
  status           Show status of all MCP services.
  status-system    Show status of system service.
  status-hub       Show status of Hub MCP.
  status-memory    Show status of Memory MCP.
  status-remote    Show status of specific remote MCP.
  status-remotes   Show status of all remote MCPs.
  stop             Stop all MCP services.
  stop-system      Stop only system service.
  stop-hub         Stop only Hub MCP service.
  stop-memory      Stop only Memory MCP service.
  stop-remote      Info about stopping remotes.
  uninstall        Uninstall launchd services (disable auto-start).
  validate-config  Validate MCP configuration files.
```

### Common Usage

```bash
# Start hub + memory
mcp start

# Check status
mcp status

# View logs
mcp logs

# Install auto-start
mcp install

# Restart services
mcp restart

# Stop services
mcp stop

# Profiles
mcp profile list          # show available presets
mcp profile status        # show current preset and remotes file
mcp profile use dev       # set active preset to config/presets/dev.yaml and reload hub
mcp restart-remote --profile production  # reload remotes without full restart
mcp start --enable-remotes --profile <name>  # start stack with selected preset
mcp start-hub --enable-remotes --profile data_engineering  # start hub only with preset

# Run history (system service via MCP hub)
# Resource URI: runs.history/{limit}?offset=<n>&status=<success|error>&sort=<asc|desc>&handler_id=<id>&spec_id=<spec.id>
# Example:
#   resources/read {
#     "uri": "runs.history/{limit}",
#     "arguments": {
#       "limit": 10,
#       "offset": 0,
#       "status": "success",
#       "sort": "asc",
#       "handler_id": "file.write",
#       "spec_id": "spec.git_pipeline"
#     }
#   }

# MCP JSON-RPC tools (for agents/automation)
# Help/usage: spec_help, approvals_help, callbacks_help, system_help
# Validation: key tools use Pydantic arg models to fail fast on missing/extra args (no 500s).
# Common calls:
#   tools/call {"name": "spec_help"}
#   tools/call {"name": "approvals_help"}
#   tools/call {"name": "callbacks_help"}
#   tools/call {"name": "system_help"}
#   tools/call {"name": "spec_exec", "arguments": {"spec_id": "spec.data_pipeline", "dry_run": true}}

# Handler-backed tools (system MCP)
#   tools/call {"name": "git_clone", "arguments": {"repo_url": "...", "branch": "main"}}
#   tools/call {"name": "gcs_read", "arguments": {"bucket": "...", "path": "..."}}  # allowlist enforced
#   tools/call {"name": "bigquery_query", "arguments": {"project": "...", "dataset": "...", "sql": "SELECT 1"}}
#   tools/call {"name": "dataflow_submit", "arguments": {"project": "demo", "region": "us-central1", "template_path": "gs://.../template", "parameters": {"input": "...", "output": "..."}}}
```

---

## `fridai` - System Automation CLI

Spec-driven automation engine for validation, execution, and approvals.

### Main Command

```
Usage: fridai [OPTIONS] COMMAND [ARGS]...

  Fridai spec-driven automation CLI.

Options:
  --version   Show the version and exit.
  -h, --help  Show this message and exit.

Commands:
  approvals  Manage approval requests and decisions.
  callbacks  Manage callback/resume tokens.
  config     Configuration helpers.
  exec       Execute the full automation loop (validate → plan → run → notify).
  history    Rotate local run history and archive entries.
  notify     Send a manual notification using the configured channel.
  spec       Initialize or edit spec documents.
  validate   Validate spec + runtime configuration guardrails.
```

### Quick Examples

```bash
# Validate active spec under the current preset
fridai validate

# Dry-run git pipeline (clone → append → commit → push) with approvals
fridai exec --spec spec.git_pipeline --dry-run

# Dry-run data pipeline (GCS read → BQ query → GCS write)
fridai exec --spec spec.data_pipeline --dry-run
```

### `fridai validate`

```
Usage: fridai validate [OPTIONS]

  Validate spec + runtime configuration guardrails.

Options:
  --config PATH                   Optional path to generated RuntimeConfig
                                  JSON for legacy checks and CI; presets are
                                  the canonical runtime source.
  --output [text|json]            Output format for the validation report.
                                  [default: text]
  --fail-on-warning / --allow-warning
                                  Exit with non-zero status if warnings are
                                  present.  [default: allow-warning]
  -h, --help                      Show this message and exit.
```

### `fridai exec`

```
Usage: fridai exec [OPTIONS]

  Execute the full automation loop (validate → plan → run → notify).

Options:
  --config PATH                   Optional path to RuntimeConfig JSON. When
                                  provided, this overrides preset-derived
                                  runtime settings for this invocation only.
  --dry-run / --run               Skip non-CLI notifications (and other side
                                  effects once handlers support it).
                                  [default: run]
  --notify [cli|slack|email|jira|all]
                                  Restrict notification channels for this run.
  --output [text|json]            Output format for run summary.  [default:
                                  text]
  --profile TEXT                  Optional runtime preset name (loads
                                  config/presets/<name>.yaml).
  --spec TEXT                     Spec identifier to execute (required).
  -h, --help                      Show this message and exit.
```

### `fridai notify`

```
Usage: fridai notify [OPTIONS]

  Send a manual notification using the configured channel.

Options:
  --config PATH      Optional path to RuntimeConfig JSON. When provided,
                     this overrides preset-derived runtime settings for
                     this invocation only.
  --channels TEXT    Restrict notification channels for this run.
  --message TEXT     Custom message to send.
  -h, --help         Show this message and exit.
```

### `fridai history`

```
Usage: fridai history [OPTIONS] COMMAND [ARGS]...

  Rotate local run history and archive entries.
```

Common patterns:

- Rotate and archive history using the default path:
  ```bash
  fridai history rotate
  ```
- Override run-history path for this command via env:
  ```bash
  FRIDAI_RUN_HISTORY_PATH=/tmp/fridai-runs.json fridai history rotate
  ```

### `fridai spec`

```
Usage: fridai spec [OPTIONS] COMMAND [ARGS]...

  Initialize or edit spec documents.

Options:
  -h, --help  Show this message and exit.

Commands:
  edit     Edit a spec document.
  find     Search published specs via the memory MCP.
  init     Create default spec.yaml from template.
  publish  Publish specs into the memory MCP (ingest + load).

Examples:

- List specs via memory MCP:
  ```bash
  fridai spec find "git pipeline"
  ```
- Publish local specs (active tree) to memory:
  ```bash
  fridai spec publish --spec-root packages/system/specs/active
  ```
```

### `fridai approvals`

```
Usage: fridai approvals [OPTIONS] COMMAND [ARGS]...

  Manage approval requests and decisions.

Options:
  -h, --help  Show this message and exit.

Commands:
  decide   Mark an approval request as approved or denied.
  list     List approval records.
  request  Create a pending approval request.
  rotate   Rotate approval log entries and archive older records.
```

### `fridai callbacks`

```
Usage: fridai callbacks [OPTIONS] COMMAND [ARGS]...

  Manage callback/resume tokens for paused runs.

Options:
  -h, --help  Show this message and exit.

Commands:
  register  Register a callback target for a paused run.
  resume    Mark a callback as resumed.
```

### Common Usage

```bash
# Validate spec
fridai validate

# Execute with dry-run
fridai exec --spec spec.git_pipeline --dry-run

# Execute for real
fridai exec --spec spec.git_pipeline

# Search for specs
fridai spec find "deployment automation"

# Publish specs to memory
fridai spec publish --spec-root packages/system/specs/active

# List approvals
fridai approvals list

# Request approval
fridai approvals request --handler deploy.k8s --reason "Deploy staging"

# Approve a handler (affects execution)
fridai approvals decide --id <approval-id> --status approved

# Effect on execution:
# - Approved records are loaded by ApprovalService and consulted during
#   Executor.guard/execute. When a handler is approved (globally or for a
#   specific run_id), ApprovalService.evaluate(...) returns an "allowed"
#   decision, and the handler passes approval checks during execution.
```

---

## `sandbox` - Sandbox Launcher

Low-level CLI for creating, deploying, and launching sandboxes. This is useful for testing the sandbox functionality directly.

### Main Command

```
Usage: python -m fridai_system.sandbox.launcher [OPTIONS] COMMAND [ARGS]...

  Sandbox launcher CLI.

Options:
  --help  Show this message and exit.

Commands:
  run  Bundle spec files + manifest for sandbox execution.
```

### `sandbox run`

```
Usage: python -m fridai_system.sandbox.launcher run [OPTIONS]

  Bundle spec files + manifest for sandbox execution.

Options:
  --spec-dir PATH               Path to spec directory.  [required]
  --handler-id TEXT             Handler identifier invoking the sandbox.
                                [required]
  --provider [gcs|docker]       [required]
  --output-dir PATH             [default: tmp/sandbox/bundles]
  --ttl-minutes INTEGER         [default: 15]
  --allow-repo TEXT             Whitelisted git repo (repeatable).
  --allow-bucket TEXT           Whitelisted GCS bucket (repeatable).
  --allow-bq TEXT               Whitelisted BigQuery dataset (repeatable).
  --extra-file PATH             Extra file to include in bundle.
  --gcs-path TEXT               GCS URI (gs://bucket/prefix) or local
                                directory when using the GCS provider.
  --docker-image-name TEXT      Name for the Docker image to be built (e.g.,
                                'my-sandbox:latest').
  --help                        Show this message and exit.

Notes:
- Runtime flags come from sandbox profiles (`packages/system/sandbox/profiles/*.yaml`). Override profile via `FRIDAI_SANDBOX_PROFILE` or config path via `FRIDAI_SANDBOX_CONFIG`.
- Launch mounts bundle → `/app/bundle:ro`, spec (if provided) → `/app/spec:ro`, artifacts → `/app/artifacts:rw`. Manifest is read from `/app/bundle/sandbox_manifest.json`; handler params passed via `HANDLER_PARAMS` env for allowlist enforcement.
- Network default is `--network none`; set `sandbox.requires_network: true` + `approval_required: true` in spec to allow `allow_network=True` at runtime.
```

---

## Environment Variables

### MCP Service Variables

```bash
FRIDAI_MCP_API_KEY          # Hub API key for X-API-Key header
FRIDAI_MCP_ALLOWLIST        # Comma-separated list of allowed tool IDs
FRIDAI_ALLOW_INSECURE_MCP   # Allow HTTP for remotes (dev only, default: false)
FRIDAI_MEMORY_MCP_URL       # Memory service URL (default: http://127.0.0.1:3922)
FRIDAI_PROFILE              # Preset for remotes (dev, ci, prod)
FRIDAI_SKIP_REMOTE_INIT     # Skip remote init on start (1 = skip, 0 = init)
FRIDAI_SKIP_SECRET_FETCH    # Skip automatic secret fetching
FRIDAI_TMP_DIR              # Temp directory for logs/PIDs/runtime
MCP_DEBUG                   # Enable debug output
MCP_DRY_RUN                 # Enable dry-run mode
```

### System Variables

```bash
FRIDAI_MEMORY_STORE         # Memory store type (local, hybrid, pinecone)
FRIDAI_MEMORY_GCS_DRIVER    # GCS driver (stub, real)
```

### Secret Resolution

Secrets resolved in order: `config/secrets.yaml` mapping → env var → Google Secret Manager

Common secrets:
- Pinecone: `FRIDAI_MEMORY_PINECONE_API_KEY`, `FRIDAI_MEMORY_PINECONE_ENV`, `FRIDAI_MEMORY_PINECONE_INDEX`
- GCS: `FRIDAI_MEMORY_GCS_BUCKET`, `FRIDAI_MEMORY_GCS_PREFIX`
- Notifications: Slack/Jira/Email credentials (see [SECRETS_ROTATION.md](SECRETS_ROTATION.md))

---

## See Also

- [MCP-SERVICES-GUIDE.md](MCP-SERVICES-GUIDE.md) - Service operations and troubleshooting
- [START_HERE.md](../START_HERE.md) - Getting started tutorial
- [DEVELOPER_REFERENCE.md](DEVELOPER_REFERENCE.md) - Quick dev cheatsheet
- [PRESET_GUIDE.md](PRESET_GUIDE.md) - Preset configuration and resolution
- [SECRETS_ROTATION.md](SECRETS_ROTATION.md) - Secret management and rotation
