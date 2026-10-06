# G71 Logistics

G71 Logistics is a delivery management website for customers, administrators, and drivers. The frontend is a React/Vite application, and the API is a Node.js/Express service backed by MongoDB.

GROUP NUMBER- GROUP 71

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
- Hosting: frontend on **Vercel**, backend API on **Render**.

The deployed backend is hosted on Render:

- API base URL: <https://g71-delivery-driver-app.onrender.com>
- Health check: <https://g71-delivery-driver-app.onrender.com/health>
- API health check: <https://g71-delivery-driver-app.onrender.com/api/health>
- Login endpoint: `POST https://g71-delivery-driver-app.onrender.com/api/auth/login`

Configure the frontend deployment in Vercel to use the backend's `/api` endpoint:

```dotenv
VITE_API_URL=https://g71-delivery-driver-app.onrender.com/api
```

In Render, set `FRONTEND_URL` to `https://g71-delivery-driver-app.vercel.app` so the API allows browser requests from the deployed site. The Vercel origin is also explicitly allowed by the backend CORS configuration. Redeploy the backend after changing its CORS configuration or Render environment variables.

The health endpoint confirms that the web service responds; it does not by itself prove MongoDB, email, or file-storage integrations are healthy.

## Backend API Endpoints

All API paths below are relative to `https://g71-delivery-driver-app.onrender.com`. Authenticated requests use:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

