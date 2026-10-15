# Issue #4: Authentication, JWT, Cookies, and CORS

Welcome to **Exercise 04** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Cross-origin sessions

Browsers treat `localhost:5173` (UI) and `localhost:3000` (API) as different origins.

- Prefer an **HTTP-only cookie** for the JWT so JavaScript cannot read it.
- Send credentialed requests (`withCredentials: true`) and allow only known origins in CORS — never `origin: true` with credentials in production-minded setups.
- Restore the session from a **profile** endpoint; clear the cookie on logout.

---

### The Problem

The backend already sets a `jwt` cookie, but the login JSON still returns a token, the frontend still uses `localStorage`, Bearer headers remain as a fallback, and CORS can fall back to reflecting any origin.

**Files to look at:**

- `ecommerce-backend/server.js`
- `ecommerce-backend/controller/userController.js`
- `ecommerce-backend/middleware/authMiddleware.js`
- `ecommerce-backend/routes/userRoutes.js`
- `ecommerce-frontend/src/services/axios.js`
- `Login.jsx`, `App.jsx`, `Navbar.jsx`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 04 on branch exercise-04-authentication-cors in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me. Never ask for secrets.
>
> Deliver complete diffs for:
> - CORS = CLIENT_URL only; refuse start if missing
> - remove token from login JSON; keep jwt HTTP-only cookie
> - authMiddleware cookie-only (no Bearer fallback)
> - GET /api/users/profile
> - frontend: no localStorage token; restore via profile; Navbar awaits POST /users/logout
> - backend README env NAMES only
>
> Include verify steps.
> ```

---

### Activity: Lock sessions to HTTP-only cookies + CORS

1. Branch: `exercise-04-authentication-cors`.
2. API must be runnable (see README setup) for manual checks.
3. Paste **IMPLEMENT** once if stuck.
4. Apply the checklist. Do not invent a second cookie name — keep `jwt`.
5. Check, PR, merge, close.

---

### Check your work

```bash
npm test
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

With API + UI up: login sets HTTP-only `jwt`; no `token` in localStorage or login JSON; refresh stays logged in; logout clears cookie; unknown origins fail CORS.

---

### Commit to continue

```bash
git add ecommerce-backend/server.js ecommerce-backend/controller/userController.js ecommerce-backend/middleware/authMiddleware.js ecommerce-backend/routes/userRoutes.js ecommerce-backend/README.md ecommerce-frontend/src/services/axios.js ecommerce-frontend/src/pages/Login.jsx ecommerce-frontend/src/App.jsx ecommerce-frontend/src/components/Navbar.jsx
git commit -m "Store the session in an HTTP-only cookie and lock CORS to CLIENT_URL"
git push -u origin HEAD
```

PR → merge when green → close issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
