# Fridai System - Execution Flows

> Visual guide to system execution, governance, and integration flows

**Last Updated:** 2025-12-12

---

## Overview

This document captures the current execution flow for the Fridai System after the refactor to preset-driven runtime config and unified specs.

**Key Components:**
- **MCP Hub**: JSON-RPC gateway for AI assistants
- **System Service**: HTTP API for validation/execution resources
- **Execution Loop**: Validation, planning, approvals, handler execution
- **Handler Registry**: Pluggable executors with approval classes + sandbox flags
- **Memory MCP**: Spec discovery and memory cards (optional)
- **Notifications**: CLI, Slack, Email, Jira
- **Sandbox**: Docker-based isolated execution

---

## 1. High-Level Architecture

```mermaid
flowchart TB
    subgraph Clients
        CLI[fridai CLI]
        Assistant[Gemini/Claude]
        IDE[IDE Integration]
    end

    subgraph "MCP Hub"
        Hub[JSON-RPC Server]
        Auth[API Key Auth]
        Allowlist[Tool/Resource Allowlist]
        Bridge[System Bridge]
        MemoryProxy[Memory Proxy]
    end

    subgraph "System Service"
        Service[FastAPI]
        Loop[Execution Loop]
        Validator[Spec Validator]
        Planner[Spec Task Planner]
        Executor[Handler Executor]
        ApprovalSvc[ApprovalService]
        Registry[Handler Registry]
        RunHistory[RunHistoryService]
        Notifiers[Notification Service]
    end

    subgraph "Memory MCP"
        MemAPI[FastAPI]
        LocalStore[(Local Store)]
        Pinecone[(Pinecone)]
        GCS[(GCS)]
        Hybrid[(Hybrid Vector+GCS)]
    end

    subgraph "Sandbox"
        Docker[Docker Runtime]
    end

    Clients --> Hub
    Hub --> Auth --> Allowlist
    Allowlist --> Bridge
    Allowlist --> MemoryProxy

    Bridge --> Service
    Service --> Loop
    Loop --> Validator --> Planner --> Executor
    Executor --> Registry
    Executor --> ApprovalSvc
    Executor -.-> Docker
    Loop --> RunHistory
    Loop --> Notifiers

    MemoryProxy --> MemAPI
    MemAPI --> LocalStore
    MemAPI --> Pinecone
    MemAPI --> GCS
    MemAPI --> Hybrid
```

---

## 2. Spec Execution Flow

```mermaid
flowchart TD
    Start([Execute Spec]) --> LoadSpec[Load spec.yaml]
    LoadSpec --> Validate{Validate Guardrails}

    Validate -->|Error| ReturnErrors[Return validation issues]
    ReturnErrors --> End([End: Failure])

    Validate -->|Success| Plan[Build task plan]
    Plan --> ApprovalCheck{Approval Required?}

    ApprovalCheck -->|Not Approved| Blocked[Fail with approval error]
    Blocked --> End

    ApprovalCheck -->|Approved| Execute[Execute tasks]
    Execute --> Result{All tasks ok?}

    Result -->|Error| RecordFail[Append run history (error)]
    Result -->|Success| RecordOk[Append run history (success)]

    RecordFail --> Notify[Send notifications]
    RecordOk --> Notify

    Notify --> EndSuccess([End])
```

Notes:
- Specs are unified `spec.yaml` files under `packages/system/specs/active`.
- Approvals are checked at execution time and fail fast (no pause loop).

---

## 3. Handler Invocation Flow

```mermaid
flowchart LR
    Start([Task Request]) --> Lookup[Lookup handler in registry]

    Lookup --> Found{Handler exists?}
    Found -->|No| NotFound[Raise HandlerNotFoundError]
    NotFound --> End([End: Error])

    Found -->|Yes| Approval{Approved?}
    Approval -->|No| ApprovalError[Raise approval error]
    ApprovalError --> End

    Approval -->|Yes| Sandbox{Sandbox required?}
    Sandbox -->|Yes| Bundle[Build sandbox bundle]
    Bundle --> Launch[Launch Docker sandbox]
    Launch --> RunSandbox[Run handler in sandbox]
    RunSandbox --> Collect[Collect results]
    Collect --> Return[Return task result]

    Sandbox -->|No| RunLocal[Run handler locally]
    RunLocal --> Retry{Retry policy?}
    Retry -->|Enabled| Attempt[Execute with retry]
    Attempt -->|Failed| More{Retries remaining?}
    More -->|Yes| Attempt
    More -->|No| RetryFail[Return failure]
    RetryFail --> End

    Attempt -->|Success| Return
    Retry -->|Disabled| Return

    Return --> Success([End: Success])
```

