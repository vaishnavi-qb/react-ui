# Advanced React Architecture Lab

[![Copy the exercise](https://img.shields.io/badge/COPY%20THE%20EXERCISE-%E2%86%92-2ea44f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vaishnavi-qb/ecommerce-shopping-store/generate)

## What is this?

This repo is a **clothing store** (browse products, cart, login, checkout) used to learn **advanced React**.

**Goal of the track:** learn how to scale the app, handle complex global state, deal with cross-origin authentication, and optimize performance.

You complete **10 exercises**. Each one is a GitHub Issue with exact steps. You do not need to know this app already — follow this page from the top.

## What you need

- A GitHub account  
- [Git](https://git-scm.com/)  
- [Node.js 22 or later](https://nodejs.org/) (`node -v` and `npm -v` should work)  
- A code editor (VS Code or Cursor)  
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) running on your machine (needed to fully use login, cart, and checkout)

## 1. Get the code (copy + clone)

### A. Create your own copy on GitHub

1. Click **Copy the exercise** (green button at the top).  
2. Choose your GitHub account as owner.  
3. Prefer **public** (private repos use Actions minutes).  
4. Click **Create repository**.

### B. Clone it to your computer

On your new repo page → green **Code** → copy the HTTPS URL, then:

```bash
git clone https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git
cd <YOUR-REPO-NAME>
```

Example:

```bash
git clone https://github.com/vaishnavi-qb/ecommerce-shopping-store.git
cd ecommerce-shopping-store
```

Open this folder in your editor. All commands below run from this folder (the **repo root**).

## 2. How to set up and run the application

Think of two parts that must run together:

| Part | Folder | Default URL |
| --- | --- | --- |
| API (backend) | `ecommerce-backend/` | http://localhost:3000 |
| Store UI (frontend) | `ecommerce-frontend/` | http://localhost:5173 |

### Step 1 — Install packages

```bash
npm ci
npm ci --prefix ecommerce-frontend
```

### Step 2 — Create the env file

Create a file named **`.env`** in the **repo root** (same folder as the root `package.json`, **not** inside `ecommerce-backend/`).

Paste this for local learning (you can change secrets later):

```env
MONGO_URI=mongodb://127.0.0.1:27017/clothing-store
JWT_SECRET=change-me-locally
CLIENT_URL=http://localhost:5173
API_PUBLIC_URL=http://localhost:3000
PORT=3000

# Frontend (Vite reads VITE_* from env when you start the UI)
VITE_API_BASE_URL=http://localhost:3000/api

# Optional — only needed when you test Stripe checkout
# STRIPE_SECRET_KEY=
# STRIPE_PUBLISHABLE_KEY=
# VITE_STRIPE_PUBLISHABLE_KEY=
```

Also create `ecommerce-frontend/.env` with at least:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

(You can put the same `VITE_*` values in the root `.env` if your tooling loads them; the frontend file is the reliable place for Vite.)

Do **not** commit `.env` files or paste secrets into an AI chat.

### Step 3 — Start MongoDB

Make sure MongoDB is running locally so `MONGO_URI` works.

- macOS (Homebrew): `brew services start mongodb-community`  
- Linux: `sudo systemctl start mongod` (service name may vary)  
- Or use MongoDB Compass / Docker if you already do  

### Step 4 — Seed sample data (recommended once)

```bash
npm run data:import
```

This loads sample users and products so the store is not empty.

### Step 5 — Start the API (terminal 1)

```bash
npm run start
```

You should see the API on **http://localhost:3000**.  
Swagger docs: **http://localhost:3000/api-docs**

Leave this terminal running.

### Step 6 — Start the store UI (terminal 2)

Open a **second** terminal in the same repo root:

```bash
npm run dev --prefix ecommerce-frontend
```

Open **http://localhost:5173** in your browser.

You should see the clothing store. Browse products, open a product page, try login/signup after seeding.

### Quick “is it up?” checklist

| Check | Expected |
| --- | --- |
| http://localhost:3000/api-docs | Swagger page loads |
| http://localhost:5173 | Store home page loads |
| Home shows products | Seed worked + API + UI talk to each other |
| Browser console / Network | Calls go to `http://localhost:3000/api/...` |

### Stop the app

In each terminal: `Ctrl + C`.

### Common setup problems

| Problem | What to try |
| --- | --- |
| API crashes on start | MongoDB not running, or `.env` missing / wrong path (must be repo root) |
| UI loads but no products | Run `npm run data:import`; confirm API is up; check `VITE_API_BASE_URL` |
| CORS / login cookie issues | `CLIENT_URL` must be `http://localhost:5173` (exact) |
| `vite` / command not found | Run installs again from repo root |

More backend notes: [ecommerce-backend/README.md](ecommerce-backend/README.md).

## 3. Tour of the folders (newcomers)

```text
your-repo/
├── ecommerce-frontend/     Store UI (React + Vite)
├── ecommerce-backend/      API (Express + MongoDB)
├── .github/exercises/      Exercise text (also becomes GitHub Issues)
├── .github/workflows/      Automation for the exercise track
├── .github/PROMPTING.md    How to use optional AI prompts
├── .env                    Your local secrets (you create this — do not commit)
└── package.json            `npm run start` runs the API
```

| Screen in the shop | Main file |
| --- | --- |
| Home / catalog | `ecommerce-frontend/src/pages/Home.jsx` |
| Product details | `ecommerce-frontend/src/pages/ProductDetails.jsx` |
| Login / signup | `Login.jsx` / `Signup.jsx` |
| Cart / checkout | `Cart.jsx` / `Checkout.jsx` |
| API routes | `ecommerce-backend/routes/` + `controller/` |

## 4. Start the exercise track

After the app can run (or even before, for Exercise 01):

1. On GitHub: **Actions → Initialize exercises → Run workflow**. Wait for **green**.  
2. Open **Issues → Exercise 01**.  
3. Follow the issue top to bottom: branch → edits → checks → PR → merge → close issue.  
4. The next issue appears when `main` validation is green and the issue is closed. Repeat through Exercise 10.

```bash
git switch main
git pull origin main
git switch -c exercise-0N-short-name
```

There is no Exercise 11. If the issue and this README disagree, **follow the issue**.

## 5. Learning roadmap

| Module | Exercises | You learn |
| --- | --- | --- |
| 1. Advanced hooks | 01 | `useEffect` cleanup, refs/cancellation, custom hooks |
| 2. Advanced routing | 02 | `useParams`, `useSearchParams`, protected routes |
| 3. Complex forms | 03 | React Hook Form + Zod |
| 4. Auth + data fetching | 04–05 | JWT cookies, CORS, TanStack Query |
| 5. Global state | 06 | Context, Zustand, when to keep Redux |
| 6. Advanced patterns | 07–09 | TypeScript, performance, Vite → Next.js |
| Capstone | 10 | Document and prove the shopper path |

## 6. How each exercise teaches (Foundations-style)

Every issue uses the same shape (like [React Foundations](https://github.com/vaishnavi-qb/vaishnavi-test/issues/1)):

1. **Theory** — the concept in plain language  
2. **The Problem** — what is wrong / what to build in this store + files  
3. **IMPLEMENT** — **one** copy-paste AI prompt (full answer in a single reply — no quiz ladder)  
4. **Activity** — do the work on a branch  
5. **Check your work** → **Commit to continue** (PR → merge → close issue)

Guide: [.github/PROMPTING.md](.github/PROMPTING.md). Never paste secrets into chat.

## 7. GitHub automation (short)

| Actions name | Job |
| --- | --- |
| **Initialize exercises** | Creates Issue 01 |
| **Validate exercise** | Lint / build checks |
| **Advance exercise** | Opens the next issue after you finish |

**Next issue missing?** Issue closed? Earlier issues closed? Merged to `main`? Validate green on `main`? Workflow permissions read+write?

## 8. Exercise list

| # | Branch | One-line task |
| --- | --- | --- |
| 01 | `exercise-01-advanced-hooks` | Fix stale effects; add `useWindowEvent` |
| 02 | `exercise-02-advanced-routing` | Protect cart/checkout; URL search; not found |
| 03 | `exercise-03-complex-forms` | Checkout with React Hook Form + Zod |
| 04 | `exercise-04-authentication-cors` | Cookie auth + locked CORS |
| 05 | `exercise-05-tanstack-query` | Products via TanStack Query |
| 06 | `exercise-06-global-state` | Theme Context + Zustand UI store |
| 07 | `exercise-07-typescript-react` | Strict TypeScript on key files |
| 08 | `exercise-08-performance` | Measure and memoize product cards |
| 09 | `exercise-09-nextjs` | One Next.js product page beside Vite |
| 10 | `exercise-10-capstone` | Architecture docs + shopper path |

## 9. CI checks you can run locally

```bash
npm test
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```
