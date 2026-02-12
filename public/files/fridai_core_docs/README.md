<p align="center">
  <img src="docs/assets/fridai_hero_banner.png" alt="FridAI Core hero banner" width="900">
</p>
<p align="center"><i>MCP Aggregation Hub • Vector Memory • Agentic Automation • Governance-First Execution</i></p>
<p align="center">
  <img src="https://img.shields.io/badge/python-3.11+-blue.svg" alt="Python 3.11+">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/status-dev%20preview-orange.svg" alt="Status: Dev Preview">
  <img src="https://github.com/garrettschumacher/fridai-core/actions/workflows/ci.yml/badge.svg" alt="CI">
  <a href="https://codecov.io/gh/garrettschumacher/fridai-core"><img src="https://codecov.io/gh/garrettschumacher/fridai-core/graph/badge.svg" alt="codecov"></a>
</p>

# FridAI Core

I built FridAI to make AI automation trustworthy by default — approvals, sandboxing, and audits aren't add-ons here.
This started as my own need for safe AI automation and evolved through five sandbox hardening phases, real LLM model testing (including the hard lessons of running 7B/8B models in structured tool-calling loops), and 447+ tests including adversarial security suites.
My goal with FridAI is simple: let assistants move fast, while humans stay in control.

> **TLDR:** FridAI lets AI assistants execute governed workflows through a single MCP hub — with profile-based tool filtering, approval gates, Docker sandboxing, and vector memory for spec discovery. Write a YAML spec, point your AI at the hub, and it handles the rest.

## A note from the developer

This is a solo dev project in active development (v0.1.0). The core architecture is stable and tested, but this is a development preview — APIs may change, some features are partial, and documentation is catching up. If you're here to explore, contribute, or just see how it works: welcome. Check the [ROADMAP](ROADMAP.md) for what's working and what's next.

---

<details>
<summary><b>What Problems Does This Solve?</b> (click to expand)</summary>

AI assistants face three critical challenges when working with users:

#### 1. **Tool Bloat & Governance at Scale** → MCP Aggregation Hub

AI assistants get overwhelmed when connected to dozens of MCP servers, each exposing 10+ tools. FridAI's **MCP Hub** acts as a single aggregation point with **user profile-based tool filtering**:

- **Single connection** - AI connects to one hub (port 3921) instead of N servers
- **User profiles** - Different users/roles get different tool sets (e.g., `data_engineering` profile only gets BigQuery/GCS tools)
- **Tool allowlists** - Admins control which tools are exposed per profile (prevent tool fatigue)
- **Unified authentication** - One API key for all backend services
- **Remote proxying** - Connect to external MCP servers with governance

**Example:** A data analyst gets `google_db_*` tools, while a DevOps engineer gets `github_*` and `jira_*` tools - same hub, different profiles.

#### 2. **Context Fatigue** → Vector Memory Service
Assistants lose context across sessions and struggle to find relevant automation specs. FridAI's **Memory Service** provides:
- **Semantic search** - Find specs by intent ("data pipeline for CSV cleaning")
- **Memory cards** - Structured metadata for each automation (Pinecone/GCS backed)
- **Session continuity** - Retrieve context from previous runs
- **Spec discovery** - Assistants can explore available automations

#### 3. **Lack of Governance** → Profile-Based Automation Engine

Users need control over what AI can execute, but manual approval for every action is tedious. FridAI's **Automation Engine** uses **profile-based governance**:

- **Approval profiles** - Pre-approve entire classes of operations (e.g., "all read-only tasks")
- **Sandboxed execution** - Untrusted code runs in isolated Docker containers
- **Self-hosted LLMs** - Run Ollama models locally for automation tasks (no API costs, full privacy)
- **Audit trails** - Every action logged with approver identity and timestamps
- **Guardrails** - Allowlists, resource limits, network isolation by default

**Real-World Use Cases:**
- **Data pipelines** - CSV cleaning, SQL queries, report generation (pre-approved for analysts)
- **Git automation** - Branch creation, PR workflows (requires approval for main branch)
- **System maintenance** - Config updates, secret rotation (approval for production)
- **Research tasks** - Web scraping, document analysis (sandboxed, no network by default)

</details>

---

<details>
<summary><b>How It Works</b> (click to expand)</summary>