---

## 4. Approval Workflow

```mermaid
stateDiagram-v2
    [*] --> Pending: Approval request created (CLI/MCP)

    Pending --> Approved: Approver approves
    Pending --> Denied: Approver denies

    Approved --> [*]
    Denied --> [*]

    note right of Pending
        Approval record includes:
        - handler_id
        - handler_class
        - requested_by
        - summary
        - run_id (optional)
    end note

    note right of Approved
        Approval decision includes:
        - approver
        - decision_at
        - notes (optional)
    end note
```

Notes:
- Approvals are created explicitly (CLI/MCP), then checked by `ApprovalService` during execution.
- There is no automatic pause/resume loop in the executor.

---

## 5. Sandbox Execution Flow

```mermaid
sequenceDiagram
    participant Runner
    participant Executor
    participant Sandbox

    Runner->>Executor: Execute sandboxed task
    Executor->>Executor: Build bundle + manifest
    Executor->>Sandbox: Launch Docker with mounts
    Sandbox->>Sandbox: run_handler.py validates manifest + allowlists

    alt Task Succeeds
        Sandbox-->>Executor: Results + artifacts
        Executor-->>Runner: Success
    else Task Fails
        Sandbox-->>Executor: Error
        Executor-->>Runner: Failure
    end

    Executor->>Sandbox: Cleanup
```

Sandbox notes:
- Docker-only provider today.
- Default: non-root, caps dropped, read-only rootfs, tmpfs `/tmp`, seccomp default.
- Network default `none`; network requires approval-gated tasks with explicit approval.
- Allowlists enforced by manifest + runtime checks; writes confined to `/app/artifacts/`.

---

## 6. MCP Integration Flow

```mermaid
flowchart TB
    subgraph "AI Assistant"
        Client[Gemini/Claude]
    end

    subgraph "MCP Hub"
        Receive[Receive JSON-RPC]
        Auth[Validate API Key]
        Allowlist[Check tool/resource allowlist]
        Dispatch[Dispatch tool]

        subgraph "Tools"
            SpecValidate[spec_validate]
            SpecExec[spec_exec]
            SpecFind[spec_find]
            SpecHelp[spec_help]
            SpecVersion[spec_version_check]
            ApprovalRequest[spec_approval_request]
            ApprovalRecord[spec_approval_record]
            CallbackRegister[spec_callbacks_register]
            CallbackResume[spec_callbacks_resume]
        end
    end

    subgraph "System Bridge"
        SystemHTTP[HTTP -> System Service]
    end

    subgraph "Memory Proxy"
        MemoryHTTP[HTTP -> Memory MCP]
    end

    Client --> Receive
    Receive --> Auth --> Allowlist --> Dispatch

    Dispatch --> SpecValidate --> SystemHTTP
    Dispatch --> SpecExec --> SystemHTTP
    Dispatch --> SpecVersion --> SystemHTTP
    Dispatch --> ApprovalRequest --> SystemHTTP
    Dispatch --> ApprovalRecord --> SystemHTTP
    Dispatch --> CallbackRegister --> SystemHTTP
    Dispatch --> CallbackResume --> SystemHTTP

    Dispatch --> SpecFind --> MemoryHTTP
    Dispatch --> SpecHelp --> MemoryHTTP
```

---

## 7. Memory Integration Flow

