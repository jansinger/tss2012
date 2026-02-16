---
name: security-audit
description: 'Comprehensive security audit for XSS, CSP, secrets, and dependencies'
disable-model-invocation: true
allowed-tools: 'Read, Grep, Glob, Bash'
---

# Security Audit

Invoked with: `/security-audit`

Run through each section and report findings.

## 1. XSS Prevention

### Scan for {@html} usage

```bash
grep -rn "{@html" src/ --include="*.svelte"
```

For each occurrence verify:

- [ ] Input is trusted (static/build-time content)
- [ ] Input is sanitized with `striphtml()` from `$lib/utils/striphtml`
- [ ] NOT using user input, URL params, or external API data

### Scan for dangerous DOM manipulation

```bash
grep -rn "innerHTML\|outerHTML\|document\.write" src/ --include="*.ts" --include="*.svelte"
```

## 2. Content Security Policy

### Read CSP headers

```bash
grep -A 5 "Content-Security-Policy" netlify.toml
```

Verify:

- [ ] `default-src 'self'`
- [ ] No `unsafe-eval` in `script-src`
- [ ] `object-src 'none'`
- [ ] All external domains documented and necessary

### Check for CSP violations in code

```bash
grep -rn "eval(\|new Function(" src/ --include="*.ts" --include="*.svelte"
```

## 3. Secrets Detection

```bash
grep -rn "api[_-]\?key\|secret\|password\|token\|private[_-]\?key" src/ --include="*.ts" --include="*.svelte" --include="*.js" -i
```

For each match:

- [ ] Is it a variable name (OK) or hardcoded value (NOT OK)?
- [ ] Verify `.env*` files are in `.gitignore`

## 4. Dependency Audit

```bash
npm audit
```

Thresholds:

- **Critical**: 0 (must fix immediately)
- **High**: 0 (must fix before release)
- **Moderate**: Review case-by-case
- **Low**: Monitor

Check outdated packages:

```bash
npm outdated
```

## 5. SvelteKit-Specific Checks

```bash
# Check for server-side code exposure
grep -rn "export const prerender = false" src/routes/

# Check for unsafe load functions
grep -rn "url\.searchParams\|params\." src/routes/ --include="*.ts"
```

## 6. File Permission Check

```bash
# Check .gitignore for sensitive files
grep -E "\.env|credentials|secrets|private" .gitignore
```

## 7. External Resources Audit

```bash
grep -rn "https\?://" src/ static/ --include="*.ts" --include="*.svelte" --include="*.json" | grep -v "localhost\|node_modules"
```

For each external domain:

- [ ] Is it necessary?
- [ ] Is it in CSP whitelist?
- [ ] Does it use HTTPS?

## OWASP Top 10 (Static Site Relevance)

| #   | Category                  | Relevant? | Check                    |
| --- | ------------------------- | --------- | ------------------------ |
| 1   | Broken Access Control     | N/A       | No auth                  |
| 2   | Cryptographic Failures    | ✓         | HTTPS enforced (Netlify) |
| 3   | Injection                 | ✓         | {@html}, innerHTML       |
| 4   | Insecure Design           | ✓         | Review architecture      |
| 5   | Security Misconfiguration | ✓         | CSP, headers             |
| 6   | Vulnerable Components     | ✓         | npm audit                |
| 7   | ID & Auth Failures        | N/A       | No auth                  |
| 8   | Data Integrity Failures   | ✓         | Subresource integrity    |
| 9   | Logging Failures          | N/A       | Static site              |
| 10  | SSRF                      | N/A       | No server                |

## Report Template

```markdown
# Security Audit Report — <date>

## Summary

- XSS Risks: <count>
- CSP Violations: <count>
- Secrets Detected: <count>
- Dependency Vulnerabilities: <critical>/<high>/<moderate>/<low>
- Status: PASS / WARNING / FAIL

## Findings

### Critical

<list or "None">

### High

<list or "None">

### Medium

<list or "None">

### Low

<list or "None">

## Recommendations

1. <action item>
2. <action item>
```