```
┌──────────────────┐
│  AI Agent        │  (Claude, Gemini, Codex, etc.)
└────────┬─────────┘
         │ JSON-RPC (MCP protocol)
         ↓
┌──────────────────────────────────────────────────────────────┐
│  MCP Hub (Port 3921)                                         │
│  - API key auth + profile-based tool filtering               │
│  - Tool/resource allowlists per user role                    │
│  - Remote MCP server aggregation (GitHub, Jira, Google)      │
│  - MetricsCollector: latency p50/p95/p99, error rates        │
└────────┬──────────────────────────────────┬──────────────────┘
         │ HTTP                             │ HTTP
         ↓                                  ↓
┌────────────────────────────┐  ┌───────────────────────────┐
│  System Service (8000)     │  │  Memory Service (3922)    │
│                            │  │                           │
│  Execution Loop:           │  │  - Semantic spec search   │
│  1. Load spec.yaml         │  │  - Memory cards (context) │
│  2. Validate guardrails    │  │  - 6 storage backends     │
│  3. Check approvals        │  │    (local, SQLite,        │
│  4. Execute handlers       │  │     Pinecone, GCS,        │
│  5. Audit + notify         │  │     hybrid, in-memory)    │
│                            │  └───────────────────────────┘
│  Observability:            │
│  - Structured audit events │
│  - Container log upload    │
│  - /metrics endpoint       │
└────────┬───────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│  Docker Sandbox (Isolated Execution)                         │
│  - Non-root user, read-only rootfs                           │
│  - Network isolated by default (network=none)                │
│  - Dropped capabilities, seccomp filters                     │
│  - Artifact signing (HMAC-based integrity)                   │
│  - Timeout enforcement + graceful shutdown                   │
└──────────────────────────────────────────────────────────────┘
```

**Python monorepo** with 5 core packages:

| Package | Purpose | Port |
|---------|---------|------|
| **[system](packages/system/)** | Spec validation, execution loop, CLI | 8000 |
| **[mcp](packages/mcp/)** | FastMCP hub for AI tool/resource access | 3921 |
| **[memory](packages/memory/)** | Spec discovery + context retrieval (Pinecone/GCS) | 3922 |
| **[common](packages/common/)** | Shared utilities (secrets, notifications) | - |
| **[llm](packages/llm/)** | Self-hosted LLM handlers (Ollama: Qwen, DeepSeek, etc.) | - |

**Example Spec** (`packages/system/specs/active/data_pipeline/spec.yaml`):
```yaml
spec:
  id: spec.data_pipeline
  intent: "Clean CSV data and generate report"

  tasks:
    - id: read-csv
      handler: csv_reader
      params:
        path: data/input.csv
      requires_approval: false

    - id: clean-data
      handler: csv_cleaner
      params:
        input: data/input.csv
        output: data/cleaned.csv
      requires_approval: false
      sandbox:
        required: true  # Runs in Docker container

    - id: generate-report
      handler: markdown_report
      params:
        template: report.md.j2
        output: data/report.md
      requires_approval: false
```

**Execute It:**
```bash
fridai exec --spec spec.data_pipeline
```

</details>

---

## Key Concepts

**Handlers** are the Python functions that do actual work — `git.clone`, `file.write`, `llm.generate`, etc. Each handler is registered once in a central registry with metadata about approval requirements, sandbox settings, and retry policies.

**The same handlers are exposed in two ways:**

|  | MCP Tools (direct) | Spec Execution (guarded) |
| --- | --- | --- |
| **How** | AI agent calls tool via MCP hub | `fridai exec --spec ...` |
| **Validation** | Input schema only | Full spec + handler metadata |
| **Approvals** | None | Per-handler approval gates |
| **Sandboxing** | Optional | Enforced by profile/spec config |
| **Audit trail** | Implicit | Full run history + approval logs |
| **Use case** | Interactive exploration, testing | Production automation |

**Specs** are YAML workflow definitions that compose handlers into multi-step automations with governance. A spec declares intent, tasks (each referencing a handler), guardrails, and approval requirements.

**Tools** are MCP protocol wrappers that expose the same handlers directly to AI assistants for interactive use — useful for exploration, debugging, and one-off tasks.

<details>
<summary><b>Real Task Walkthrough</b> (spec → validate → execute → audit)</summary>

