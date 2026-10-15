# Prompt guide (Foundations-style IMPLEMENT)

Each exercise follows the same learning shape as React Foundations:

1. **Theory** — read the concept  
2. **The Problem** — see what is wrong / what to build in this store  
3. **IMPLEMENT** — one copy-paste prompt for your AI assistant  
4. **Activity** — make the change, check it, open a PR  

There is **no** multi-step quiz ladder and **no** back-and-forth coaching loop.

## How to use IMPLEMENT

1. Open the exercise issue.  
2. Read **Theory** and **The Problem**.  
3. Copy everything inside the **IMPLEMENT** box.  
4. Paste into Cursor / Copilot / Claude (with this repo open).  
5. Send unchanged. Apply the result yourself (or ask the assistant to apply it if you want).  
6. Run **Check your work**, then commit and open a PR.

The IMPLEMENT prompt always asks for **one complete reply**: what to change, the code/diffs, and how to verify. It must **not** quiz you or wait for answers.

## Optional warm-up (once per session)

```text
You are helping me complete Advanced React Architecture exercises in this clothing-store repo.
When I paste an IMPLEMENT prompt, follow it exactly in one reply.
Do not ask me questions. Do not quiz me. Do not wait for answers.
Keep changes inside the exercise checklist and match existing project style.
```

## Rules

- Prefer reading Theory + Problem before pasting IMPLEMENT.  
- Never paste `.env`, tokens, cookies, or secrets.  
- You own the PR: checks must pass.
