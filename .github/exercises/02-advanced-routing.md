# Issue #2: Dynamic Routing and Protected Routes

Welcome to **Exercise 02** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: URL state and route guards

In a SPA, the URL is part of your app state.

- `useParams` reads dynamic segments like `/product/:id`.
- `useSearchParams` reads/writes query strings like `?search=shirt` so refresh and Back keep working.
- **Protected routes** send logged-out users to login, then return them to the page they wanted — without open redirects (`state.from` must be a same-origin path).

---

### The Problem

Today `/cart` and `/checkout` are public. Search uses a manual `URLSearchParams` parse. A missing product can leave a confusing UI.

**Files to look at:**

- `ecommerce-frontend/src/App.jsx`
- `ecommerce-frontend/src/pages/Home.jsx`
- `ecommerce-frontend/src/pages/ProductDetails.jsx`
- `ecommerce-frontend/src/pages/Login.jsx`
- create `ecommerce-frontend/src/components/ProtectedRoute.jsx`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 02 on branch exercise-02-advanced-routing in this clothing-store repo.
>
> Reply once with the complete fix. Do not ask questions. Do not quiz me.
>
> Deliver code/diffs for:
> - ProtectedRoute.jsx (isAuthenticated + Navigate with state.from + Outlet)
> - /cart and /checkout protected; other routes public
> - Login redirects to a safe location.state.from
> - Home uses useSearchParams for search
> - ProductDetails shows "Product not found" + link home on failure
>
> Include verify steps. Match existing style.
> ```

---

### Activity: Protect routes and sync search to the URL

1. Create branch `exercise-02-advanced-routing` from updated `main`.
2. Open the files under **The Problem**.
3. Use the **IMPLEMENT** prompt if stuck (one paste).
4. Build `ProtectedRoute`, wrap `/cart` and `/checkout`, fix login return path, switch Home to `useSearchParams`, show product not found.
5. Run checks, PR into `main`, merge, close this issue.

---

### Check your work

```bash
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

- Logged-out `/cart` → login → after login back to `/cart`.
- `/product/this-id-does-not-exist` shows Product not found.
- `/?search=shirt` survives refresh and Back.

---

### Commit to continue

```bash
git add ecommerce-frontend/src/App.jsx ecommerce-frontend/src/components/ProtectedRoute.jsx ecommerce-frontend/src/pages/Home.jsx ecommerce-frontend/src/pages/ProductDetails.jsx ecommerce-frontend/src/pages/Login.jsx
git commit -m "Protect cart and checkout and sync search with the URL"
git push -u origin HEAD
```

Open a PR into `main`, merge when **Validate exercise** is green, then close this issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
