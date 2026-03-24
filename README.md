# ⚡ PowerPulse V4

## What's new in V4
- ✅ CORS fully fixed — `app.use(cors())` no whitelist
- 🌙 Dark mode toggle (remembers preference)
- 😴 Wake-up banner — auto-retries when Render is sleeping
- 🔥 Animated pulse dot on areas with light
- 🗺 More Lagos areas in autocomplete
- 📱 Better mobile touch targets

## Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI in .env
npm run dev
# → http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# .env already has your Render URL
npm run dev
# → http://localhost:5173
```

## Deploy

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "PowerPulse V4"
git push
```

### Step 2 — Render auto-redeploys backend
- Wait 2 mins, check logs for ✅ MongoDB connected

### Step 3 — Vercel
- Go to Vercel → your project → Settings → Environment Variables
- Set VITE_API_URL = https://power-pulse-fj16.onrender.com/api
- Redeploy

## Keep backend awake (free)
Sign up at uptimerobot.com and ping:
https://power-pulse-fj16.onrender.com/health
every 5 minutes.
