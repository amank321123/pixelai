# PixelAI Real AI + Generation History

## Run
1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your OpenAI API key to `.env.local`.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.

## Generation History
Completed image/video generations are automatically added to a history panel and saved in the browser's localStorage (up to 30 entries). Clicking an item loads it back into the studio.

Important: browser-local history is for testing. For a production app, store generation records in a database and generated media in object storage, then associate them with authenticated users.
