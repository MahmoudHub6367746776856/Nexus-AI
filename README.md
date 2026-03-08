# Nexus AI

Production‑ready full‑stack SaaS landing page with a high‑end, animated UI/UX.

## Tech Stack

- **Frontend**: React 18 (Vite) + React Router + Tailwind CSS + Framer Motion  
- **Backend**: Node.js + Express  
- **Storage**: Local JSON file (`database.json`) for the waitlist

## Features

- **Hero waitlist form** that posts to `/api/waitlist`
- **Live stats** section showing total users from `/api/stats`
- **Animated metrics dashboard** simulating cloud infrastructure health
- **Admin panel** to view and delete waitlist entries (`/admin?key=nexus-admin`)
- Responsive design, glassmorphism, and smooth motion animations

## Project Structure

```text
Nexus AI/
├── client/                 # React frontend (Vite)
│   ├── public/
│   │   ├── 6204503.jpg     # Background image
│   │   └── favicon.svg
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── Features.jsx
│       │   ├── Footer.jsx
│       │   ├── Toast.jsx
│       │   └── WelcomePage.jsx
│       ├── App.jsx
│       └── main.jsx
└── (backend + root config live alongside this folder)
```

## Prerequisites

- **Node.js** 18+ (Node 20/22/24 also work)
- **npm** (comes with Node)

## Installation

From the `Nexus AI` folder:

```bash
# Install frontend dependencies
cd client
npm install
cd ..
```

If you later add server code and a root `package.json`, also run:

```bash
npm install
```

## Development

### Start the frontend (Vite)

```bash
cd client
npm run dev
```

By default Vite starts on `http://localhost:5173` (or the next free port it finds).  
The app will hot‑reload as you edit files in `client/src`.

### Backend (if present)

If/when you have an Express server (e.g. in `server/index.js`), you can typically start it with:

```bash
npm run server
```

If port **5000** is already in use on your machine, set a different `PORT`:

```bash
# PowerShell example
set PORT=5001; npm run server
```

## Production Build

To create an optimized production build of the frontend:

```bash
cd client
npm run build
```

The static assets will be output to `client/dist/`.

You can preview the production build locally with:

```bash
cd client
npm run preview
```

## Available Scripts (client)

Inside the `client` folder:

- **`npm run dev`** – Start Vite dev server with hot reload.
- **`npm run build`** – Create an optimized production build.
- **`npm run preview`** – Preview the production build locally.

## Environment Configuration

For most local development you don’t need custom environment variables.  
If you add a backend later and want to customize ports or API URLs, common variables include:

- **`PORT`** – Port for your Node/Express server (default often `5000`).
- **`VITE_API_BASE`** – Custom API base URL for the frontend (if you choose to wire it in).

## Admin Panel

- Route: `/admin`
- Default key (example only, not secure for real production): `nexus-admin`
- Access via: `/admin?key=nexus-admin`
- Allows viewing and deleting waitlist entries stored in `database.json`.

## Notes

- This project is intended as a **portfolio‑grade landing page**, not a production multi‑tenant SaaS backend.
- For real deployments, you should replace the JSON file storage with a proper database and secure the admin routes with authentication.

