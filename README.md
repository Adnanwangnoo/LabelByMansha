# Label by Mansha — Full-Stack Website

A full-stack JavaScript site: an Express.js API on the backend, plain
HTML/CSS/vanilla JS on the frontend. No build step, no framework — just
`npm install` and go.

## Stack

- **Backend:** Node.js + Express
- **Storage:** JSON files on disk (`server/data/`) via a tiny file-store
  helper — no database server to install. Swap in Postgres/Mongo later by
  changing `server/store.js` and the two route files; the API shape won't
  need to change.
- **Frontend:** static HTML/CSS + vanilla JS (`public/`), fetching data from
  the API with `fetch()`. No React/build tooling, so it's easy to read and
  easy to deploy anywhere Node runs.

## Getting started

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

For auto-restart on file changes during development:

```bash
npm run dev
```

## Project structure

```
label-by-mansha/
├── package.json
├── server/
│   ├── index.js            # Express app, mounts routes, serves /public
│   ├── store.js             # tiny JSON-file read/write helper
│   ├── data/
│   │   ├── products.json    # product catalogue (edit this to add/remove items)
│   │   └── messages.json    # created automatically — contact + enquiry submissions
│   └── routes/
│       ├── products.js      # GET /api/products, /api/products/:id, /api/products/categories
│       └── contact.js       # POST /api/contact, POST /api/enquire, GET /api/messages
└── public/
    ├── index.html
    ├── collections.html      # fetches products from the API and renders cards client-side
    ├── about.html
    ├── contact.html           # submits the form to POST /api/contact
    ├── css/style.css
    ├── js/
    │   ├── nav.js             # mobile nav toggle (all pages)
    │   ├── products.js        # collections page: fetch + filter + enquiry modal
    │   └── contact.js         # contact page: form submission
    └── images/
```

## API reference

| Method | Route                       | Description                                                        |
|--------|------------------------------|----------------------------------------------------------------------|
| GET    | `/api/health`                | Basic health check                                                   |
| GET    | `/api/products`              | List products. Optional `?category=kurtis` filter                   |
| GET    | `/api/products/categories`   | Distinct categories (for building filter UI)                        |
| GET    | `/api/products/:id`          | Single product by id                                                 |
| POST   | `/api/contact`                | Submit the contact form. Body: `{ name, phone, email?, topic?, message }` |
| POST   | `/api/enquire`                | Quick per-product enquiry. Body: `{ productId, productName, name, phone }` |
| GET    | `/api/messages?key=...`      | Admin view of all submitted messages/enquiries (see below)          |

### Viewing submitted messages

Every contact form submission and product enquiry is saved to
`server/data/messages.json` and readable at:

```
http://localhost:3000/api/messages?key=mansha-admin
```

**Change the admin key before deploying this anywhere public.** Set it via
an environment variable instead of the default:

```bash
ADMIN_KEY=something-only-you-know npm start
```

## Editing the product catalogue

Open `server/data/products.json` and add/edit/remove entries. Each product
looks like:

```json
{
  "id": "kurti-zoya",
  "name": "Zoya Straight Kurti",
  "category": "kurtis",
  "categoryLabel": "Kurtis",
  "fabric": "Pure lawn · Thread embroidery on neckline",
  "price": 3200,
  "badge": "New",
  "gradient": ["#EE7B4D", "#D6357E"]
}
```

`category` must match one of the filter button values in
`public/collections.html` (`wedding`, `kashmiri-tilla`, `dabka-work`)
unless you add a new filter button too. Set `"bestseller": true` on any
product to have it also appear under the **Best Selling** filter — that
filter pulls from `bestseller`, not from `category`, so a piece can be both
e.g. a Wedding Collection item and a bestseller.
No server restart needed — the file is read fresh on every request.

Prices are stored as plain numbers (Indian Rupees) and formatted as ₹ on
the frontend in `public/js/products.js`.

## Theme

The site uses a dark theme — near-black background, deep maroon contrast
blocks, and an aged-gold accent (`#C9A15A`) echoing the tilla thread the
brand works in. Colors are defined as CSS variables at the top of
`public/css/style.css` if you want to adjust the palette.

The header logo and hero both use a hand-drawn gold mandala motif
(`public/images/mandala.svg`) as the site's signature visual element.

On mobile, the site shows an app-style bottom tab bar (Home / Account /
Shop / Wishlist / Cart) and a floating WhatsApp button — both defined in
each page's HTML and styled in `style.css` under "Bottom mobile tab bar"
and "WhatsApp floating button".

## Things to update before going live

- The studio address is intentionally left as "coming soon" across the
  site (footer, contact page) — update it in `public/index.html`,
  `public/collections.html`, `public/about.html` and `public/contact.html`
  once you have one to publish.
- Replace the placeholder discount code (`MANSHA10`) in the promo strip
  and hero banner once you decide on a real one — search for `MANSHA10`
  across the `public/*.html` files.
- Replace the color-block product placeholders with real product
  photography (swap the `gradient` field usage in `public/js/products.js`
  for an `image` field once you have photos), and replace the hero's
  placeholder visual frame in `index.html` with a real lookbook photo.
- Change `ADMIN_KEY` as described above.
- Put this behind HTTPS (e.g. a reverse proxy like Nginx, or deploy to a
  platform that provides TLS) before collecting real customer data.
- `server/data/messages.json` is plain text on disk — back it up, and treat
  it as containing personal data (names/phone numbers).

## Deploying

This is a plain Node/Express app, so it runs on any Node host (a VPS,
Render, Railway, Fly.io, etc.). Set the `PORT` environment variable if your
host requires it (defaults to `3000`).
