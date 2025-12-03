# Pre-Commit Security Checklist

Before pushing to GitHub, verify:

## ✅ Critical Checks

- [ ] **No `.env` files are committed** - Check with: `git ls-files | grep .env`
- [ ] **No hardcoded secrets** - Search for: `password`, `secret`, `key`, `token` in code
- [ ] **JWT_SECRET uses environment variable** - No hardcoded fallbacks
- [ ] **Database credentials are in environment variables** - Not hardcoded
- [ ] **Uploads directory is excluded** - Contains user-uploaded files

## ✅ Code Review

- [ ] All sensitive data uses `process.env.*`
- [ ] No API keys or tokens in source code
- [ ] Docker Compose credentials are marked as dev-only
- [ ] Seed file passwords are clearly marked as dev-only

## ✅ Files to Verify

Run these commands before committing:

```bash
# Check for .env files
git ls-files | grep -E "\.env"

# Check for hardcoded secrets (should show only false positives)
grep -r "password.*=" --include="*.ts" --include="*.tsx" --include="*.js" backend/src frontend/src | grep -v "process.env" | grep -v "//"

# Verify .gitignore is working
git status --ignored | grep .env
```

## ✅ After First Commit

1. Verify `.env` files are NOT in the repository
2. Check GitHub repository settings
3. If `.env` files were accidentally committed:
   ```bash
   git rm --cached backend/.env
   git commit -m "Remove .env file"
   ```

## ⚠️ If Secrets Were Committed

If you accidentally committed secrets:

1. **Immediately rotate all secrets** (JWT_SECRET, database passwords, etc.)
2. Remove from git history (use `git filter-branch` or BFG Repo-Cleaner)
3. Force push (if already pushed)
4. Consider the repository compromised and rotate all credentials

