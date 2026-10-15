# Issue #5: Server-State Management with TanStack Query

Welcome to **Exercise 05** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Cache server data outside useEffect

Product lists and product details are **server state**. Fetching them in `useEffect` duplicates cache, loading, and error logic.

**TanStack Query** gives query keys, `staleTime`, retries, and mutations that invalidate related keys (for example invalidate `['cart']` after add-to-cart — not the whole product list).

---

### The Problem

Home and ProductDetails still fetch with manual effects. We need a query client, shared keys, and a cart mutation.

**Files to look at:**

- `ecommerce-frontend/src/main.jsx`
- `ecommerce-frontend/src/pages/Home.jsx`
- `ecommerce-frontend/src/pages/ProductDetails.jsx`
- create `ecommerce-frontend/src/queryClient.js`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 05 on branch exercise-05-tanstack-query in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me.
>
> Deliver install command + diffs for:
> - queryClient.js (staleTime 60000, retry 1, why-comment)
> - QueryClientProvider in main.jsx
> - Home key ['products', { search, category }] + load-more/infinite as required
> - ProductDetails key ['product', id]
> - loading/error/empty UI
> - add-to-cart mutation invalidates ['cart'] only
>
> Include verify steps.
> ```

---

### Activity: Move product fetching to TanStack Query

1. Branch: `exercise-05-tanstack-query`.
2. `npm install @tanstack/react-query` in `ecommerce-frontend`.
3. Paste **IMPLEMENT** once if stuck.
4. Wire client, queries, mutation.
5. Check, PR, merge, close.

---

### Check your work

```bash
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

Back to Home within 60s avoids refetch; changing search refetches; API down shows error UI; add-to-cart updates after mutation.

---

### Commit to continue

```bash
git add ecommerce-frontend/package.json ecommerce-frontend/package-lock.json ecommerce-frontend/src/main.jsx ecommerce-frontend/src/queryClient.js ecommerce-frontend/src/pages/Home.jsx ecommerce-frontend/src/pages/ProductDetails.jsx
git commit -m "Load products and cart updates with TanStack Query"
git push -u origin HEAD
```

PR → merge when green → close issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
