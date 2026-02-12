# MCP Services Guide (FridAI Hub + Memory)

Operational guide for running MCP services locally or in a deployment.

---

## What runs

- **Hub (MCP API)**: `http://127.0.0.1:3921/mcp`
- **Memory MCP**: `http://127.0.0.1:3922`
- **System service**: `http://127.0.0.1:8000`

Auth:

- `FRIDAI_MCP_API_KEY` gates hub, memory, and system.

---

## Core commands

```bash
mcp start                 # start system + memory + hub
mcp start --enable-remotes
mcp start-hub --enable-remotes
mcp stop
mcp restart
mcp status
mcp logs
mcp install   # launchd auto-start
mcp uninstall
```

---

## Presets and remotes

Remotes are configured via presets (`config/presets/*.yaml`) under `mcp.remotes`.
Select the active preset with:

```bash
export FRIDAI_PROFILE=dev
# or
mcp profile use dev
```

Hub ignores client-supplied profile headers; governance is host-controlled.

---

## Remotes basics

- Remotes are opt-in (`enabled: true` in the preset).
- HTTP remotes require HTTPS; localhost HTTP is allowed only with
  `FRIDAI_ALLOW_INSECURE_MCP=1`.
- `mcp start --enable-remotes` initializes enabled remotes on startup.

---

## Logs and runtime dirs

- Logs: `tmp/logs/mcp/{hub_mcp.log,memory_mcp.log,system_service.log}`
- Runtime: `tmp/runtime/`

Override log root with preset `execution.audit_log_dir`.

---

## Troubleshooting

- **Port busy**: `lsof -nP -iTCP:3921 -iTCP:3922 -iTCP:8000` then kill stray processes.
- **Remote init failures**: check preset `mcp.remotes` fields, credentials, and `init_timeout`.
- **Auth failures**: verify `FRIDAI_MCP_API_KEY` and restart services.
- **Secrets**: ensure `gcloud auth application-default login` if using GSM.

---

## Smoke tests

```bash
# Hub tools list
curl -H "X-API-Key: ${FRIDAI_MCP_API_KEY}" \
  http://127.0.0.1:3921/mcp/tools/list

# Memory health
curl -H "X-API-Key: ${FRIDAI_MCP_API_KEY}" \
  http://127.0.0.1:3922/health
```

---

## Cloud Run note

- Use `FRIDAI_PROFILE` to select the active preset for your deployment.
- Ensure `FRIDAI_MCP_API_KEY` and any remote headers are provided via GSM/env.
- Hub remotes should be HTTPS in prod (`FRIDAI_ALLOW_INSECURE_MCP` unset).

---

## See Also

- `docs/guides/GITHUB_MCP_SERVER_INTEGRATION_GUIDE.md`
- `docs/guides/GOOGLE_MCP_TOOLBOX_SETUP.md`
- `docs/guides/PRESET_GUIDE.md`
