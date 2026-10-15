# Issue #1: Advanced Hooks and Lifecycle Management

Welcome to **Exercise 01** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: useEffect cleanup, stale responses, and custom hooks

`useEffect` runs after render to sync with something outside React (network, listeners, timers).

- Always list the values the effect **reads** in the dependency array.
- If the effect starts async work or adds a listener, return a **cleanup** function.
- A classic bug: request for product A finishes after the shopper already opened product B — the late response overwrites the UI. Fix with a `cancelled` flag (or `AbortController`) in cleanup.
- **Custom hooks** (for example `useWindowEvent`) let you reuse “subscribe + cleanup” logic in more than one component.

---

### The Problem

In this clothing store, three places need better lifecycle handling:

1. **Product details** — fetching `/products/:id` can apply a stale response when the shopper switches products quickly.
2. **Navbar cart** — fetching `/cart` can still `dispatch(setCart(...))` after logout or unmount.
3. **Home scroll + product Escape** — window listeners are duplicated / not shared; Escape should close the login modal.

**Files to look at:**

- `ecommerce-frontend/src/pages/ProductDetails.jsx`
- `ecommerce-frontend/src/components/Navbar.jsx`
- `ecommerce-frontend/src/pages/Home.jsx`
- create `ecommerce-frontend/src/hooks/useWindowEvent.js`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 01 on branch exercise-01-advanced-hooks in this clothing-store repo.
>
> I am scaling the storefront lifecycle code. Reply once with the complete fix. Do not ask me questions. Do not quiz me. Do not wait for answers.
>
> Deliver:
> 1) Short explanation of the stale-response bug
> 2) Final code or clear diffs for:
>    - cancelled flag + cleanup on ProductDetails product fetch; clear product when id changes
>    - same cancelled pattern on Navbar cart fetch
>    - new ecommerce-frontend/src/hooks/useWindowEvent.js
>    - Home scroll uses useWindowEvent
>    - ProductDetails Escape closes login modal via useWindowEvent
> 3) Exact verify steps (lint/build + browser checks)
>
> Match existing style. Do not change cart/login/checkout beyond this checklist.
> ```

---

### Activity: Fix stale effects and extract `useWindowEvent`

1. From the repo root create the branch:

```bash
git switch main
git pull origin main
git switch -c exercise-01-advanced-hooks
```

2. Open the files listed under **The Problem**.
3. Paste the **IMPLEMENT** prompt into your AI assistant if you want help — one paste, one reply.
4. Apply the checklist:
   - Cancelled flag on ProductDetails product fetch; clear `product` when `id` changes.
   - Same cancelled pattern on Navbar cart fetch.
   - Create `useWindowEvent.js` and use it for Home scroll and ProductDetails Escape.
5. Do not change cart, login, or checkout behavior beyond those steps.
6. Run the checks below, then commit and open a PR.

---

### Check your work

```bash
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

Run `npm run dev --prefix ecommerce-frontend` and confirm:

- Open product A, then quickly open product B — the page shows B, not A.
- Scroll Home to load more — no state-update warning when leaving the page.
- On a product page, open the login modal and press Escape — the modal closes.

---

### Commit to continue

```bash
git add ecommerce-frontend/src/pages/ProductDetails.jsx ecommerce-frontend/src/components/Navbar.jsx ecommerce-frontend/src/pages/Home.jsx ecommerce-frontend/src/hooks/useWindowEvent.js
git commit -m "Fix stale effects and share the window listener hook"
git push -u origin HEAD
```

Open a pull request into `main`. Wait until **Validate exercise** is green. Merge, then close this issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
