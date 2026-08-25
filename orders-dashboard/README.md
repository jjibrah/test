# Orders Dashboard

Internal dashboard for viewing and maintaining orders.

## Setup

Requires Node.js 20 or newer and the Orders API running locally.

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`. The API URL can be changed with
`NEXT_PUBLIC_API_URL`.

## Production build

```bash
npm run build
npm start
```
