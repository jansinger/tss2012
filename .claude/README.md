# Claude Code Documentation Index

Documentation for the **Ein tierischer Segelsommer 2012** project.

## File Structure

```
.claude/
├── README.md                 # This file — Navigation + Decision Tree
├── ARCHITECTURE.md           # Design patterns, SOLID, data flow
├── SECURITY.md               # CSP, XSS prevention, secure coding
├── TESTING.md                # Vitest 4.x, coverage, mocking
├── settings.json             # Hooks, deny rules (committed to git)
├── settings.local.json       # Personal permissions (gitignored)
├── rules/                    # Path-scoped auto-loaded rules
│   ├── svelte5-patterns.md        # Svelte 5 runes (slim)
│   ├── openlayers-integration.md  # OpenLayers patterns (slim)
│   ├── sveltekit-routing.md       # SvelteKit routing
│   ├── testing-patterns.md        # Vitest + Testing Library (NEW)
│   └── security-rules.md         # Security (alwaysApply) (NEW)
├── skills/                   # On-demand knowledge modules
│   ├── svelte5-expert/            # Deep Svelte 5 knowledge
│   ├── openlayers-expert/         # Deep OpenLayers knowledge
│   ├── fix-issue/                 # GitHub issue workflow
│   ├── create-pr/                 # PR creation workflow
│   ├── security-audit/            # Security checklist
│   └── performance-check/         # Performance analysis
└── agents/                   # Specialized sub-agents
    ├── component-creator.md       # Create Svelte 5 components
    ├── test-runner.md             # Write tests (Vitest 4.x)
    ├── security-reviewer.md       # Security review (Opus, read-only)
    ├── architect.md               # Architecture review (Opus, read-only)
    └── documentation-writer.md    # JSDoc and README updates
```

---

## Decision Tree: Rule vs Skill vs Agent vs Hook

### When to Use a Rule

- Pattern applies to specific file types (matched by `paths` globs)
- Must ALWAYS be loaded when editing those files
- Keep concise (<150 lines) — reference skills for deep knowledge
- Examples: `svelte5-patterns.md` for `*.svelte`, `security-rules.md` (alwaysApply)

### When to Use a Skill

- Domain knowledge loaded **on-demand** (not always in context)
- Auto-invoked via `disable-model-invocation: false` or manually via `/skill-name`
- Can be large (400+ lines) — deep knowledge and workflows
- Examples: `/svelte5-expert`, `/fix-issue <number>`, `/security-audit`

### When to Use an Agent

- Specialized **multi-step workflows** requiring multiple tools
- Invoked by Claude based on trigger phrases
- Has its own model, tools, and permissions
- Examples: `component-creator` (creates files), `security-reviewer` (read-only audit)

### When to Use a Hook

- **Deterministic automation** that ALWAYS runs — no judgment needed
- Configured in `.claude/settings.json`
- Examples: Auto-format after edit, block pushes to main

---

## Skills (On-Demand Knowledge)

| Skill             | Invocation            | Purpose                                      | Auto-Invoke |
| ----------------- | --------------------- | -------------------------------------------- | ----------- |
| svelte5-expert    | `/svelte5-expert`     | Deep Svelte 5 runes, migration, optimization | Yes         |
| openlayers-expert | `/openlayers-expert`  | OpenLayers 10 layers, sources, performance   | Yes         |
| fix-issue         | `/fix-issue <number>` | Full issue→PR workflow                       | Manual only |
| create-pr         | `/create-pr`          | Analyze commits, create PR                   | Manual only |
| security-audit    | `/security-audit`     | XSS, CSP, npm audit, OWASP                   | Manual only |
| performance-check | `/performance-check`  | Bundle size, rendering, web vitals           | Manual only |

---

## Sub-Agents

| Trigger Phrase                         | Agent                | Model  | Purpose                               |
| -------------------------------------- | -------------------- | ------ | ------------------------------------- |
| "create component", "new component"    | component-creator    | sonnet | Create Svelte 5 components with tests |
| "write test", "add test", "coverage"   | test-runner          | sonnet | Write and improve Vitest tests        |
| "security review", "check security"    | security-reviewer    | opus   | Security analysis (read-only)         |
| "review architecture", "design review" | architect            | opus   | Architecture review (read-only)       |
| "update docs", "add JSDoc"             | documentation-writer | sonnet | Documentation updates                 |

---

## Hooks (Automatic Actions)

Configured in `.claude/settings.json`:

| Hook               | Event                    | Action                                      |
| ------------------ | ------------------------ | ------------------------------------------- |
| Auto-Format        | PostToolUse (Edit/Write) | `prettier --write` on changed file          |
| Protected Branches | PreToolUse (Bash)        | Block `git push` to main/master             |
| Sensitive Files    | PreToolUse (Edit/Write)  | Block changes to .env, credentials, secrets |

---

## Reference Documentation

| Task                               | Document                           |
| ---------------------------------- | ---------------------------------- |
| Understanding project architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Security review or CSP changes     | [SECURITY.md](SECURITY.md)         |
| Writing or debugging tests         | [TESTING.md](TESTING.md)           |

---

## Quick Links

- **Live Site**: https://www.ein-tierischer-segelsommer.de
- **Main CLAUDE.md**: [../CLAUDE.md](../CLAUDE.md)
- **Key Files**: `src/lib/types.ts`, `src/lib/ol/map.ts`, `src/lib/AppState.svelte.ts`
