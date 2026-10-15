# Issue #3: React Hook Form and Zod

Welcome to **Exercise 03** of the Advanced React Architecture Lab.  
You are scaling the real clothing storefront (`ecommerce-frontend` + `ecommerce-backend`).

> **How this works:** Read **Theory**, understand **The Problem**, paste the single **IMPLEMENT** prompt if you want AI help (one reply — no quiz loop), complete the **Activity**, then open a PR. Closing this issue after a green validation unlocks the next exercise.

---

### Theory: Schema-driven forms

Manual `useState` per field gets expensive for real checkout forms.

**React Hook Form** owns field registration and submit. **Zod** describes valid data. `@hookform/resolvers` connects them so invalid data never reaches your payment call. Prefer field-level errors (`aria-invalid` / `aria-describedby`) and disable submit while a request is pending.

---

### The Problem

Checkout address validation is still largely manual. We need a Zod schema (including India 6-digit zip vs 5 elsewhere) wired through React Hook Form.

**Files to look at:**

- `ecommerce-frontend/src/pages/Checkout.jsx`
- create `ecommerce-frontend/src/pages/checkoutSchema.js`

---

### Prompt Guide — Ask Your AI Assistant

Copy the whole box. Paste into your AI chat with this repo open. Send once.

> **IMPLEMENT:**
>
> ```text
> IMPLEMENT Exercise 03 on branch exercise-03-complex-forms in this clothing-store repo.
>
> Reply once. Do not ask questions. Do not quiz me.
>
> Deliver:
> - npm packages to install (react-hook-form, zod, @hookform/resolvers)
> - checkoutSchema.js with all issue rules (India zip 6 digits)
> - Checkout.jsx with RHF + zodResolver, reset() for saved addresses, aria errors, pay disabled while pending
> - Verify steps
>
> Do not rewrite Login/Signup. Match existing style.
> ```

---

### Activity: Validate checkout with RHF + Zod

1. Branch: `exercise-03-complex-forms` from `main`.
2. `npm install react-hook-form zod @hookform/resolvers` in `ecommerce-frontend`.
3. Paste **IMPLEMENT** if you want the full solution in one reply.
4. Add `checkoutSchema.js` and wire Checkout.jsx.
5. Check, PR, merge, close.

---

### Check your work

```bash
npm run lint --prefix ecommerce-frontend
npm run build --prefix ecommerce-frontend
```

On `/checkout` while logged in: empty submit shows field errors; India + 5-digit zip errors; pay stays disabled while pending.

---

### Commit to continue

```bash
git add ecommerce-frontend/package.json ecommerce-frontend/package-lock.json ecommerce-frontend/src/pages/Checkout.jsx ecommerce-frontend/src/pages/checkoutSchema.js
git commit -m "Validate checkout with React Hook Form and Zod"
git push -u origin HEAD
```

PR → green **Validate exercise** → merge → close issue.

<details>
<summary>Having trouble?</summary>

- Follow this issue top to bottom — branch → files → IMPLEMENT (optional) → checks → PR.
- If validation fails, fix on the same branch and push again.
- Never commit `.env` or paste secrets into the AI prompt.

</details>
