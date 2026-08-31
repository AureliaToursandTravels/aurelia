# Aurelia Tours & Travels — Complete Deployment & Google Indexing Guide

This guide takes you from zero to live, step by step. Everything that could be automated **has already been done for you**: the full project is built, dependencies are installed, the server is tested and running. The steps below are the ones that **only you can do**, because they require your personal accounts, passwords, and payments.

> **Time needed:** ~45–60 minutes for the full setup (mostly account creation).
> **Cost:** $0 for hosting (Render free tier) + $0 for database (MongoDB Atlas free tier). Only the domain costs money (~₹700–₹1,200/year).

---

## What was already done for you

| Item | Status |
|---|---|
| All project files created (`server.js`, `package.json`, all pages) | ✅ Done |
| `.env` created with your emails/phones pre-filled | ✅ Done |
| `.gitignore` added (protects your `.env` secrets from GitHub) | ✅ Done |
| SEO added to `index.html` (title, description, Open Graph, JSON-LD structured data) | ✅ Done |
| `sitemap.xml` + `robots.txt` created | ✅ Done |
| Dependencies installed (`npm install`) | ✅ Done |
| Server boot-tested: homepage 200 OK, admin login works | ✅ Done |
| **Bug fixed:** `nodemailer.createTransporter` → `createTransport` (original code would crash on launch) | ✅ Fixed |

**One real bug was found and fixed in your code.** The original `server.js` used `nodemailer.createTransporter(...)`, but that function does not exist in Nodemailer — the correct name is `createTransport`. Without this fix the server crashed instantly on startup. It now boots cleanly.

---

## PART 1 — Get the files onto YOUR computer

