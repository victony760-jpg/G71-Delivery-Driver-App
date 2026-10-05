# G71 Logistics

G71 Logistics is a delivery management website for customers, administrators, and drivers. The frontend is a React/Vite application, and the API is a Node.js/Express service backed by MongoDB.

## Website Flow

### Customer

1. Visit the website and use **Request Delivery** to enter sender, receiver, pickup, drop-off, and package details.
2. Requests can be submitted Monday through Saturday, from **8:00 AM to 6:00 PM West Africa Time (WAT)**. Sunday is closed. The site displays the current business-hours status and the API enforces it.
3. Save the tracking code shown after a successful request.
4. Use **Track Order** and enter the tracking code to view progress. Public tracking masks sensitive address details.
5. The customer receives an email with a delivery one-time passcode (OTP) when the delivery reaches the out-for-delivery stage. The driver verifies this code to complete the delivery.

Customers can also view the pricing calculator, contact support, and browse the informational pages.

### Staff login

The staff login is not in the main navigation. Scroll to the **footer** and select **Staff Access**. It opens `/login`.

Only **admin** and **driver** accounts are supported; dispatcher accounts are no longer a supported role. Staff credentials are created and managed securely, not provided in this README.

### Administrator

After signing in, the admin can use the admin dashboard to:

- Review and approve or reject customer service requests.
- View the dispatch board and assign approved shipments to active drivers.
- Manage driver accounts and driver applications.
- View driver performance, live driver locations, and system information.
- Update delivery rates.
- Review decline reasons when a driver declines an assignment.

### Driver

After signing in, the driver can:

1. Review new assignments and accept or decline them. A decline reason is recorded for the admin.
2. View active deliveries and update shipment progress and location.
3. When a delivery is out for delivery, request that the OTP be emailed to the customer.
4. Verify the customer's OTP face-to-face to mark the delivery complete.
5. View delivery history, profile information, and shipment-derived earnings/performance. Earnings are recorded amounts, not payout confirmation.

## Live Website and Backend

- Frontend website: <https://g71-delivery-driver-app.vercel.app>
- Staff login: use **Staff Access** in the website footer.

The deployed backend is hosted on Render:

- API base URL: <https://g71-delivery-driver-app.onrender.com>
- Health check: <https://g71-delivery-driver-app.onrender.com/health>
- API health check: <https://g71-delivery-driver-app.onrender.com/api/health>

Configure the frontend deployment in Vercel to use the backend's `/api` endpoint:

```dotenv
VITE_API_URL=https://g71-delivery-driver-app.onrender.com/api
```

In Render, set `FRONTEND_URL` to `https://g71-delivery-driver-app.vercel.app` so the API allows browser requests from the deployed site. The Vercel origin is also explicitly allowed by the backend CORS configuration. Redeploy the backend after changing its CORS configuration or Render environment variables.

The health endpoint confirms that the web service responds; it does not by itself prove MongoDB, email, or file-storage integrations are healthy.

## Run Locally

Prerequisites: Node.js, npm, and a reachable MongoDB database.

1. Install backend dependencies from `Backend`:

   ```powershell
   cd Backend
   npm install
   ```

2. Copy `Backend/.env.example` to `Backend/.env`, then set `MONGO_DB_URI` and a `JWT_SECRET` of at least 32 characters. Configure email and Supabase Storage variables if those integrations are needed.
3. Start the backend from `Backend`:

   ```powershell
   npm run dev
   ```

4. In another terminal, install and start the frontend from `Frontend`:

   ```powershell
   cd Frontend
   npm install
   npm run dev
   ```

5. For local development, configure `VITE_API_URL=http://localhost:5000/api` in `Frontend/.env`, or leave it unset if using the Vite `/api` proxy. The production API URL is configured in Vercel, not in the local ignored `.env` file.

Never commit `.env` files or real credentials. Keep deployment secrets in the hosting provider's secret manager.

## Checks

Run backend tests from `Backend`:

```powershell
npm test
```

Run frontend lint and production build from `Frontend`:

```powershell
npm run lint
npm run build
```

## MVP Readiness

The application implements the main customer request, dispatch, delivery, and tracking flows, but a successful local build is not proof of production readiness. Before accepting real shipments, verify the complete lifecycle against a staging database and real deployment integrations, add database-backed and browser-level workflow tests, and establish backups, monitoring, and an operational support process.
