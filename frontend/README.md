# Mini Ecommerce Frontend

Frontend stack:
- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Redux Toolkit
- Axios + request interceptor (Bearer token from localStorage)

## Setup

```bash
npm install
npm run dev
```

## Environment

Create `.env` from `.env.example`:

```env
VITE_API_URL=/api
```

- In development, `VITE_API_URL=/api` and Vite proxy forwards to backend.
- In production, set `VITE_API_URL` to your real API URL during build/deploy.

## Scripts

- `npm run dev` - start development server
- `npm run build` - type-check + production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run lint:fix` - auto-fix lint issues
- `npm run prettier` - check formatting
- `npm run prettier:fix` - auto-format source
