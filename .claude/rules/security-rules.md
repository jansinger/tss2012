---
description: 'Security rules for XSS prevention, CSP compliance, and secure coding'
alwaysApply: true
---

# Security Rules

These rules apply to ALL code changes in the project.

## XSS Prevention (CRITICAL)

### {@html} Usage

NEVER use `{@html}` with:

- User input or URL parameters
- External API responses
- Any untrusted data source

ALLOWED `{@html}` usage (trusted content only):

- Build-time generated HTML from static data
- Developer-controlled templates
- Content sanitized with `striphtml()` from `$lib/utils/striphtml`

### Dangerous Patterns — AVOID

- `eval()` or `new Function()`
- `innerHTML` / `outerHTML` without sanitization
- `document.write()`
- Inline event handlers in HTML strings

## Content Security Policy

External resources must be whitelisted in `netlify.toml` CSP headers.

Currently allowed external domains:

- `api.maptiler.com` (map tiles)
- `t1.openseamap.org` (nautical overlay)
- `tile.openstreetmap.org` (base map — via OSM source)

When adding external resources:

1. Verify the domain is in the CSP whitelist
2. Prefer same-origin resources
3. Document why the external resource is necessary

## Secrets & Credentials

FORBIDDEN in source code:

- API keys, authentication tokens, database credentials
- Private keys or certificates
- Environment variable values

This is a **static site** — no server secrets should exist in the codebase.

## Dependencies

Before adding new dependencies:

- Check `npm audit` for known vulnerabilities
- Verify the package is actively maintained
- Check license compatibility

Run `npm audit` after any dependency change.
