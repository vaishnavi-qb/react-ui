# Issue #7: TypeScript with React

Welcome to **Exercise 07** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Types at the boundaries

TypeScript catches prop and API-shape mistakes before runtime. Start strict on the files that matter (product page, protected route, shared hook), type API responses from evidence in the UI, and run `tsc` in CI. Avoid `any`.

---

### The Problem

The app is mostly JavaScript. Turn on strict TS for selected files and add a CI typecheck step.

**Files to look at / create:**

- `ecommerce-frontend/tsconfig.json`
- `ecommerce-frontend/src/types/product.ts`
- `ProductDetails` → `.tsx`, `ProtectedRoute` → `.tsx`, `useWindowEvent` → `.ts`
- `.github/workflows/validate-exercise.yml`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 07 on branch exercise-07-typescript-react in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me.
>
> Deliver tsconfig + typecheck script, Product type, typed ProductDetails/ProtectedRoute/useWindowEvent, CI typecheck step, no any. Include verify commands.
> ```

---

### Activity: Add strict TypeScript on key files

1. Branch: `exercise-07-typescript-react`.
2. Install typescript; add strict tsconfig + `typecheck` script.
3. Paste **IMPLEMENT** once if stuck.
4. Convert only the listed files; add CI step.
5. Check, PR, merge, close.

---

### Check your work

```bash
npm run typecheck --prefix ecommerce-frontend
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

Product page, missing product, and logged-out `/cart` still behave correctly.

---

### Commit to continue

```bash
git add ecommerce-frontend/package.json ecommerce-frontend/package-lock.json ecommerce-frontend/tsconfig.json ecommerce-frontend/src .github/workflows/validate-exercise.yml
git commit -m "Type the product page and protected route"
git push -u origin HEAD
```

PR → merge when green → close issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
