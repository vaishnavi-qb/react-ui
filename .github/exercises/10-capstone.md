# Issue #10: Build a Production-Ready React Application

Welcome to **Exercise 10** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Ship what you scaled

A production-minded store is not only features — it is **documented decisions** and a **proven shopper path**. Capture routes, auth cookie choice, Zod checkout, TanStack keys, Redux/Context/Zustand, and the Next.js slice so the next developer can run and extend the app.

---

### The Problem

Finish the track on this codebase (do not invent a second store): write `docs/ARCHITECTURE.md`, add **Run the store** to the README, and fix only what is broken on the shopper path.

**Touch:**

- `docs/ARCHITECTURE.md`
- `README.md`
- only clearly broken shopper-path code

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 10 on branch exercise-10-capstone in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me. No secret values.
>
> Deliver full ARCHITECTURE.md (required headings from THIS repo), README Run the store section (commands + env NAMES only), and a shopper-path punch-list with fixes only if something is clearly broken. Include verify commands.
> ```

---

### Activity: Document architecture and prove the shopper path

1. Branch: `exercise-10-capstone`.
2. Walk login → product → cart → checkout errors → logout → `/checkout` redirects to login.
3. Paste **IMPLEMENT** once if you want the docs drafted.
4. Write ARCHITECTURE.md + Run the store; fix only real breaks.
5. Run all CI commands, PR, merge, close — track complete.

---

### Check your work

```bash
npm test
npm run lint --prefix ecommerce-frontend
npm run typecheck --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
npm ci --prefix ecommerce-next
npm run build --prefix ecommerce-next
```

Shopper path works end to end.

---

### Commit to continue

```bash
git add docs/ARCHITECTURE.md README.md
git commit -m "Document the store architecture and the local run steps"
git push -u origin HEAD
```

PR → merge when green → close this issue. Automation marks the track complete (no Issue 11).

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
