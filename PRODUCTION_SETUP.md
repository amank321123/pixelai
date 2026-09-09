# PixelAI Production Setup

Included in this starter:
- Login / signup UI
- Auth route scaffold
- Generation history UI
- Download image/video buttons
- Credit balance UI
- Pricing page
- Gallery page
- Real OpenAI image/video routes
- Production environment variable template
- Vercel-friendly Next.js structure

IMPORTANT PRODUCTION ITEMS TO COMPLETE BEFORE LAUNCH
1. Connect NextAuth to a real provider/database and persist users.
2. Store users, credit ledger, plans and generation records in PostgreSQL.
3. Store generated media in durable object storage; do not rely on browser blob URLs for history.
4. Make credit deduction server-side and atomic.
5. Add payment provider checkout/webhooks for paid plans.
6. Add rate limits, request validation, abuse controls and logging.
7. Add legal pages (Privacy, Terms) and an appropriate age/parental-consent flow if required for your audience.
8. Add monitoring and error reporting.
9. Add OPENAI_API_KEY and AUTH_SECRET as deployment environment variables, never commit secrets.

LOCAL
npm install
copy .env.example .env.local
npm run dev

DEPLOY
Push to GitHub and import the repository into Vercel. Vercel detects Next.js automatically. Add all required environment variables in the Vercel project settings, then deploy.

The current pricing/credits are UI scaffolding and should not be treated as a real payment or accounting system until backed by a database and payment webhooks.
