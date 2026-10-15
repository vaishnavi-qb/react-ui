# Issue #8: Performance Optimization

Welcome to **Exercise 08** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Measure, then memoize

Do not sprinkle `useMemo` / `React.memo` everywhere. Measure with React DevTools Profiler on a **preview** build, find the expensive list, then extract a memoized card with a **stable** callback.

---

### The Problem

Home re-renders many cards while loading more. Extract `ProductCard`, memoize it, keep `onOpen` stable, and record before/after numbers in `PERFORMANCE.md`.

**Files:**

- `ecommerce-frontend/src/pages/Home.jsx`
- create `ProductCard.jsx` (or `.tsx`)
- create `PERFORMANCE.md`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 08 on branch exercise-08-performance in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me.
>
> Deliver ProductCard + React.memo + stable onOpen, how to measure before/after on preview, and PERFORMANCE.md structure. Remind me to fill real profiler numbers. No blanket app-wide memo.
> ```

---

### Activity: Measure the catalog, then memoize ProductCard

1. Branch: `exercise-08-performance`.
2. Measure before optimizing (preview build + Profiler).
3. Paste **IMPLEMENT** once if stuck.
4. Extract/memoize ProductCard; write PERFORMANCE.md with real numbers.
5. Check, PR, merge, close.

---

### Check your work

```bash
npm run lint --prefix ecommerce-frontend
npm run typecheck --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

Product click still works; PERFORMANCE.md has real before/after numbers.

---

### Commit to continue

```bash
git add ecommerce-frontend/src/pages/Home.jsx ecommerce-frontend/src/components/ProductCard.jsx ecommerce-frontend/src/PERFORMANCE.md
git commit -m "Memoize the home product card after a profiler pass"
git push -u origin HEAD
```

If the card is `.tsx`, add that path instead. PR → merge → close.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
