# MCP Package Overview

The MCP package hosts the FastAPI-based hub that fronts all tools/resources and brokers to remotes.

What it does
- FastAPI hub listening on `X-API-Key` (`FRIDAI_MCP_API_KEY`), with allowlist and optional Pydantic validation of tool args.
- Dispatch layer to local tools/resources plus optional remotes (HTTP or stdio) defined in presets (`mcp.remotes`).
- CLI (`mcp`) to start/stop hub + memory, manage remotes, and fetch secrets.

Configuration & profiles
- **Presets are canonical** for governance:
  - The active preset is host-controlled via `FRIDAI_PROFILE` or `config/presets/.active`.
  - Unified presets live under `config/presets/*.yaml` and are loaded as `ProfileConfig`.
  - `ProfileConfig.mcp.enabled_tools` and `enabled_resources` define which tools/resources MCP exposes.
- `packages/mcp/config/human/profiles.yaml` is **legacy**:
  - Still supported as a fallback when no preset is found.
  - New deployments should prefer unified presets and avoid adding new entries to the legacy file.
- `packages/mcp/config/remotes.yaml` and `packages/mcp/config/adapters.yaml` are legacy inputs
  used by CLI validation helpers; remotes should be configured in presets.

Key components
- `hub_app.py` / `server.py` / `registry.py`: server factory, tool registry, dispatch.
- `remote_manager.py` / `remote_client.py`: remote lifecycle and client helpers.
- Config: presets under `config/presets/*.yaml` (remotes live in `mcp.remotes`).

Running it
- `mcp start` (launches hub + memory); `mcp status` to check; `mcp install/uninstall` for launchd auto-start.
- Override memory URL/port via CLI flags or `FRIDAI_MEMORY_MCP_URL`.

Docs & flows
- System flow: `docs/runbooks/SYSTEM_FLOW.md`.
- Memory flow/publish: `docs/packages/memory/flow.md`, `docs/memory/publish.md`.
- Client compatibility and CLI surface live under `docs/packages/mcp`.