You need the project folder on your own machine (the one you'll deploy from). The project lives in this workspace — download/copy the whole `aurelia/` folder to your computer.

**If you're on Windows:**

1. Download the `aurelia` folder from this chat/workspace to your Desktop.
2. Install **Node.js LTS** from https://nodejs.org (click the big green "LTS" button, run the installer, keep clicking Next).
3. Install **VS Code** from https://code.visualstudio.com (free).

**Verify Node.js installed:** Open a terminal (Windows: press `Win` key, type `cmd`, press Enter), then type:

```bash
node -v
npm -v
```

Both must print version numbers (e.g. `v20.x.x` and `10.x.x`). If `node` is not recognized, restart your computer and try again.

---

## PART 2 — Create the 2–3 free accounts you need

### 2.1 MongoDB Atlas (free database) — 10 minutes

1. Go to https://www.mongodb.com/cloud/atlas → click **Try Free** → sign up with any email (use `workkhalid1509@gmail.com`).
2. Answer the onboarding questions (anything works), choose **M0 Free** cluster, pick a cloud region close to India (e.g. `Mumbai (ap-south-1)`), name the cluster `Cluster0`, click **Create**.
3. Under **Security → Database Access** → **Add New Database User**:
   - Username: `aurelia_admin`
   - Password: type a strong one, e.g. `AureliaDB!2026` (write it down)
   - Role: `Read and write to any database` → **Add User**
4. Under **Security → Network Access** → **Add IP Address** → click **Allow access from anywhere** (`0.0.0.0/0`) → **Confirm**.
5. Click **Database → Connect → Drivers**:
   - Driver: `Node.js`, Version: `8.x or later`
   - Copy the connection string. It looks like:
     ```
     mongodb+srv://aurelia_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
6. **Edit that string:** change the database name part so it reads `aurelia` before the `?`:
   ```
   mongodb+srv://aurelia_admin:<password>@cluster0.xxxxx.mongodb.net/aurelia?retryWrites=true&w=majority
   ```
   (replace `<password>` with the real password you set — **no angle brackets**)

### 2.2 Gmail App Password (so the site can send emails from your Gmail) — 5 minutes

Gmail blocks normal passwords for apps. You need a 16-character "App Password".

1. Go to https://myaccount.google.com/security (signed in as `workkhalid1509@gmail.com`).
2. Turn **ON 2-Step Verification** (required — follow the prompts).
3. After that's on, search "App passwords" in the search bar at the top, or go to https://myaccount.google.com/apppasswords.
4. App name: type `Aurelia Site` → **Create**.
5. Google shows a 16-character code like `abcd efgh ijkl mnop` — **copy it (spaces optional, the app doesn't need them)**. This is your `SMTP_PASS`.

> ⚠️ You can only see this code once. Save it in your `.env` right away.

### 2.3 Twilio (optional — WhatsApp notifications to your phone)

The site works without this (emails still go out). Only do it if you want new-request alerts on WhatsApp.

1. Sign up at https://www.twilio.com/try-twilio (free trial).
2. Verify your phone number `+919323003681`.
3. From the dashboard, copy: **Account SID** (`AC...`) and **Auth Token**.
4. In Twilio, buy/use a WhatsApp-enabled number (trial numbers work) — the default sandbox number is `whatsapp:+14155238886`.

> 💡 **Skip this for now if you want.** Leave the Twilio lines in `.env` as-is; the code detects empty credentials and simply skips WhatsApp.

---

## PART 3 — Fill in your `.env` (the most important file)

Open the `.env` file (in the `aurelia` folder) with VS Code or Notepad and replace the placeholder values. Here is the **complete table** — copy each real value into its spot:

| Variable | What to put | Example |
|---|---|---|
| `PORT` | Leave as-is | `5000` |
| `MONGODB_URI` | Your Atlas string from 2.1 (with real password, no `< >`) | `mongodb+srv://aurelia_admin:AureliaDB!2026@cluster0.xxxxx.mongodb.net/aurelia?retryWrites=true&w=majority` |
| `JWT_SECRET` | Change to a long random string (any 30+ chars) | `x9Fk2mQp7vLzT4nB8wR3sY6uH1jC5dAe` |
| `ADMIN_USERNAME` | Your admin login name | `admin` |
| `ADMIN_PASSWORD` | **Your own strong password** (this logs you into the admin panel) | `MyStrongAdminPass!2026` |
| `BASE_URL` | `http://localhost:5000` now; **change to your live URL after deploy** (see Part 6) | `https://aurelia-travel.onrender.com` |
| `ADMIN_PRIMARY_EMAIL` | Already filled | `workkhalid1509@gmail.com` |
| `ADMIN_SECONDARY_EMAIL` | Already filled | `khankhalidar2@gmail.com` |
| `ADMIN_PRIMARY_PHONE` | Already filled | `+919323003681` |
| `SMTP_HOST` | Leave as-is | `smtp.gmail.com` |
| `SMTP_PORT` | Leave as-is | `587` |
| `SMTP_USER` | Your Gmail that has the app password | `workkhalid1509@gmail.com` |
| `SMTP_PASS` | **The 16-char app password from 2.2** | `abcd efgh ijkl mnop` (no spaces needed) |
| `TWILIO_ACCOUNT_SID` | Only if doing WhatsApp | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Only if doing WhatsApp | your token |
| `TWILIO_WHATSAPP_NUMBER` | Only if doing WhatsApp | `whatsapp:+14155238886` |

**IMPORTANT rules:**
- No spaces around `=`. No quotes around values. No `<>` left in the file.
- `.env` must **never** be uploaded to GitHub — `.gitignore` already blocks it.

---

## PART 4 — Run it on your computer (test before going live)

In the terminal inside the `aurelia` folder:

```bash
npm install
npm start
```

You should see:

```
Connected to MongoDB
Aurelia Server running on port 5000
```

Then open your browser:

- **Customer site:** http://localhost:5000
- **Admin login:** http://localhost:5000/admin-login.html (username `admin`, password = what you set in `.env`)

Submit a test request from the homepage → you should get the success message, and the admins get the email. Then log into the admin panel, click **Quote**, enter a price, send — the client gets the quote email.

**Troubleshooting "MongoDB connection error":** the string in `.env` is wrong or the password/username mismatch — re-check 2.1 step 6. The server still runs but requests will fail until the DB connects.

---

## PART 5 — Push to GitHub (free)

1. Create a free account at https://github.com → verify your email.
2. Click the **+** (top-right) → **New repository** → name it `aurelia` → check **Public** (Private also works for Render, but Public is simpler) → **Create repository**.
3. Now push your folder. In the terminal, inside the `aurelia` folder:

```bash
git init
git add .
git commit -m "Aurelia travel broker v1"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/aurelia.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username. GitHub will ask for your username + a **Personal Access Token** as password (Settings → Developer settings → Personal access tokens → Generate new token → check `repo` → Generate → copy).

> ✅ Check on GitHub that `.env` is NOT in the file list (it's gitignored).

---

## PART 6 — Deploy live on Render (free, 24/7)

1. Go to https://render.com → **Sign up** → choose **Continue with GitHub** → authorize Render to read your repos.
2. Dashboard → **New +** → **Web Service** → connect your GitHub account → select the `aurelia` repo.
3. Settings:
   - **Name:** `aurelia-travel` (this creates your free URL: `https://aurelia-travel.onrender.com`)
   - **Region:** `Singapore (Southeast Asia)` (fastest for India) — or Mumbai if listed
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
4. Expand **Advanced** (or Environment section) → **Add Environment Variables** — copy **every** line from your `.env`, one by one. Two changes:
   - `BASE_URL` → `https://aurelia-travel.onrender.com`
   - `PORT` → Render sets this itself; keep `5000` in the file, Render overrides it automatically. (If it complains, just add `PORT` with the value Render shows in the dashboard.)
5. Click **Create Web Service**. Wait 3–5 minutes for the build. When the log shows `Aurelia Server running on port 5000` and no errors — you're LIVE at `https://aurelia-travel.onrender.com` 🎉

**Test the live site:** open the URL on your phone, submit a request, check you receive the admin email. Log in to admin at `/admin-login.html`.

> ⚠️ **Free-tier cold start:** Render free instances sleep after ~15 minutes of no traffic; the first visit after idle takes ~30–60 seconds to wake up. This is normal and free. (Paid tier $7/mo removes it — not needed to start.)

---

## PART 7 — Buy a custom domain (highly recommended for Google)

A `.onrender.com` address can be indexed, but a real domain like `aureliatravel.in` ranks **much** better and looks professional. Any of these work: Namecheap (cheapest, ~₹700/yr), GoDaddy, Hostinger, BigRock (Indian, accepts UPI).

1. Buy the domain (search available names: `aureliatravel.in`, `aureliatravel.com`, `aureliatickets.com`...).
2. Connect it to Render: Render dashboard → your web service → **Settings** → **Custom Domains** → **Add Custom Domain** → type your domain.
3. Render shows 2 DNS records (usually a `CNAME` named `www` pointing to `aurelia-travel.onrender.com`, and sometimes a TXT for verification). Go to your domain registrar's **DNS settings** and add exactly those records.
4. Wait for the DNS check to turn green (minutes to a few hours).
5. **Update these files with your real domain** (search-and-replace `YOUR-DOMAIN.com`):
   - `public/index.html` — the `canonical` link, Open Graph `og:url`, and the JSON-LD `url` field
   - `public/how-it-works.html` and `public/contact.html` — `canonical` links
   - `public/robots.txt` — the `Sitemap:` line
   - `public/sitemap.xml` — every `<loc>`
   - `.env` → `BASE_URL` → your real domain
6. Push the changes: `git add . && git commit -m "Set real domain" && git push`. Render auto-redeploys.

---

## PART 8 — Get on Google under the name "Aurelia"

### 8.1 Google Search Console (free — this is how you tell Google "index my site")

1. Go to https://search.google.com/search-console → sign in with `workkhalid1509@gmail.com`.
2. **Add property** → **Domain** type → enter your domain (e.g. `aureliatravel.in`) → **Continue**.
   - It asks for a DNS TXT record → copy it → paste into your registrar's DNS settings → **Verify** (green = done, may take a few minutes).
3. In the left menu → **Sitemaps**:
   - In "Add a new sitemap" type: `sitemap.xml` → **Submit**.
   - Status should show **Success** within minutes.
4. **URL Inspection** (search bar at top): paste `https://aureliatravel.in/` → press Enter → click **Request Indexing**.
5. Repeat step 4 for `/how-it-works.html` and `/contact.html`.

**What happens next:** Google crawls within a few days. For a brand-new site, first indexing usually lands in **2–7 days** (sometimes 1–2 weeks). You don't need to do anything else — Google finds it.

### 8.2 Making Google show YOUR site for "Aurelia Tours & Travels"

Important truth: a brand-new small site cannot outrank big travel sites for generic words like "flight tickets" immediately. But ranking for **your own brand name "Aurelia Tours & Travels"** is very achievable and fast. Do this:

1. **Brand consistency everywhere** — the title already says "Aurelia Tours & Travels", the logo shows the "TOURS & TRAVELS" tagline, the footer has your phone/email, `og:site_name` = Aurelia Tours & Travels, JSON-LD `name` = Aurelia Tours & Travels. Done already.
2. **Backlinks (the #1 ranking factor)** — get other websites to link to your site with the anchor text "Aurelia Tours & Travels":
   - Add your site to free directories: Google Business Profile (google.com/business), JustDial, IndiaMART, Yelp, and any travel forums/Facebook groups where you're active.
   - Share your link in relevant Facebook/WhatsApp/Telegram groups and Instagram bio.
   - Each link from a real site makes Google trust "Aurelia" more.
3. **Local search** — on Google Business Profile, category = "Travel agency", add your phone `+91 9323003681` and your city. This gets you on Google Maps and in local results for "travel agency near me".
4. **More pages = more chances to rank** — later, add pages like `public/mumbai-to-delhi-flights.html` (one per popular route: "Mumbai to Delhi cheap flights", "Delhi to Goa train tickets") — each with its own title/meta. These rank for long-tail searches like "cheap flights Mumbai to Delhi" and drive real customers. Link them from the homepage footer. Re-upload `sitemap.xml` after adding pages.
5. **Keep it alive** — Google indexes inactive sites slowly. Update content monthly (new route pages, seasonal offers like "Diwali travel deals"). Use the site actively — every submitted request is data, and every happy customer is a future link.
6. **Track it** — in Search Console, check **Performance** weekly to see what people search and whether you're being shown.

**Realistic timeline:** brand name "Aurelia Tours & Travels" — days to 3 weeks after indexing. Route keywords ("cheap flights Mumbai to Delhi") — 1–3 months with a few route pages and links.

---

## PART 9 — Everyday operations

| Action | Where |
|---|---|
| See new requests | Email/WhatsApp alert to you + the admin panel |
| Reply with a quote | Admin panel → **Quote** → price + commission → Send (client gets email/WhatsApp) |
| Mark booking done | Admin panel → status dropdown → **Mark Booked** |
| Change admin password | Edit `ADMIN_PASSWORD` in `.env` on Render → redeploy |
| Watch for crashes | Render dashboard → **Logs** tab |

---

## PART 10 — Common problems & fixes

| Problem | Fix |
|---|---|
| Server crashes: `createTransporter is not a function` | Already fixed in your copy — if you paste the old code anywhere, use `createTransport`. |
| `MongoDB connection error: querySrv ENOTFOUND` | Wrong/empty `MONGODB_URI` in `.env` — re-copy from Atlas with the real password. |
| Emails not sending | `SMTP_PASS` is not a real app password, or 2-Step Verification is off. Re-do Part 2.2. `SMTP_USER` must be the same Gmail the app password was created in. |
| Admin says "Invalid username or password" | Wrong `.env` values, or Render didn't get the new env vars (edit → Save → Deploy again). |
| WhatsApp silent | Twilio not configured — emails still work. Re-do 2.3 or skip. |
| Site slow on first visit | Free-tier cold start (Part 6 note). Normal. |
| Google says "Page not indexed" | Request indexing again in Search Console; make sure `robots.txt` doesn't block the page (it only blocks `/admin.html` and `/admin-login.html`). |
| Port in use locally (`EADDRINUSE`) | Something else runs on 5000 — change `PORT=5001` in `.env` and visit `localhost:5001`. |

---

## Checklist before you're "done"

- [ ] `.env` filled: real MongoDB URI, app password, strong admin password
- [ ] Tested locally: request submitted + admin quote email received
- [ ] GitHub repo `aurelia` pushed (no `.env` in it)
- [ ] Render live at `https://aurelia-travel.onrender.com`
- [ ] Live test: submit request from phone, get admin alert
- [ ] Domain bought + DNS connected + `YOUR-DOMAIN.com` replaced everywhere + BASE_URL updated
- [ ] Search Console: property verified, sitemap submitted, homepage indexed
- [ ] Google Business Profile created (for local "Aurelia" searches)

---

## PART 11 — Earn a cut on bookings (affiliate links)

Your site already shows **"Book directly through our partner links"** buttons (Trip.com, Cleartrip, Skyscanner). Customers pay the **same price** — and if the links carry your affiliate ID, **you earn a commission** on every booking.

To activate earning:

1. **Join the free affiliate programs** (each takes ~10 min, approval is usually automatic):
   - Trip.com Affiliate — search "Trip.com affiliate program"
   - Cleartrip Affiliate — search "Cleartrip affiliate program"
   - Skyscanner Partners — search "Skyscanner partners programme"
2. Each program gives you a **tracking ID** (a code/parameter for your links).
3. Open `public/js/partners-v5.js` and **paste each ID** into the matching `trackingId: ''` field (the file has clear `<!-- -->` comments).
4. Push the change to GitHub (`git add . && git commit -m "affiliate ids" && git push`) — Render auto-redeploys.
5. The homepage buttons now carry your tracking — every booking through them pays you. Check each program's dashboard for earnings.

> ⚠️ Each program has its own exact link format/parameter. Follow the instructions they email you; if a program needs a different parameter than shown in the file, replace the whole `homeUrl` with their official generated link.

Also built-in for you: every new enquiry email includes **MakeMyTrip, Goibibo and Google Flights price-check links**, and the admin panel has **MMT / Goibibo buttons** next to each request plus a 12-site **Price-Check Sources** panel. Customers only ever receive branded Aurelia confirmations — no competitor links.

---

## PART 12 — SECURITY & HOW TO ACCESS YOUR ADMIN PANEL

Your site is protected so outsiders **cannot** find or break into the admin panel:

| Protection | What it does |
|---|---|
| 🔒 **Secret admin URL** | `/admin.html` and `/admin-login.html` now return **404 (Not Found)** — outsiders can't even find the panel. Your panel lives at a private address (below). |
| 🔑 **Strong password** | A new, unguessable admin password was generated — the old weak one no longer works. |
| 🧪 **Brute-force blocker** | After **5 wrong login attempts**, the system locks out that address for **15 minutes**. |
| 🛡️ **Security headers** | Clickjacking, MIME-sniffing and other web attacks are blocked. |
| ✂️ **Input protection** | Anything a visitor types is cleaned before it appears in your admin panel — no script injection. |

### Your admin access (SAVE THIS!)

- **Admin URL:** `https://YOUR-SITE.com/aurelia-admin-b4b544` (login page: add `/login`)
- **Username:** `admin`
- **Password:** `rL3pfaUp2NxJ0Y`

> ⚠️ When you deploy to Render (Part 6), these exact values must be copied into Render's environment variables: `ADMIN_PATH`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` — otherwise the panel won't be where you expect.
>
> 🔁 Want a new password later? Ask me to generate fresh ones, or change them yourself in `.env` (and in Render). Never share these with anyone.

---

## PART 13 — YOUR CUT (commission engine)

When you open the **Quote** box for any request, your cut is **auto-suggested** (you can edit it):

| Booking | Base cut | Premium class |
|---|---|---|
| Domestic flight | ₹100 | Premium Economy ×1.25 · Business ×1.55 |
| International flight | ₹300 | Premium Economy ×1.25 · Business ×1.55 |
| Train (same state) | ₹20 | 3A ×1.25 · 2A ×1.40 · 1A ×1.55 · CC ×1.15 |
| Train (inter-state) | ₹40 (edit manually) | same multipliers |

Example: an international Business-class flight suggests ₹300 × 1.55 = ₹465. Everything is editable in the modal — it's a suggestion, not a rule.

**Where to find the cheapest fare before quoting:** your admin panel has a **"Price-Check Sources"** panel with one-tap links to MakeMyTrip, Goibibo, Google Flights, Skyscanner, Cleartrip, Yatra, Ixigo, EaseMyTrip, Trip.com, Expedia, Kayak and IRCTC. Check 2–3 sources, quote lower, keep your cut. Customers never see these — they only see Aurelia.

Questions? The project files, including this guide, are all in the `aurelia/` folder — you can re-read this anytime.
