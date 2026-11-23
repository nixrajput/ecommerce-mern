# Frontend

The NixLab Shop web client: React 19, Redux and Material UI, built with [Vite](https://vite.dev).

## Available scripts

Run these in the `frontend` folder:

- `pnpm start` starts the Vite dev server on [http://localhost:3000](http://localhost:3000). It forwards `/api` requests to the API server on port 4000.
- `pnpm run build` builds the app into the `build` folder. The API server in `backend/app.js` serves that folder.
- `pnpm run preview` serves the `build` folder locally to check a production build.
- `pnpm run clean` deletes the `build` folder.

The frontend reads no environment variables. Any `VITE_*` variable ends up in the public browser bundle, so never put a secret in one.
