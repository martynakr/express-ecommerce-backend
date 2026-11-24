# Ecommerce Backend

[![CI](https://github.com/martynakr/express-ecommerce-backend/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/martynakr/express-ecommerce-backend/actions/workflows/ci.yml)

An ecommerce backend built with **Express**, **TypeScript**, **PostgreSQL** and **Prisma**.

The PostgreSQL databases run in Docker, set up with the `docker-compose.yml` file in the project root, so you don't need Postgres installed locally. There are two containers: `db` for development and `db-test`, a separate in-memory database for the integration tests.

## Running instructions

### Prerequisites

- Node.js 24 or newer
- Docker Desktop, running

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
PORT=3000

POSTGRES_USER=ecommerce
POSTGRES_PASSWORD=ecommerce_dev_password
POSTGRES_DB=ecommerce

DATABASE_URL="postgresql://ecommerce:ecommerce_dev_password@localhost:5432/ecommerce?schema=public"

CLIENT_ORIGIN=http://localhost:5173

JWT_SECRET=<a random string of at least 32 characters>
JWT_EXPIRES_IN=1d
```

Docker Compose uses the `POSTGRES_*` values to create the database. The app and Prisma use `DATABASE_URL`, so keep its user, password and database name in sync with them.

`CLIENT_ORIGIN` is the frontend URL allowed by CORS. Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 3. Start the database

```bash
docker compose up -d
docker compose ps
```

This starts both containers. Wait until they show as `(healthy)`:

| Container           | Port | Used by           | Storage                                  |
| ------------------- | ---- | ----------------- | ---------------------------------------- |
| `ecommerce-db`      | 5432 | the app (`.env`)  | Docker volume, kept between restarts     |
| `ecommerce-db-test` | 5433 | tests (`.env.test`) | in memory, wiped whenever it stops      |

Ports 5432 and 5433 must be free, so stop any locally installed Postgres first.

### 4. Apply migrations and generate the Prisma client

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed the database

```bash
npx prisma db seed
```

This creates two users, both with the password `Password123!`:

| Email                  | Role     |
| ---------------------- | -------- |
| `admin@example.com`    | ADMIN    |
| `customer@example.com` | CUSTOMER |

It also creates a clothing store catalog of 7 categories and 48 products from `src/database/seeds/data/catalog.json`. Product photos are hosted by [DummyJSON](https://dummyjson.com) and [Fake Store API](https://fakestoreapi.com). Some products are out of stock or inactive, so availability checks can be tested.

Seeding is safe to re-run. Existing rows are updated by email or slug instead of duplicated. To change the catalog, edit the JSON file and seed again.

### 6. Start the server

```bash
npm run dev
```

- API: http://localhost:3000
- Health check: http://localhost:3000/health
- Swagger docs: http://localhost:3000/docs

### 7. Run the tests

```bash
npm test
```

| Command                    | Runs                                                 |
| -------------------------- | ---------------------------------------------------- |
| `npm test`                 | All tests once                                       |
| `npm run test:unit`        | Unit tests for `src/lib` helpers (no database needed) |
| `npm run test:integration` | Endpoint tests with Supertest (`db-test` must be running) |
| `npm run test:watch`       | Tests in watch mode                                  |

Integration tests run against the separate `ecommerce-db-test` container, configured in `.env.test`. Its data lives only in memory, migrations are applied automatically before the tests run, and every table is emptied before each test. Your development database is never touched.

If only the test database is needed, start it on its own with `docker compose up -d db-test`.

## Current plan

- Users can register and log in
- Users can browse products and categories
- Logged-in users can add products to a cart, with a stock availability check

Not yet included: guest carts, user profiles and addresses, orders/checkout, payments.

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| CARTS : "has"
    CARTS ||--o{ CART_ITEMS : "contains"
    PRODUCTS ||--o{ CART_ITEMS : "appears in"
    CATEGORIES ||--o{ PRODUCTS : "groups"

    USERS {
        int id PK
        string email UK
        string password_hash
        string name
        enum role "customer | admin"
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        int id PK
        string name
        string slug UK
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        int id PK
        int category_id FK
        string name
        string slug UK
        text description "nullable"
        int price_cents
        int stock_quantity
        string image_url "nullable"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    CARTS {
        int id PK
        int user_id FK, UK
        timestamp created_at
        timestamp updated_at
    }

    CART_ITEMS {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
        timestamp created_at
        timestamp updated_at
    }
```

### Relationships

- A **user** has at most one **cart**, created when they first add an item.
- A **cart** contains many **cart items**.
- Each **cart item** refers to one **product**.
- Each **product** belongs to exactly one **category**, and a category has many products.

### Constraints and rules

- `users.email` is unique, and passwords are stored only as hashes.
- `carts.user_id` is unique, so each user has one cart.
- `cart_items` is unique on `(cart_id, product_id)`. Adding the same product again increases the quantity instead of creating a duplicate row.
- `categories.slug` and `products.slug` are unique, for URL-friendly lookups.
- Prices are stored as integer cents in `products.price_cents` (e.g. 1999 = 19.99), never as a float.
- A category cannot be deleted while it still has products.

### Stock availability

- Adding or updating a cart item checks that the product is active and that the requested quantity is no more than `stock_quantity`.
- Adding to the cart does **not** reduce stock. Stock will only go down at checkout, once orders are added.
- Viewing the cart re-checks stock and flags items whose stock has dropped since they were added.
- Cart items don't store a price. The current price is always read from `products`.

## Roadmap

1. Auth, products, categories, cart (current)
2. Checkout: addresses, orders, order items (with a price snapshot)
3. Payments
4. Extras: product images, reviews, many-to-many categories, guest carts
