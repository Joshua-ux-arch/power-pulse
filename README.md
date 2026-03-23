# ⚡ PowerPulse V3

Real-time electricity tracker for Nigeria. Clean, minimal, intentional design.
Feels like a real Lagos startup product.

---

## Running locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI to .env
npm run dev
# → http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# → http://localhost:5173
```

---

## Changing a status (No Light → Light On)

Just press **Light On** again for the same area.
- Within 3 minutes: updates your existing report directly
- After 3 minutes: submits a new report which overrides via majority vote

---

## Geolocation accuracy

Uses `enableHighAccuracy: true` (real GPS, not IP-based).
Also uses Nominatim zoom=16 for street-level detail.
For best results, allow location access on your phone outdoors.

---

## Deploy

- **Backend** → Render.com: root=`backend`, start=`npm start`
- **Frontend** → Vercel: root=`frontend`, framework=Vite, set `VITE_API_URL`
