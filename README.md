# MindCare

MindCare is a React and Express mental-wellness prototype with AI chat, mood check-ins, guided breathing, journaling, and counselor-demo screens.

## Run locally

1. Install frontend packages with `npm install`.
2. Install backend packages with `npm install --prefix server`.
3. Create `server/.env` with `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`. Optionally set `PORT` (defaults to `3000`).
4. Start the API with `npm run start --prefix server`.
5. In another terminal, start the frontend with `npm run dev`.
6. Open the Vite address, normally `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://localhost:3000`. A production deployment needs the frontend and API hosted together behind a reverse proxy, or equivalent routing for `/api`.

## Journal and mood data

- Journal entries are stored separately from chat messages and are shown in **Journal** after they are saved. They remain available when the user signs in again.
- Mood check-ins use real calendar dates and the dashboard shows the seven most recent days.
- This is a wellbeing tool, not emergency or medical care. The counselor connection screen is currently a demo, not a real booking or calling service.

## Visual preview

### Login page

<img width="1167" height="779" alt="Image" src="https://github.com/user-attachments/assets/e2de5040-6da2-4243-84e6-47b38d650332" />

### Home page

<img width="1689" height="785" alt="Image" src="https://github.com/user-attachments/assets/9554b4ba-191e-4e59-9996-87f449c21dac" />

### AI chat feature

<img width="1617" height="725" alt="Image" src="https://github.com/user-attachments/assets/ad5c453e-dad1-498f-9859-463d50ca246b" />

### Connect counselors

<img width="1737" height="659" alt="Image" src="https://github.com/user-attachments/assets/026a9a74-8172-4616-983f-2171db30583f" />

## Checks

Run `npm run lint` and `npm run build` before deploying frontend changes. The backend can be syntax-checked with `node --check server/server.js`.