1. Write a spec (YAML) describing inputs, handlers, and sandbox requirements.
2. Validate:
```bash
fridai validate
```
3. Execute (approval-gated):
```bash
fridai exec --spec spec.data_cleanup
```
4. Audit:
```bash
fridai run-history list
fridai approvals list
```
</details>

---

## Quick Start

```bash
# Clone
git clone https://github.com/garrettschumacher/fridai-core.git
cd fridai-core

# Option A: Conda (installs all packages automatically)
conda env create -f environment.yml
conda activate fridai-core

# Option B: venv (install each package manually)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -e ./packages/common
pip install -e ./packages/system
pip install -e ./packages/mcp
pip install -e ./packages/memory
pip install -e ./packages/llm

# Set required API key for local development
export FRIDAI_MCP_API_KEY=dev-local-key-12345

# Start with minimal preset (no Docker, no cloud, no external MCP servers)
export FRIDAI_PROFILE=minimal
mcp start

# Validate a spec
fridai validate

# Execute a simple spec (notifications restricted to CLI)
fridai exec --spec spec.system_primary --dry-run
```

**What you get:**
- ✅ Core system + MCP hub + Memory service
- ✅ Local file-based memory (no Pinecone/GCS needed)
- ✅ No Docker required (sandbox disabled)
- ✅ No external MCP servers needed
- ✅ Works completely offline

**What's NOT included:**
- ❌ Sandboxed execution (requires Docker)
- ❌ External MCP servers (GitHub, Jira, Google Toolbox)
- ❌ Cloud storage (Pinecone, GCS)
- ❌ Notifications (Slack, Email)

---

## Connect Your AI Agent

The MCP Hub is a **single aggregation point** — your LLM Client1 connects to one endpoint instead of managing N separate MCP servers. The hub handles authentication, profile-based tool filtering (different users see different tools), and proxying to remote MCP servers (GitHub, Jira, Google Cloud Toolbox). A data analyst gets `google_db_*` tools while a DevOps engineer gets `github_*` and `jira_*` tools — same hub, different profiles.

Once `mcp start` is running, point your AI client at the hub.

**HTTP clients (Gemini CLI, Codex, custom)** — connect directly:
```bash
# Test the connection
curl -X POST http://localhost:3921/mcp \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-local-key-12345" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

**Claude Desktop** — uses the STDIO bridge (known intermittent connection issues — see [HUB_MCP_RUNBOOK](docs/runbooks/HUB_MCP_RUNBOOK.md) for workarounds):
```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "fridai-hub": {
      "command": "/path/to/fridai-core/bin/fridai_mcp_stdio_bridge.sh",
      "args": ["--no-start"],
      "env": { "FRIDAI_MCP_API_KEY": "your-api-key" }
    }
  }
}
```

See [docs/runbooks/HUB_MCP_RUNBOOK.md](docs/runbooks/HUB_MCP_RUNBOOK.md) for full client setup details.

---

<details>
<summary><b>📦 Full Installation (With All Features)</b> (click to expand)</summary>

### Prerequisites

**Minimum:**
- Python 3.11+

**Optional (enables additional features):**
- Docker (for sandboxed execution)
- Ollama (for self-hosted LLM tasks)
- External MCP servers (GitHub, Jira, Google Toolbox)
- Cloud credentials (GCS, Pinecone)

### Installation

```bash
git clone https://github.com/garrettschumacher/fridai-core.git
cd fridai-core

# Create environment
conda env create -f environment.yml
conda activate fridai-core

# Or use venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -e ./packages/common
pip install -e "./packages/system[secrets]"
pip install -e "./packages/mcp[dev]"
pip install -e "./packages/memory[dev]"
pip install -e "./packages/llm[dev]"
```

Verify installation:
```bash
pip list | grep fridai
```

### Start Services

```bash
# Start with default preset (includes external MCP servers if configured)
export FRIDAI_PROFILE=default
mcp start

# Or start with remotes explicitly enabled
mcp start --enable-remotes

# Check status
mcp status

# View logs
mcp logs
```

### Docker Compose (Optional)

```bash
make docker-build
make docker-up
```

See `docs/guides/DOCKER_GUIDE.md` for details.

### Optional: Install External MCP Servers

**GitHub MCP Server:**
```bash
# Install GitHub MCP server for git automation
npm install -g @modelcontextprotocol/server-github
export GIT_MCP_TOKEN="ghp_your_token_here"
```

**Google Cloud Toolbox:**
```bash
# Install Google Cloud toolbox for BigQuery/GCS
pip install google-cloud-bigquery google-cloud-storage
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

