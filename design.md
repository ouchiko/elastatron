# Elastatron — v1.0 Design Decisions

## Overview
Desktop Electron app (macOS + Windows) providing a read-only interface to Elasticsearch clusters. Cursor/VS Code-style layout.

---

## Tech Stack

| Concern | Decision |
|---|---|
| Runtime | Electron |
| UI Framework | React |
| Component Library | shadcn/ui + Tailwind CSS |
| State Management | Zustand |
| Query Editor | Monaco Editor (`@monaco-editor/react`) |
| ES Client | `@elastic/elasticsearch` v9.4.x (handles 7/8/9 version negotiation) |
| Distribution | `electron-updater` + GitHub Releases |
| Testing | None for v1.0 |

---

## Layout

Three-panel layout:

```
┌─────────────┬──────────────────────────────┬───────────────┐
│  Endpoints  │         Query Tabs           │  Index List   │
│   (left)    │  [Tab 1] [Tab 2] [+ ]        │   (right)     │
│             │ ┌──────────────────────────┐ │               │
│             │ │  Monaco Query Editor     │ │  index-a  ●   │
│             │ │                          │ │  index-b  ●   │
│             │ ├──────────────────────────┤ │  index-c  ○   │
│             │ │  ▼ Query Templates       │ │               │
│             │ │    (accordion)           │ │               │
│             │ ├──────────────────────────┤ │               │
│             │ │  Results (table / JSON)  │ │               │
│             │ └──────────────────────────┘ │               │
└─────────────┴──────────────────────────────┴───────────────┘
```

- All three panels are **resizable** via draggable dividers (`react-resizable-panels`)
- Left panel: endpoint list + connection status
- Right panel: index list with read-only metadata
- Main area: tabbed query workspace

---

## Endpoints

- **Multiple saved endpoints**, one active at a time
- Quick-switch between saved endpoints from the left panel
- **Auth methods**: Basic auth (username/password) and API key — both supported
- **SSL**: Toggle to ignore certificate errors (for local dev)
- **Credential storage**: OS keychain via Electron `safeStorage` API
- **Connection status**: Colored dot per endpoint (green = connected, red = error)
- **Auto-reconnect**: Retry once on query execution before showing an inline error

---

## Elasticsearch Version Support

- Versions 7.x, 8.x, and 9.x
- Handled automatically by the `@elastic/elasticsearch` JS client

---

## Index Panel (Right)

- Lists all indices for the active endpoint
- **Selecting an index opens a new query tab** pre-scoped to that index
- Read-only metadata view per index:
  - Health (green / yellow / red)
  - Document count
  - Size on disk
  - Mapping viewer
- Write operations (delete, create, reindex) deferred to v2

---

## Query Tabs

- **Tabbed interface** — multiple simultaneous query workspaces
- Tabs are **persisted between sessions** (index, query text, active template, page size)
- Keyboard shortcuts:
  - `Cmd/Ctrl+Enter` — run query
  - `Cmd/Ctrl+T` — new tab
  - `Cmd/Ctrl+W` — close tab

### Query Editor
- Monaco Editor with JSON syntax highlighting and bracket matching
- **Primary query language**: raw Elasticsearch JSON DSL
- **Optional shortcut**: KQL/Lucene filter field for simple filtering

### Predefined Query Templates (Accordion)
Collapsible accordion below the editor. Each template expands into editable JSON with placeholder comments.

1. Match All
2. Term Filter (exact match on a field)
3. Match Query (full-text search)
4. Date Range Filter
5. Multi-field Search
6. Top N by Field (terms aggregation)
7. Filter + Sort
8. Count by Field (value_count aggregation)

Templates also support **per-tab query history** (recent queries).

---

## Results Panel

- **Toggle between Table view and JSON tree view** (default: table)
- JSON tree view available per-row as an expand action
- **Pagination**: fixed page size (default: 20), user-configurable input
- **Export**: CSV and JSON, scoped to current page
- **Errors**: Displayed inline in the results panel (red error block with ES error message + status code)
- Connection-level events (disconnected, reconnected) shown as toast notifications

---

## Theme

- Dark mode default
- Light mode toggle
- Implemented via CSS variables (Tailwind dark mode)

---

## Scope Boundary (v1.0)

Everything in this document is **read-only**. No index creation, deletion, or document writes. No saved named queries (v1.1). No multi-cluster simultaneous connections. No e2e testing.