```mermaid
flowchart LR
    subgraph "System/MCP"
        SpecFind[spec_find]
    end

    subgraph "Memory MCP"
        MemAPI[Memory API]
        Search[memory.search]
        Write[memory.write]
        Recent[memory.recent]
    end

    subgraph "Stores"
        Local[(Local Store)]
        Pinecone[(Pinecone)]
        GCS[(GCS)]
        Hybrid[(Hybrid Vector+GCS)]
    end

    SpecFind --> MemAPI --> Search
    MemAPI --> Write
    MemAPI --> Recent

    Search --> Local
    Search --> Pinecone
    Search --> GCS
    Search --> Hybrid

    Write --> Local
    Write --> Pinecone
    Write --> GCS
    Write --> Hybrid

    Recent --> Local
    Recent --> GCS
```

Notes:
- Memory store is selected via `FRIDAI_MEMORY_STORE` (local, gcs, pinecone, hybrid/vector_gcs).
- Spec discovery flows through `spec_find` -> `memory.search`.

---

## 8. Run History Rotation Flow

```mermaid
flowchart TD
    Start([Run Completed]) --> Append[Append entry to run_history.json]
    Append --> Stored[tmp/logs/system/run_history.json]

    Stored --> Rotate[fridai history]
    Rotate --> Split{Over max_entries?}

    Split -->|No| Done([Done])
    Split -->|Yes| Archive[Write archive file]
    Archive --> ArchivePath[tmp/logs/system/archive/run_history_*.json]
    ArchivePath --> Upload{Upload enabled?}

    Upload -->|No| Done
    Upload -->|Yes| Stub[Upload stub (future)]
    Stub --> Done
```

---

## 9. Configuration Resolution Flow

```mermaid
flowchart TB
    Start([Startup]) --> LoadPreset[Load preset config/presets/<name>.yaml]

    LoadPreset --> BuildRuntime[Build RuntimeConfig]
    BuildRuntime --> Approvals[execution.approvals]
    BuildRuntime --> Notifications[execution.notifications]
    BuildRuntime --> RunHistory[execution.run_history]
    BuildRuntime --> Sandbox[execution.sandbox]

    BuildRuntime --> ResolveSecrets[Resolve secrets]
    ResolveSecrets --> SecretsYAML[config/secrets.yaml]
    ResolveSecrets --> Env[Environment variables]
    ResolveSecrets --> GSM[Google Secret Manager (optional)]

    GSM --> BuildRegistry[Build handler registry]
    Env --> BuildRegistry
    SecretsYAML --> BuildRegistry

    BuildRegistry --> Ready([Ready])
```

Notes:
- Presets are canonical. Legacy profiles exist only for backward compatibility.

---

## 10. Validation & Planning Flow

```mermaid
flowchart LR
    Start([Validate Spec]) --> LoadSpec[Load spec.yaml]

    LoadSpec --> Intent[Validate intent/description]
    LoadSpec --> Plan[Validate plan steps]
    LoadSpec --> Tasks[Validate tasks + handlers]
    LoadSpec --> Guardrails[Validate guardrails + allowlists]

    Intent --> Collect[Collect issues]
    Plan --> Collect
    Tasks --> Collect
    Guardrails --> Collect

    Collect --> Errors{Any errors?}
    Errors -->|Yes| Invalid[Return errors]
    Errors -->|No| BuildPlan[Build execution plan]
    BuildPlan --> ReturnPlan[Return plan + tasks]
```

---

## 11. Notification Dispatch Flow

```mermaid
flowchart TD
    Start([Run Complete]) --> BuildSummary[Build run summary]

    BuildSummary --> Status{Run status}
    Status -->|Success| Summary[Event mode: summary]
    Status -->|Error| Incident[Event mode: incident]

    Summary --> BuildClients[Build notification clients]
    Incident --> BuildClients

    BuildClients --> Filter[Filter by enabled/modes]
    Filter --> Send[Dispatch notifications]
    Send --> Done([Done])
```

---

## See Also

- [SYSTEM_RUNBOOK.md](./SYSTEM_RUNBOOK.md) - System operations guide
- [HUB_MCP_RUNBOOK.md](./HUB_MCP_RUNBOOK.md) - MCP hub operations
- [MEMORY_RUNBOOK.md](./MEMORY_RUNBOOK.md) - Memory service operations
- [System Package Documentation](../packages/system/) - Architecture and API reference
- [System Flow Documentation](../packages/system/flow.md) - Additional flow diagrams