**Ollama (Self-Hosted LLM):**
```bash
# Install Ollama for local LLM support
brew install ollama  # macOS
ollama pull qwen2.5-coder:7b
```

</details>

<details>
<summary><b>🚀 Common Commands</b> (click to expand)</summary>

### Validate a Spec

```bash
fridai validate
fridai validate --output json
```

### Execute a Spec

```bash
# Dry run (executes but restricts notifications to CLI only)
fridai exec --spec spec.system_primary --dry-run

# Execute with notifications
fridai exec --spec spec.system_primary --notify cli --notify slack
```

### Search for Specs (Memory Service)

```bash
# Publish specs to memory
fridai spec publish --spec-root packages/system/specs/active

# Search for specs
fridai spec find "deployment automation"
```

</details>

---

## Security Model

<details>
<summary><b>🔒 Defense-in-Depth Security</b> (click to expand)</summary>

FridAI uses multiple security layers:

1. **Spec Validation**: Guardrails checked before execution (allowlists, resource limits)
2. **Approval Gates**: Human approval required for sensitive operations (configured per handler)
3. **Sandboxing**: Docker isolation with:
   - Non-root user
   - Read-only rootfs
   - Dropped capabilities (no CAP_SYS_ADMIN, etc.)
   - Network isolation by default (`network=none`)
   - Seccomp filters
4. **Provenance Tracking**: Every task execution records:
   - Approver identity
   - Approval timestamp
   - Request context
   - Artifact signatures (HMAC)
5. **Audit Logging**: Run history stored with:
   - Spec ID, task results, errors
   - Approval records
   - Execution timestamps

See [docs/guides/SANDBOX_GUIDE.md](docs/guides/SANDBOX_GUIDE.md) for details.

</details>

---

## Configuration

<details>
<summary><b>⚙️ Environment Variables & Presets</b> (click to expand)</summary>

Runtime config uses **presets** (`config/presets/*.yaml`):

```bash
# Use default preset
export FRIDAI_PROFILE=default

# Or specify at startup
mcp start --profile production
```

**Key Environment Variables:**
```bash
# Core
FRIDAI_MCP_API_KEY=your-key
FRIDAI_PROFILE=default
FRIDAI_TMP_DIR=/tmp/fridai-core

# System service
FRIDAI_SYSTEM_URL=http://127.0.0.1:8000
FRIDAI_MCP_ALLOWLIST=spec_exec,spec_validate

# Memory service
FRIDAI_MEMORY_STORE=local  # local, gcs, pinecone, hybrid
FRIDAI_MEMORY_LOCAL_PATH=/tmp/fridai-core/memory/local_store

# Notifications
FRIDAI_SLACK_WEBHOOK_URL=...
FRIDAI_EMAIL_USERNAME=...
```

See [docs/guides/CLI_REFERENCE.md](docs/guides/CLI_REFERENCE.md) for full config reference.

</details>

---

## Testing

<details>
<summary><b>🧪 Running Tests</b> (click to expand)</summary>

```bash
# Lint + type check
make lint

# Run all tests
make test

# Smoke tests only
make smoke-test
```

See [docs/testing_and_CI/TESTING.md](docs/testing_and_CI/TESTING.md) for test architecture.

</details>

---

<details>
<summary><b>Documentation</b> (click to expand)</summary>

**Start Here:**
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[MONOREPO_STRUCTURE.md](MONOREPO_STRUCTURE.md)** - Package organization
- **[docs/NAVIGATION.md](docs/NAVIGATION.md)** - Documentation index

**Guides:**
- **[CLI Reference](docs/guides/CLI_REFERENCE.md)** - Command-line usage
- **[Schema Guide](docs/guides/SCHEMA_GUIDE.md)** - Spec schema reference
- **[Sandbox Guide](docs/guides/SANDBOX_GUIDE.md)** - Security and sandboxing
- **[Developer Reference](docs/guides/DEVELOPER_REFERENCE.md)** - Development patterns
- **[Dev Notes](docs/guides/DEV_NOTES.md)** - Build history, LLM lessons, performance discoveries

