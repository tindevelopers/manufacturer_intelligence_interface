
# ✅ Correct Vercel Configuration for Turborepo

**Project**: Manufacturer Intelligence Interface  
**Type**: Turborepo Monorepo with Next.js in `apps/web`  
**Latest Commit**: 792695a

---

## 🎯 Critical Understanding

When you set **Root Directory = `apps/web`** in Vercel:
- ❌ **DO NOT** use `vercel.json` (removed in commit 25519c2)
- ✅ **LET VERCEL AUTO-DETECT** the Next.js framework
- ✅ Build commands are **relative to the root directory**

---

## 📋 Correct Vercel Project Settings

### Go to: https://vercel.com/tindeveloper/manufacturer-intelligence-interface-web/settings

### General Settings → Root Directory

```
Root Directory: apps/web
☑ Include source files outside of the Root Directory in the Build Step
```

**Why "Include source files"?**
- Allows Vercel to access monorepo root for Yarn workspaces
- Enables access to `turbo.json` and root `package.json`

---

### Build & Development Settings

Go to: **Settings → General → Build & Development Settings**

#### Framework Preset:
```
Next.js
```
*Vercel will auto-detect Next.js in the apps/web directory*

#### Build Command:
```
(Leave empty for auto-detect)
```

Or explicitly set to:
```
yarn build
```

**NOT** `turbo run build --filter=web` (that's for monorepo root builds)

#### Output Directory:
```
(Leave empty for auto-detect)
```

Vercel will automatically use `.next`

#### Install Command:
```
yarn install
```

#### Development Command:
```
(Leave empty for auto-detect)
```

---

### Node.js Version

✅ **Confirmed: Node 20**

Files added in commit 792695a:
- `/.nvmrc` → `20`
- `/apps/web/.nvmrc` → `20`

Vercel will automatically detect and use Node 20.

---

### Environment Variables

**Settings → Environment Variables**

| Name | Value | Environments |
|------|-------|--------------|
| `ABACUS_API_KEY` | `2802fae65af84b98883a39078c3929dd` | Production, Preview, Development |

✅ **Status**: You confirmed this is already set

---

## 🔍 Why the Error Occurred

### Error:
```
ENOENT: no such file or directory, lstat '/vercel/path0/web/.next/routes-manifest.json'
```

### Root Cause:

When `vercel.json` had:
```json
{
  "buildCommand": "turbo run build --filter=web"
}
```

This told Vercel to run Turbo from the `apps/web` directory (because Root Directory = `apps/web`), which:
1. Tried to filter for a workspace named `web`
2. But the workspace is at `../../apps/web` from the monorepo root
3. Created confusion about output directory location

### The Fix:

**Removed `vercel.json` entirely** (commit 25519c2)

Now Vercel:
1. Starts in `apps/web` directory (Root Directory)
2. Auto-detects Next.js
3. Runs `yarn build` (which runs `next build`)
4. Finds `.next` output in the current directory
5. ✅ Works correctly!

---

## 📊 Current Configuration Status

| Item | Status | Commit |
|------|--------|--------|
| ❌ `vercel.json` removed | ✅ Correct | 25519c2 |
| Node 20 specification | ✅ Added | 792695a |
| Root Directory in Vercel | ✅ Set to `apps/web` | (Your setting) |
| Environment variable | ✅ Set | (Your setting) |
| Include source files | ⚠️ Verify checked | - |

---

## 🚀 Expected Build Process

With correct configuration, Vercel will:

1. **Clone repo**: `manufacturer_intelligence_interface`
2. **Change to Root Directory**: `cd apps/web`
3. **Install dependencies**: `yarn install` (workspace-aware)
4. **Detect Node version**: Read `.nvmrc` → Use Node 20
5. **Detect framework**: Next.js 14.2.28
6. **Run build**: `yarn build` (which runs `next build`)
7. **Find output**: `.next/` in current directory
8. **Deploy**: ✅ Success!

---

## ✅ Verification Checklist

Before redeploying, verify in Vercel dashboard:

### General Settings:
- [x] Root Directory = `apps/web`
- [x] Include source files outside root = **Checked**

### Build & Development Settings:
- [x] Framework Preset = `Next.js` (or auto-detect)
- [x] Build Command = *Empty* or `yarn build`
- [x] Output Directory = *Empty* (auto: `.next`)
- [x] Install Command = `yarn install`
- [x] Node.js Version = *Auto* (will use Node 20 from .nvmrc)

### Environment Variables:
- [x] `ABACUS_API_KEY` = Set for all environments

---

## 🔄 Deployment Steps

1. **Verify settings** using checklist above
2. **Go to Deployments** tab
3. **Find commit**: `792695a` - "Add Node 20 version specification"
4. **Click Redeploy** or wait for automatic deployment

---

## 📝 Key Changes Made

### Commit 25519c2: "Remove vercel.json"
- ❌ Deleted `vercel.json`
- ✅ Allows Vercel to auto-detect and use standard Next.js build

### Commit 792695a: "Add Node 20 version specification"
- ✅ Added `/.nvmrc` with `20`
- ✅ Added `/apps/web/.nvmrc` with `20`
- ✅ Ensures Vercel uses Node 20

---

## 🎯 Why This Configuration Works

### For Standard Turborepo Monorepo with Next.js:

**When Root Directory is set:**
- Vercel treats that directory as the project root
- All build commands run from that directory
- No need for `vercel.json` configuration
- No need for Turbo filter commands
- Next.js auto-detection works perfectly

**This is the recommended approach** in Vercel docs for monorepos!

---

## 🐛 Troubleshooting

### If build still fails:

1. **Double-check Root Directory setting**:
   - Must be exactly: `apps/web`
   - "Include source files" must be checked

2. **Clear build cache**:
   - Deployments → Click "..." → Redeploy → Check "Use existing Build Cache" OFF

3. **Check environment variables**:
   - Verify `ABACUS_API_KEY` is set
   - Check it's enabled for the environment you're deploying to

4. **Verify no vercel.json**:
   ```bash
   # Should not exist
   ls /vercel/path0/vercel.json
   ```

---

## 📚 Project Structure

```
manufacturer_intelligence_interface/
├── .nvmrc                    ← Node 20 (commit 792695a)
├── package.json              ← Workspace config
├── turbo.json                ← Turborepo config
├── apps/
│   └── web/                  ← Root Directory in Vercel
│       ├── .nvmrc            ← Node 20 (commit 792695a)
│       ├── package.json      ← Next.js app
│       ├── next.config.js    ← Next.js config
│       ├── app/              ← App directory
│       └── .next/            ← Build output (auto-detected)
└── packages/
```

---

## ✅ Summary

**Do:**
- ✅ Set Root Directory to `apps/web`
- ✅ Check "Include source files outside root"
- ✅ Let Vercel auto-detect Next.js
- ✅ Use Node 20 (.nvmrc files added)
- ✅ Set environment variables

**Don't:**
- ❌ Use `vercel.json` (removed)
- ❌ Use `turbo run build --filter=web` as build command
- ❌ Manually specify output directory
- ❌ Override auto-detected framework

---

*Configuration updated: October 4, 2025*  
*Latest commit: 792695a*  
*Node version: 20*
