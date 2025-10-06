# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows

### 1. CI - Tests & Build (`ci.yml`)

**Triggers:**
- Push to `main` or `testing` branches
- Pull requests to `main`

**Jobs:**

#### Test Suite
- Runs on Node.js 20.x and 22.x
- Steps:
  - ✅ TypeScript check (`npm run check`)
  - ✅ Linter (`npm run lint`)
  - ✅ Unit & Integration tests (`npm run test`)
  - ✅ Coverage report (`npm run test:coverage`)
  - ✅ Upload coverage to Codecov (optional)

#### Build Check
- Runs after tests pass
- Steps:
  - ✅ Build application (`npm run build`)
  - ✅ Verify build output
  - ✅ Upload build artifacts (7 days retention)

#### Lint & Format Check
- Steps:
  - ✅ Code formatting check (`npm run format -- --check`)
  - ✅ ESLint validation

#### Summary
- Aggregates all job results
- Fails if any critical job fails

---

### 2. PR Checks (`pr-checks.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**

#### PR Information
- Displays PR metadata (number, title, author, branches)

#### Quick Tests
- Runs all tests with 10-minute timeout
- Fast feedback for PR authors

#### Test Coverage
- Generates coverage report
- Posts coverage summary as PR comment
- Shows coverage percentages for:
  - Lines
  - Statements
  - Functions
  - Branches

#### Build Verification
- Ensures application builds successfully
- Checks for essential output files
- Reports build size

#### TypeScript Check
- Runs `svelte-check` for type validation
- Continues on error (warnings allowed)

#### All Checks Passed
- Final status check
- Fails if critical checks fail (tests or build)
- Shows summary of all job results

---

### 3. CodeQL Analysis (`codeql-analysis.yml`)

**Triggers:**
- Push to `main`
- Pull requests to `main`
- Weekly schedule (Mondays at 5:23 AM)

**Purpose:**
- Security vulnerability scanning
- Code quality analysis
- Automated security alerts

---

## Status Badges

Add these badges to your README.md:

```markdown
![CI](https://github.com/jansinger/tss2012/workflows/CI%20-%20Tests%20%26%20Build/badge.svg)
![PR Checks](https://github.com/jansinger/tss2012/workflows/PR%20Checks/badge.svg)
![CodeQL](https://github.com/jansinger/tss2012/workflows/CodeQL/badge.svg)
```

---

## Required Secrets

### Optional: Codecov Integration

If you want coverage reports uploaded to Codecov:

1. Sign up at https://codecov.io/
2. Add repository
3. Get upload token
4. Add as repository secret: `CODECOV_TOKEN`

**Without Codecov:**
- Coverage still runs locally
- Upload step will be skipped (no error)

---

## Local Testing

Before pushing, run the same checks locally:

```bash
# TypeScript check
npm run check

# Linter
npm run lint

# Format check
npm run format -- --check

# Auto-format
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build
npm run build

# Complete CI suite (same as CI)
npm run build-ci
```

---

## Required Checks for PRs

The following checks **must pass** for PR approval:

1. ✅ **Quick Tests** - All 267+ tests must pass
2. ✅ **Build Check** - Application must build successfully
3. ⚠️ **TypeScript Check** - Allowed to have warnings
4. ⚠️ **Test Coverage** - Informational only

**Critical failures** will block PR merge.

---

## Workflow Best Practices

### For Contributors

1. **Before creating PR:**
   ```bash
   npm run test
   npm run build
   npm run lint
   ```

2. **Fix issues locally** before pushing

3. **Monitor CI status** after pushing

4. **Review coverage report** in PR comments

### For Maintainers

1. **Require status checks** in branch protection rules:
   - Quick Tests
   - Build Check

2. **Review CodeQL alerts** regularly

3. **Update dependencies** when security alerts appear

4. **Monitor test execution time** (currently ~4s)

---

## Performance

**Current Metrics:**
- Test Suite: ~4 seconds
- Build: ~8 seconds
- Total CI Runtime: ~2-3 minutes

**Optimization:**
- Tests run in parallel across Node versions
- Build artifacts cached
- npm ci for consistent installs

---

## Troubleshooting

### Tests Fail in CI but Pass Locally

**Possible causes:**
- Node version difference (use 22.x locally)
- Missing environment variables
- OS-specific issues (CI uses Ubuntu)

**Solution:**
```bash
# Use same Node version as CI
nvm use 22

# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run test
```

### Build Fails in CI

**Check:**
- Build artifacts directory exists
- All imports are valid
- No dynamic imports that fail in production

**Debug:**
```bash
npm run build
ls -la build/
```

### Coverage Upload Fails

**Expected behavior** if `CODECOV_TOKEN` is not set.

**To fix:**
- Add secret to repository settings
- Or remove codecov upload step from `ci.yml`

---

## Future Enhancements

Potential additions:

1. **E2E Tests** (Playwright)
   - Add `e2e.yml` workflow
   - Run on PR and before deploy

2. **Visual Regression** (Percy/Chromatic)
   - Screenshot comparison
   - Detect UI changes

3. **Performance Testing** (Lighthouse CI)
   - Core Web Vitals monitoring
   - Bundle size tracking

4. **Automatic Deployment** (Netlify)
   - Deploy previews for PRs
   - Auto-deploy on main merge

5. **Dependency Updates** (Dependabot)
   - Automated PR for updates
   - Security patches

---

## Support

For issues with GitHub Actions:
- Check workflow logs in Actions tab
- Review job summaries
- Contact repository maintainers

**Last Updated:** 2025-10-06