**Runbooks:**
- **[System Runbook](docs/runbooks/SYSTEM_RUNBOOK.md)** - System service operations
- **[Hub Runbook](docs/runbooks/HUB_MCP_RUNBOOK.md)** - MCP hub operations
- **[Memory Runbook](docs/runbooks/MEMORY_RUNBOOK.md)** - Memory service operations
- **[System Flow](docs/runbooks/SYSTEM_FLOW.md)** - Execution flow diagrams

</details>

<details>
<summary><b>Example Specs</b> (click to expand)</summary>

Browse example specs in [packages/system/specs/active/](packages/system/specs/active/):

- **[system_primary](packages/system/specs/active/system_primary/)** - Core automation handlers (bundle, repo, file, git, http)
- **[data_pipeline](packages/system/specs/active/data_pipeline/)** - CSV cleaning and reporting
- **[git_pipeline](packages/system/specs/active/git_pipeline/)** - Git branch automation

Templates for new specs: [packages/system/specs/templates/](packages/system/specs/templates/)

</details>

---

## Repository Structure

<details>
<summary><b>📁 Directory Layout</b> (click to expand)</summary>

```
fridai-core/
├── packages/              # Monorepo packages
│   ├── system/            # Core execution engine (port 8000)
│   ├── mcp/               # MCP hub (port 3921)
│   ├── memory/            # Memory service (port 3922)
│   ├── common/            # Shared utilities (secrets, notifications)
│   └── llm/               # Local LLM support (Ollama)
├── config/                # Runtime configuration
│   ├── presets/           # System-wide presets (identity, remotes)
│   ├── profiles/          # Execution profiles (approvals, sandbox)
│   ├── sandbox_images.yaml
│   └── secrets.yaml
├── docs/                  # Documentation
│   ├── guides/            # How-to guides
│   ├── runbooks/          # Operational procedures
│   ├── packages/          # Per-package deep dives
│   ├── reference/         # Maturity ladders, specs
│   ├── security/          # Security documentation
│   └── testing_and_CI/    # Test architecture and CI docs
├── scripts/               # Dev/maintenance utilities
├── bin/                   # Shell wrappers (MCP stdio bridge)
├── tests/                 # Integration/smoke tests
├── environment.yml        # Conda environment definition
├── Makefile               # Build/test/lint targets
└── pyproject.toml         # Shared tooling config (ruff, black, mypy)
```

See [MONOREPO_STRUCTURE.md](MONOREPO_STRUCTURE.md) for detailed package layout.

</details>

---

## Contributing

<details>
<summary><b>🤝 How to Contribute</b> (click to expand)</summary>

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Code conventions
- Testing requirements
- PR workflow

**Key Areas for Contribution:**
- New handler implementations (data processing, APIs, etc.)
- Improved sandbox profiles
- Additional storage backends (memory service)
- Documentation improvements

</details>

---

## Status

**Current Phase:** Development preview (v0.1.0) — core architecture stable, APIs may change

| Component | Status |
|-----------|--------|
| Validation Engine | ✅ Stable |
| Approval System | ✅ Stable |
| Sandbox Runtime | ✅ Stable |
| MCP Hub | ✅ Stable |
| Memory Service | ✅ Stable |
| Base Handlers | ✅ 5/5 complete |
| Workflow Handlers | ✅ Complete |
| Workflow Tests | 🚧 In progress |
| LLM Handlers | 🚧 Ollama generation working, additional handlers planned |
| Notifications | ✅ CLI, Slack, Email, Jira |
| VSCode Extension | 🚧 Scaffolding only |
| Scheduler | ⬚ Not yet implemented |

See [ROADMAP.md](ROADMAP.md) for full details. See [CONTRIBUTING.md](CONTRIBUTING.md) to get involved.

---

## Community

- **[GitHub Discussions](https://github.com/garrettschumacher/fridai-core/discussions)** - R&D conversations, LLM research, architecture proposals, Q&A
- **[Issues](https://github.com/garrettschumacher/fridai-core/issues)** - Bug reports and feature requests
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development setup and conventions

## Support

- **Documentation**: [docs/](docs/)
- **Logs**: `mcp logs` or `tmp/logs/`
- **Issues**: https://github.com/garrettschumacher/fridai-core/issues

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Last Updated:** 2026-02-07
