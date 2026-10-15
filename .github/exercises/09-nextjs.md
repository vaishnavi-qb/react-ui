# Issue #9: Moving from Vite to Next.js

Welcome to **Exercise 09** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Server Components beside Vite

You do not have to rewrite the whole store. Add a **sibling** Next.js app that server-renders one product page. Keep interactive bits (`AddToCartButton`) as Client Components. Fetch on the server with `API_PUBLIC_URL`; call `notFound()` when missing.

---

### The Problem

Create `ecommerce-next/` with one product route. Leave `ecommerce-frontend` working. Add a CI build step for Next.

**Create / edit:**

- `ecommerce-next/` via create-next-app
- `app/product/[id]/page.js`
- `app/product/[id]/AddToCartButton.js`
- `ecommerce-next/README.md`
- `.github/workflows/validate-exercise.yml`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 09 on branch exercise-09-nextjs in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me.
>
> Deliver create-next-app flags, Server Component product page + notFound, client AddToCartButton only, README headings, CI Next build step. Keep Vite app intact. Include verify steps.
> ```

---

### Activity: Add a sibling Next.js product page

1. Branch: `exercise-09-nextjs`.
2. Run create-next-app as in the issue / IMPLEMENT output.
3. Paste **IMPLEMENT** once if stuck.
4. Add page + button + README + CI step.
5. Check both builds, PR, merge, close.

---

### Check your work

```bash
npm run build --prefix ecommerce-frontend
npm ci --prefix ecommerce-next
npm run build --prefix ecommerce-next
```

Vite store still runs; Next `/product/<real-id>` shows the name without a client-side product fetch.

---

### Commit to continue

```bash
git add ecommerce-next .github/workflows/validate-exercise.yml
git commit -m "Serve one product page from a separate Next.js app"
git push -u origin HEAD
```

PR → merge when green → close issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
