# 🎨 Artist's Grid Maker — PWA Setup & Deployment Guide

## What you have
This is a fully configured PWA (Progressive Web App). Once deployed:
- **Windows PC** → Install from Chrome like a desktop app
- **iPad** → Add to Home Screen from Safari — works like a real app
- **Works offline** after first visit

---

## STEP 1 — Set up the project on your PC

Open VS Code, press **Ctrl + `** to open the terminal, then run:

```bash
# 1. Navigate to where you want the project
cd Desktop

# 2. Copy the grid-maker-pwa folder here (or place it manually)

# 3. Go into the folder
cd grid-maker-pwa

# 4. Install all packages
npm install
```

---

## STEP 2 — Test it locally first

```bash
npm run dev
```
Open **http://localhost:5173** in your browser — you should see the app.

---

## STEP 3 — Deploy FREE on Vercel

### 3a. Push to GitHub (one time setup)

1. Go to **https://github.com** → Sign up (free)
2. Click **"New Repository"** → Name it `grid-maker` → Click **Create**
3. In VS Code terminal, run:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/grid-maker.git
git push -u origin main
```
*(Replace YOUR_USERNAME with your GitHub username)*

### 3b. Deploy on Vercel

1. Go to **https://vercel.com** → Sign up with GitHub (free)
2. Click **"Add New Project"**
3. Click **"Import"** next to your `grid-maker` repo
4. Leave all settings as default
5. Click **"Deploy"**

✅ In about 60 seconds, Vercel gives you a live URL like:
**https://grid-maker-abc123.vercel.app**

---

## STEP 4 — Install on Windows PC

1. Open **Google Chrome**
2. Go to your Vercel URL
3. Look for the **install icon** (⊕) in the address bar on the right
4. Click it → **"Install"**
5. Grid Maker opens in its own window — no browser bar!

---

## STEP 5 — Install on iPad

1. Open **Safari** on your iPad *(must be Safari, not Chrome)*
2. Go to your Vercel URL
3. Tap the **Share button** (box with arrow pointing up) at the bottom
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"**

✅ Grid Maker icon appears on your iPad home screen!
✅ Opens fullscreen like a real app
✅ Works offline after first load

---

## Updating the app later

Whenever you make changes:

```bash
git add .
git commit -m "update"
git push
```

Vercel automatically redeploys within 30 seconds. ✨

---

## Quick Reference

| Task | Command |
|------|---------|
| Run locally | `npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |

---

*Built with React + Vite + vite-plugin-pwa*
