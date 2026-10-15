# Issue #6: Context API, Zustand, and Redux Toolkit

Welcome to **Exercise 06** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Pick the right state tool

Not all state belongs in one library.

- **Context** — low-frequency globals (theme).
- **Zustand** — small client UI bits (search panel open).
- **Redux Toolkit** — already owns cart/auth here; do not move them without a reason.
- **TanStack Query** — server data; do not copy product lists into Redux/Zustand.

---

### The Problem

Add theme Context + a Zustand search-open store, document the decision in `STATE.md`, and leave cart/auth in Redux.

**Files to look at / create:**

- `ecommerce-frontend/src/theme/ThemeContext.jsx`
- `ecommerce-frontend/src/store/uiStore.js`
- `Navbar.jsx`, `main.jsx`, `index.css`
- `ecommerce-frontend/src/STATE.md`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 06 on branch exercise-06-global-state in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me.
>
> Deliver diffs for ThemeContext, Zustand uiStore, Navbar wiring, index.css dark rule, STATE.md headings, and keep auth/cart in Redux. Include verify steps.
> ```

---

### Activity: Add theme Context and Zustand UI state

1. Branch: `exercise-06-global-state`.
2. `npm install zustand` in `ecommerce-frontend`.
3. Paste **IMPLEMENT** once if stuck.
4. Implement theme + search UI store + STATE.md.
5. Check, PR, merge, close.

---

### Check your work

```bash
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

Theme toggles across navigation; search opens/closes; cart and login still work; STATE.md has required headings.

---

### Commit to continue

```bash
git add ecommerce-frontend/package.json ecommerce-frontend/package-lock.json ecommerce-frontend/src/theme/ThemeContext.jsx ecommerce-frontend/src/store/uiStore.js ecommerce-frontend/src/components/Navbar.jsx ecommerce-frontend/src/main.jsx ecommerce-frontend/src/index.css ecommerce-frontend/src/STATE.md
git commit -m "Add theme context and a small Zustand UI store"
git push -u origin HEAD
```

PR → merge when green → close issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
