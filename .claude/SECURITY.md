# Security Guidelines

This document covers security practices for the **Ein tierischer Segelsommer 2012** project.

---

## Content Security Policy (CSP)

The application uses strict CSP headers configured in [netlify.toml](../netlify.toml).

### Current Policy

```
default-src 'self';
script-src 'report-sample' 'self' 'unsafe-inline';
style-src 'report-sample' 'self' 'unsafe-inline';
object-src 'none';
base-uri 'self';
connect-src 'self';
font-src 'self';
frame-src 'self';
img-src 'self' https://api.maptiler.com https://t1.openseamap.org;
manifest-src 'self';
media-src 'self';
worker-src 'none';
```

### Allowed External Sources

| Directive | External Sources | Purpose |
|-----------|-----------------|---------|
| `img-src` | api.maptiler.com | MapTiler base map tiles |
| `img-src` | t1.openseamap.org | OpenSeaMap nautical overlay |

### Modifying CSP

When adding new external resources:

1. Identify the required directive (`script-src`, `img-src`, `connect-src`, etc.)
2. Add the domain to [netlify.toml](../netlify.toml)
3. Test locally with browser DevTools Network tab
4. Verify no CSP violations in console

---

## XSS Prevention

### HTML Sanitization

The project includes a utility for stripping HTML from untrusted content.

**File**: [src/lib/utils/striphtml.ts](../src/lib/utils/striphtml.ts)

**Usage**:
```typescript
import { striphtml } from '$lib/utils/striphtml';

const safeText = striphtml(untrustedHTML);
```

### Svelte's Built-in Protection

Svelte automatically escapes content in templates:

```svelte
<!-- Safe - automatically escaped -->
<p>{userContent}</p>

<!-- DANGEROUS - only use with trusted content -->
{@html trustedContent}
```

### Guidelines

- **Never** use `{@html}` with user-provided content
- Always sanitize external data before rendering
- Use `striphtml()` for logbook entry text display
- Validate GeoJSON/KML data before processing

---

## Data Validation

### TypeScript Type Guards

Use TypeScript interfaces to validate data structures:

**File**: [src/lib/types.ts](../src/lib/types.ts)

```typescript
interface LogEntry {
    id: string;
    title: string;
    datetime: string;
    // ...
}

function isLogEntry(data: unknown): data is LogEntry {
    return (
        typeof data === 'object' &&
        data !== null &&
        'id' in data &&
        'title' in data
    );
}
```

### OpenLayers Feature Validation

When processing map features:

```typescript
const features = feature.get('features');
if (features && Array.isArray(features) && features.length > 0) {
    // Safe to process
}
```

---

## Secure Coding Practices

### No Secrets in Static Files

This is a static site with no server-side code. **Never** include:

- API keys in source code
- Authentication tokens
- Database credentials
- Private configuration

If external APIs are needed:
1. Use serverless functions (Netlify Functions)
2. Store secrets in environment variables
3. Never expose in client-side JavaScript

### External API Security

Current external services (all public, no auth required):

| Service | URL Pattern | Authentication |
|---------|-------------|----------------|
| OpenStreetMap | tile.openstreetmap.org | None (public) |
| MapTiler | api.maptiler.com | None (free tier) |
| OpenSeaMap | t1.openseamap.org | None (public) |

### CORS Considerations

Map tile services use appropriate CORS headers. If adding new tile sources:

1. Verify the service allows cross-origin requests
2. Check for rate limiting
3. Consider caching strategies

---

## Input Handling

### Static Data Only

This application uses static JSON data files:

- `static/data/logbook_geo.json` - Logbook entries (GeoJSON)
- `static/data/segelsommer2012.kml` - Sailing track (KML)

**No user input is accepted or processed.**

### If Adding User Input

Should user input be added in the future:

1. **Validate** all input on the server (use Netlify Functions)
2. **Sanitize** before display using `striphtml()`
3. **Escape** for HTML context
4. **Parameterize** any database queries
5. **Rate limit** submissions

---

## Security Checklist

### Pre-Deployment

- [ ] No secrets committed to repository
- [ ] CSP headers configured correctly
- [ ] All `{@html}` usages reviewed
- [ ] External dependencies audited (`npm audit`)
- [ ] HTTPS enforced (Netlify default)

### Code Review

- [ ] No `eval()` or `new Function()` usage
- [ ] No `innerHTML` without sanitization
- [ ] No hardcoded credentials
- [ ] Input validation for any external data
- [ ] Type safety maintained

### Dependency Management

Run security audit regularly:

```bash
npm audit
npm audit fix
```

Review Dependabot PRs promptly for security updates.

---

## Reporting Security Issues

If you discover a security vulnerability:

1. Do **not** create a public issue
2. Contact the repository owner directly
3. Provide steps to reproduce
4. Allow time for remediation before disclosure
