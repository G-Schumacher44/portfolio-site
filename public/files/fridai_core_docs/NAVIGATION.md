# FridAI Core Documentation Navigator

**Lost in the docs?** This is your map. Start here to find what you need.

---

## Quick Navigation

### I Want To...

- **Understand what FridAI does** → [README.md](../README.md)
- **See what's working and what's planned** → [ROADMAP.md](../ROADMAP.md)
- **Set up development environment** → [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Understand the monorepo structure** → [MONOREPO_STRUCTURE.md](../MONOREPO_STRUCTURE.md)
- **Write my first automation spec** → [guides/SCHEMA_GUIDE.md](guides/SCHEMA_GUIDE.md)
- **Run the system** → [runbooks/SYSTEM_RUNBOOK.md](runbooks/SYSTEM_RUNBOOK.md)
- **Integrate with AI assistants** → [runbooks/HUB_MCP_RUNBOOK.md](runbooks/HUB_MCP_RUNBOOK.md)
- **Configure the sandbox** → [guides/SANDBOX_GUIDE.md](guides/SANDBOX_GUIDE.md)
- **Run tests** → [testing_and_CI/TESTING.md](testing_and_CI/TESTING.md)
- **Understand execution flow** → [runbooks/SYSTEM_FLOW.md](runbooks/SYSTEM_FLOW.md)

---

## Documentation Organization

### Start Here (New Contributors)

| Document | Purpose | Status |
|----------|---------|--------|
| [README.md](../README.md) | Project overview, quick start | ✅ Current |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Development setup, conventions | ✅ Current |
| [MONOREPO_STRUCTURE.md](../MONOREPO_STRUCTURE.md) | Package organization | ✅ Current |
| **This file** | Documentation navigation | ✅ Current |

### Guides (How-To Documentation) - STABLE

| Guide | Purpose | Audience |
|-------|---------|----------|
| [CLI_REFERENCE.md](guides/CLI_REFERENCE.md) | Command-line usage | Users, Ops |
| [SCHEMA_GUIDE.md](guides/SCHEMA_GUIDE.md) | Spec schema reference | Spec authors |
| [SANDBOX_GUIDE.md](guides/SANDBOX_GUIDE.md) | Sandbox security, profiles | Developers, Ops |
| [DEVELOPER_REFERENCE.md](guides/DEVELOPER_REFERENCE.md) | Development patterns | Developers |
| [MCP-SERVICES-GUIDE.md](guides/MCP-SERVICES-GUIDE.md) | MCP service architecture | Developers |
| [SECRETS_ROTATION.md](guides/SECRETS_ROTATION.md) | Secret management | Ops |

### Runbooks (Operations) - STABLE

| Runbook | Purpose | Audience |
|---------|---------|----------|
| [SYSTEM_RUNBOOK.md](runbooks/SYSTEM_RUNBOOK.md) | System service operations | Ops |
| [HUB_MCP_RUNBOOK.md](runbooks/HUB_MCP_RUNBOOK.md) | MCP hub operations | Ops |
| [MEMORY_RUNBOOK.md](runbooks/MEMORY_RUNBOOK.md) | Memory service operations | Ops |
| [COMMON_RUNBOOK.md](runbooks/COMMON_RUNBOOK.md) | Common utilities operations | Ops |
| [SYSTEM_FLOW.md](runbooks/SYSTEM_FLOW.md) | Execution flow diagrams | All |

### Testing & CI

| Document | Purpose | Audience |
|----------|---------|----------|
| [testing_and_CI/TESTING.md](testing_and_CI/TESTING.md) | Test architecture, patterns | Developers |
| [testing_and_CI/TESTING_FLOW.md](testing_and_CI/TESTING_FLOW.md) | Test flows, skip logic | Developers |
| [testing_and_CI/CI_WORKAROUNDS.md](testing_and_CI/CI_WORKAROUNDS.md) | CI gotchas, workarounds | Developers |
| [testing_and_CI/SANDBOX_WORKFLOW_TESTS.md](testing_and_CI/SANDBOX_WORKFLOW_TESTS.md) | Sandbox workflow test spec | Developers |

### Package-Specific Documentation

Each package has detailed documentation in `packages/<package>/`:

#### System Package
- [packages/system/README.md](../packages/system/README.md) - System overview
- [packages/system/docs/](../packages/system/docs/) - Architecture, API reference
- [packages/system/specs/README.md](../packages/system/specs/README.md) - Spec authoring

#### MCP Package
- [packages/mcp/README.md](../packages/mcp/README.md) - MCP hub overview

#### Memory Package
- [packages/memory/README.md](../packages/memory/README.md) - Memory service overview

#### Common Package
- [packages/common/README.md](../packages/common/README.md) - Shared utilities

#### LLM Package
- [packages/llm/README.md](../packages/llm/README.md) - Local LLM integration

### Reference Documentation

| Document | Purpose |
|----------|---------|
| [ROADMAP.md](../ROADMAP.md) | What's working, partial, and planned |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [DECISION_LOG.md](DECISION_LOG.md) | Architecture decisions |
| [reference/maturity-ladders/](reference/maturity-ladders/) | Future hardening plans |

---

## Documentation by Use Case

### Use Case: I'm a New Contributor

**Read in this order:**

1. [README.md](../README.md) - Understand the project
2. [CONTRIBUTING.md](../CONTRIBUTING.md) - Set up dev environment
3. [MONOREPO_STRUCTURE.md](../MONOREPO_STRUCTURE.md) - Understand packages
4. [testing_and_CI/TESTING.md](testing_and_CI/TESTING.md) - Learn testing patterns

### Use Case: I Want to Write a Spec

**Read in this order:**

1. [guides/SCHEMA_GUIDE.md](guides/SCHEMA_GUIDE.md) - Spec schema
2. [packages/system/specs/README.md](../packages/system/specs/README.md) - Spec authoring workflow
3. [packages/system/specs/active/system_primary/](../packages/system/specs/active/system_primary/) - Example spec
4. [runbooks/SYSTEM_FLOW.md](runbooks/SYSTEM_FLOW.md) - Understand execution

### Use Case: I Want to Add a Handler

**Read in this order:**

1. [guides/DEVELOPER_REFERENCE.md](guides/DEVELOPER_REFERENCE.md) - Development patterns
2. [packages/system/README.md](../packages/system/README.md) - System architecture
3. [CONTRIBUTING.md](../CONTRIBUTING.md) - Handler implementation guide
4. [testing_and_CI/TESTING.md](testing_and_CI/TESTING.md) - Test requirements

### Use Case: I'm Deploying to Production

**Read in this order:**

1. [runbooks/SYSTEM_RUNBOOK.md](runbooks/SYSTEM_RUNBOOK.md) - System operations
2. [runbooks/HUB_MCP_RUNBOOK.md](runbooks/HUB_MCP_RUNBOOK.md) - MCP operations
3. [runbooks/MEMORY_RUNBOOK.md](runbooks/MEMORY_RUNBOOK.md) - Memory operations
4. [guides/SECRETS_ROTATION.md](guides/SECRETS_ROTATION.md) - Secret management
5. [guides/SANDBOX_GUIDE.md](guides/SANDBOX_GUIDE.md) - Security profiles

### Use Case: I Want to Integrate with an AI Assistant

**Read in this order:**

1. [runbooks/HUB_MCP_RUNBOOK.md](runbooks/HUB_MCP_RUNBOOK.md) - MCP hub setup
2. [guides/MCP-SERVICES-GUIDE.md](guides/MCP-SERVICES-GUIDE.md) - MCP architecture
3. [guides/CLI_REFERENCE.md](guides/CLI_REFERENCE.md) - CLI usage

### Use Case: I'm Debugging a Test Failure

**Read in this order:**

1. [testing_and_CI/TESTING.md](testing_and_CI/TESTING.md) - Test architecture
2. [testing_and_CI/TESTING_FLOW.md](testing_and_CI/TESTING_FLOW.md) - Test flows
3. [testing_and_CI/CI_WORKAROUNDS.md](testing_and_CI/CI_WORKAROUNDS.md) - Known issues

---

## Documentation Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Stable, current, actively maintained |
| 🟡 | In progress, may be incomplete |
| ⚠️ | May be stale, check dates |

---

## Documentation Gaps

We're aware of these missing docs and working on them:

- [ ] **Spec Authoring Tutorial** - Step-by-step guide for first spec
- [ ] **Handler Development Tutorial** - Deep dive on handler implementation
- [ ] **Deployment Guide** - Production deployment checklist
- [ ] **Troubleshooting Guide** - Common issues and solutions
- [ ] **API Reference** - Auto-generated from code (future)

Want to contribute? Pick a gap and open a PR!

---

## Keeping Docs Up-to-Date

### Where to Add New Documentation

| Type | Location | Notes |
|------|----------|-------|
| **How-to guide** | `docs/guides/` | Stable, procedural |
| **Operations** | `docs/runbooks/` | Deployment, troubleshooting |
| **Package details** | `packages/<pkg>/docs/` | Package-specific |
| **Architecture** | `docs/packages/<pkg>/` | Deep dives |

---

## Getting Help

- **Stuck on setup?** → [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Can't find a doc?** → Ask in GitHub Discussions
- **Found a doc bug?** → Open an issue or PR
- **Doc is out of date?** → Open an issue with the correct info

---

**Last Updated:** 2026-02-06
