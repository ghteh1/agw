# Asia Green Wood website

## Contact form email (Resend)

The contact form in `docs/index.html` sends a request to the Cloudflare
Worker at `src/worker.js` routes that request to `src/contact.js`, which sends the
enquiry through Resend. The browser never receives the Resend API key.

### Production setup

1. In Resend, add and verify the domain used in `CONTACT_FROM_EMAIL` (for example,
   `asiagreenwood.com`). Add the DNS records Resend provides and wait until the
   domain status is verified.
2. Create a Resend API key with **Sending access**. Keep the key private.
3. Deploy the Worker by following the steps in [Deployment](#deployment). Then,
   in Cloudflare open **Workers & Pages > agw > Settings > Variables and
   secrets**, and add these values:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Secret — the private key from Resend, beginning `re_` |
   | `CONTACT_TO_EMAIL` | Secret — inbox that should receive enquiries |
   | `CONTACT_FROM_EMAIL` | Secret — verified sender, e.g. `Asia Green Wood Website <enquiries@asiagreenwood.com>` |

4. Select **Deploy** after adding the variables, submit the contact form, and reply to the received
   email to confirm that the visitor's address is used as Reply-To.

## Deployment

This project deploys an API-only Worker to
`https://agw.guanghong-teh-914.workers.dev`. It responds only to
`POST /api/contact`; all other paths return 404. GitHub Pages serves the static
website from the `docs/` directory.

1. Install Node.js 20 or later.
2. From this folder, run `npx wrangler login` and complete the Cloudflare browser
   sign-in.
3. Run `npx wrangler deploy`.

Do not add an Assets, KV, D1, or Secrets Store binding manually in the dashboard.

## GitHub Pages

The static site is published from the `docs/` directory on the `main` branch to
`https://ghteh1.github.io/agw/`. The site calls the Cloudflare Worker at
`https://agw.guanghong-teh-914.workers.dev/api/contact`; `src/worker.js` only
allows browser requests from the GitHub Pages and workers.dev origins.

For local development, copy `.dev.vars.example` to `.dev.vars`, add real values,
then run `npx wrangler dev`. Keep `.dev.vars` out of version control.

Resend requires the `CONTACT_FROM_EMAIL` domain to be verified before it will send
production mail. Do not use a personal email address as the sender address.
