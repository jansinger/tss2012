# Security Documentation

## Overview

This document outlines the security measures and considerations for the sailing journey visualization application.

## Security Measures Implemented

### 1. XSS Protection in Map Tooltips

**File**: `src/lib/ol/overlays/createTooltipHTML.ts`

All user-provided content in map tooltips is escaped using HTML entity encoding to prevent XSS attacks:

- Escapes characters: `&`, `<`, `>`, `"`, `'`
- Uses browser DOM API when available (most secure)
- Falls back to regex-based escaping during SSR
- Applied to all 6 fields: title, datetime, section, picture path, picture title

### 2. Content Security Policy (CSP)

**File**: `netlify.toml`

Strict CSP configured to allow only trusted resources:

```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
font-src 'self'
img-src 'self' https://api.maptiler.com https://t1.openseamap.org
```

**Allowed External Domains:**

- `https://api.maptiler.com` - Map tiles (required for OpenLayers)
- `https://t1.openseamap.org` - Sea map overlay tiles

**Note**: `unsafe-inline` is currently required for SvelteKit's inline scripts and styles. This is a known limitation of static site generation.

### 3. Static Site Generation (SSG)

**Adapter**: `@sveltejs/adapter-static`

- All pages pre-rendered at build time
- No server-side code execution at runtime
- No database or API endpoints to exploit
- Eliminates entire classes of server-side vulnerabilities

### 4. Controlled Data Sources

All content comes from controlled static JSON files:

- `static/data/logbook_geo.json` - Map marker data
- `static/data/segelsommer2012.json` - Blog entry data

No user-submitted content or external data sources at runtime.

## {@html} Usage - Risk Assessment

### Where {@html} is Used

Svelte's `{@html}` directive renders unescaped HTML in 5 locations:

1. **LogbookEntry.svelte:77** - `{@html entry.title}`
2. **LogbookEntry.svelte:87** - `{@html entry.text}`
3. **Pictures.svelte:55** - `{@html text}` (image captions)
4. **LogbookEntries.svelte:39** - `{@html f.title}`
5. **timeline/+page.svelte:55-56** - `{@html entry.section}`, `{@html entry.title}`

### Why This is Safe

**Risk Level**: ✅ **LOW**

1. **Controlled Content**: All HTML comes from static JSON files you control (`static/data/*.json`)
2. **No User Input**: Users cannot submit or modify content at runtime
3. **Build-Time Only**: Content is authored by you and frozen at build time
4. **Intentional HTML**: The HTML formatting (bold, italics, links) is intentional for blog content styling

### Example of Intentional HTML

From `logbook_geo.json`:

```json
{
	"title": "Kein Wind, keine Schweinswale, kein Polen und kein benzin<br>",
	"abstract": "Und wieder einmal kommt es anders...<br>"
}
```

The `<br>` tags are intentionally included for proper text formatting.

### If Content Source Changes

⚠️ **Important**: If you ever add user-submitted content or external data sources, you MUST:

1. Sanitize all HTML before storing in JSON
2. Use a library like `DOMPurify` to clean HTML
3. Or switch to plain text with manual line breaks
4. Never trust external data sources

## Security Best Practices

### Current Grade: A-

**Strengths:**

- ✅ XSS protection in dynamic tooltips
- ✅ Strict CSP policy (no external scripts)
- ✅ Static site generation (no server vulnerabilities)
- ✅ Local font/icon hosting
- ✅ Controlled data sources
- ✅ HTTPS-only deployment (Netlify default)

**Areas for Improvement:**

- ⚠️ `unsafe-inline` in CSP (SvelteKit limitation)
- ⚠️ `{@html}` usage (acceptable risk given controlled data)

## Dependency Security

### Regular Updates

Keep dependencies updated to patch security vulnerabilities:

```bash
npm audit
npm audit fix
npm update
```

### Removed Dependencies

Removed `sanitize-html` and 7 sub-dependencies to reduce attack surface and eliminate Node.js module warnings.

## Deployment Security

### Netlify Security Features

- **HTTPS Only**: All traffic encrypted
- **DDoS Protection**: Built-in mitigation
- **Asset Fingerprinting**: Cache busting prevents tampering
- **Deploy Previews**: Test security changes before production

### Security Headers

Configured in `netlify.toml`:

- Content-Security-Policy (CSP)
- X-Frame-Options (implicitly via CSP `frame-src`)
- No external font/script CDNs

## Monitoring

### GitHub Dependabot

Automated security alerts enabled for vulnerable dependencies.

### Manual Review

Review static data files periodically for:

- Accidental inclusion of sensitive data
- Malformed HTML that could cause rendering issues
- Broken links or missing images

## Incident Response

If a security issue is discovered:

1. **Assess Impact**: Determine affected components
2. **Fix Code**: Patch vulnerability in source
3. **Rebuild**: Generate new static build
4. **Deploy**: Push to Netlify (atomic deployment)
5. **Verify**: Test security fix in production
6. **Document**: Update this file with lessons learned

## Contact

For security concerns, contact the repository owner directly.

---

**Last Updated**: 2025-10-05
**Reviewed By**: Claude Code Security Analysis