| Method   | Endpoint                              | Access                                           | Purpose                                                                  |
| -------- | ------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| `GET`    | `/health`                             | Public                                           | Render service health and uptime                                         |
| `GET`    | `/api/health`                         | Public                                           | API health and uptime                                                    |
| `POST`   | `/api/auth/register`                  | Public, rate limited                             | Register a customer account; public registration always creates a client |
| `POST`   | `/api/auth/login`                     | Public, rate limited                             | Sign in and receive a JWT and account role                               |
| `GET`    | `/api/auth/profile`                   | Any signed-in account                            | Get the current account profile                                          |
| `GET`    | `/api/auth/admin-only`                | Admin                                            | Verify admin authorization                                               |
| `GET`    | `/api/public/business-hours`          | Public                                           | Get the current Monday–Saturday business-hours status                    |
| `POST`   | `/api/public/requests`                | Public, rate limited; only during business hours | Submit a delivery request and receive a tracking code                    |
| `GET`    | `/api/public/tracking/:code`          | Public, rate limited                             | Track a request using its tracking code                                  |
| `POST`   | `/api/public/contact`                 | Public, rate limited                             | Send a contact/support message                                           |
| `POST`   | `/api/contact`                        | Public                                           | Contact/support message endpoint                                         |
| `GET`    | `/api/rates/active`                   | Public                                           | Get the active pricing rate                                              |
| `GET`    | `/api/rates`                          | Admin                                            | List pricing rates                                                       |
| `PUT`    | `/api/rates`                          | Admin                                            | Update pricing rates                                                     |
| `GET`    | `/api/shipments/track/:trackingId`    | Public, rate limited                             | Public shipment tracking                                                 |
| `POST`   | `/api/shipments`                      | Client or admin                                  | Create a shipment                                                        |
| `GET`    | `/api/shipments`                      | Signed-in account; results scoped by role        | List accessible shipments                                                |
| `GET`    | `/api/shipments/:id`                  | Signed-in account with access to shipment        | Get shipment details                                                     |
| `PUT`    | `/api/shipments/:id/status`           | Assigned driver or admin                         | Advance shipment status (completion requires OTP)                        |
| `PUT`    | `/api/shipments/:id/assign`           | Admin                                            | Assign shipment to an active driver                                      |
| `POST`   | `/api/shipments/:id/generate-otp`     | Assigned driver or admin, rate limited           | Email a delivery OTP when the shipment is out for delivery               |
| `POST`   | `/api/shipments/:id/verify-otp`       | Assigned driver or admin, rate limited           | Verify the OTP and complete the delivery                                 |
| `GET`    | `/api/admin/users`                    | Admin                                            | List users                                                               |
| `POST`   | `/api/admin/users`                    | Admin                                            | Create a driver account                                                  |
| `GET`    | `/api/admin/drivers/:id`              | Admin                                            | Get a driver's profile                                                   |
| `GET`    | `/api/admin/driver-performance`       | Admin                                            | Get shipment-based driver performance metrics                            |
| `GET`    | `/api/admin/role/:role`               | Admin                                            | List users by role                                                       |
| `DELETE` | `/api/admin/:id`                      | Admin                                            | Delete a user                                                            |
| `GET`    | `/api/admin/stats`                    | Admin                                            | Get dashboard statistics                                                 |
| `GET`    | `/api/admin/live-drivers`             | Admin                                            | Get live driver data                                                     |
| `GET`    | `/api/admin/requests`                 | Admin                                            | List service requests                                                    |
| `GET`    | `/api/admin/driver-applications`      | Admin                                            | List driver applications                                                 |
| `GET`    | `/api/admin/driver-applications/:id`  | Admin                                            | Get one driver application                                               |
| `PUT`    | `/api/admin/requests/:id/approve`     | Admin                                            | Approve a service request                                                |
| `PUT`    | `/api/admin/requests/:id/reject`      | Admin                                            | Reject a service request                                                 |
| `POST`   | `/api/driver/apply`                   | Public                                           | Submit a driver application, optionally with uploaded documents          |
| `PUT`    | `/api/driver/change-password`         | Driver                                           | Change a driver's password                                               |
| `GET`    | `/api/driver/new-jobs`                | Driver                                           | List pending assignments                                                 |
| `GET`    | `/api/driver/jobs`                    | Driver                                           | List assigned jobs                                                       |
| `PUT`    | `/api/driver/jobs/:id/accept`         | Driver assigned to the job                       | Accept an assignment                                                     |
| `PUT`    | `/api/driver/jobs/:id/decline`        | Driver assigned to the job                       | Decline an assignment and record the reason                              |
| `GET`    | `/api/driver/next-job`                | Driver                                           | Get the next active job                                                  |
| `GET`    | `/api/driver/history`                 | Driver                                           | Get delivered jobs                                                       |
| `PUT`    | `/api/driver/location`                | Driver                                           | Update driver location/online status                                     |
| `PUT`    | `/api/driver/job/:id/status`          | Driver                                           | Update an assigned job's status                                          |
| `POST`   | `/api/driver/job/:id/verify-otp`      | Driver assigned to the job, rate limited         | Verify delivery OTP                                                      |
| `GET`    | `/api/driver/applications`            | Admin                                            | List driver applications                                                 |
| `POST`   | `/api/driver/applications/:id/accept` | Admin                                            | Accept a driver application                                              |
| `POST`   | `/api/driver/applications/:id/reject` | Admin                                            | Reject a driver application                                              |
| `GET`    | `/api/driver/earnings`                | Driver                                           | Get delivered-shipment earnings and performance summary                  |

Invalid or unauthorized requests may return standard `4xx` responses. Server-side failures may return `5xx`; database availability and third-party email/storage integrations affect some operations.

1. Open the live frontend: <https://g71-delivery-driver-app.vercel.app>.
2. Scroll to the bottom of any public page and select **Staff Access** in the footer. This opens `/login`.
3. Sign in using the administrator credentials provided by the project owner/evaluator. Admin accounts are configured through `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend deployment environment; **there is intentionally no password in this public README**.
4. From the admin area, review requests, assign drivers, inspect driver performance, and access the other admin tools. Driver accounts are created by an administrator; sign in as a driver to exercise the driver workflow.
5. To exercise the customer flow, submit a request during business hours (Monday–Saturday, 8:00 AM–6:00 PM WAT), save its tracking code, and track it from the public site.

The grader should receive the admin email and password through a private channel or an evaluator-only credential field, not by committing credentials to this repository. If a temporary grading account is used, deactivate or rotate it after assessment.

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
