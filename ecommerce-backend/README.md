# ecommerce-backend

Express API for the clothing storefront. Auth uses an HTTP-only `jwt` cookie (not a Bearer token in localStorage).

## Setup

1. Install dependencies from the **repo root**: `npm ci`
2. Create a `.env` file in the **repo root** (see env names below)
3. Start: `npm start` (or `npm run start:prod`)

Swagger UI: `/api-docs`

## Environment variable names

Set these in the repo-root `.env` (values are local to you — do not commit secrets):

| Name | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Secret used to sign the `jwt` cookie |
| `CLIENT_URL` | yes | Allowed frontend origin(s) for CORS (comma-separated). Server will not start if missing. |
| `PORT` | no | API port (defaults to `3000`) |
| `NODE_ENV` | no | `development` / `production` |
| `API_PUBLIC_URL` | no | Public API base URL for docs/images |
| `STRIPE_SECRET_KEY` | no | Stripe secret (checkout) |
| `STRIPE_PUBLISHABLE_KEY` | no | Stripe publishable key |
| `STRIPE_CURRENCY` | no | Stripe currency code |

Frontend Vite vars (also commonly placed in the same root `.env`):

| Name | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Frontend API base URL (e.g. `http://localhost:3000/api`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Frontend Stripe key |

## Auth notes

- Login: `POST /api/users/login` sets an HTTP-only `jwt` cookie and returns user fields **without** a token in the JSON body.
- Session restore: `GET /api/users/profile` (requires cookie).
- Logout: `POST /api/users/logout` clears the `jwt` cookie.
- CORS allows only `CLIENT_URL` origins with `credentials: true`.
