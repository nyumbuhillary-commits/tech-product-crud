# ICT251 Activity 4 - Tech Product Showcase (Single-Table CRUD)

**Question 5 - resource: `products`, table: `products`**
Stack: Node.js + Express + SQLite (Node built-in SQLite), plain HTML/JS frontend.

## Structure
```
tech-product-crud/
├─ backend/   .env  package.json  schema.sql  db.js  server.js
├─ frontend/  index.html  app.js
└─ postman/   Products_CRUD.postman_collection.json
```

## Run locally (Windows PowerShell)
```powershell
cd tech-product-crud\backend
npm install
npm start
```
Open **http://localhost:3000** - the frontend is served by the same server.
The database file (`products.db`) is created and seeded with 10 products automatically.

Requires Node.js 22.13+ (you have v24, which is fine) (https://nodejs.org).

## API
| Method | URL | Purpose |
|---|---|---|
| GET | /api/products | List all |
| GET | /api/products/:id | Get one |
| POST | /api/products | Create (body: product_name*, brand, category, price, stock, description) |
| PUT | /api/products/:id | Update |
| DELETE | /api/products/:id | Delete |

## Postman (for the video)
1. Postman -> Import -> `postman/Products_CRUD.postman_collection.json`
2. Run the 5 requests in order (1 -> 5). For a cloud demo, change the collection variable `baseUrl` to your deployed URL.
3. Screen-record while showing URL, method, request body and the JSON response for each.

## Deploy to the cloud (Render - free, no code changes)
1. Push the whole `tech-product-crud` folder to a GitHub repo.
2. https://render.com -> New -> **Web Service** -> connect the repo.
3. Settings: Root Directory `backend`, Build Command `npm install`, Start Command `npm start`, Instance: Free.
4. Add environment variable `DB_PATH=./products.db` (PORT is set by Render).
5. After deploy you get e.g. `https://your-app.onrender.com`:
   - Frontend: `https://your-app.onrender.com/`
   - API: `https://your-app.onrender.com/api/products`

Note: on Render's free tier the SQLite file resets when the service restarts/redeploys (sample data is re-seeded automatically). The first request after idle can take ~50 s.



## What to submit (Google Form)
- Deployed frontend link and the API links (GET, POST, PUT, DELETE all use `/api/products` and `/api/products/:id`)
- Postman video, and GitHub repo link
