# FreshAgriPool

[![Build and Deploy](https://github.com/your-username/your-repository/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/your-repository/actions/workflows/deploy.yml)

FreshAgriPool is a full-stack agriculture support platform that connects farmers with useful digital services such as account management, fertilizer planning, transport requests, and contact support. The project is built with a React + Vite frontend and a Node.js/Express backend using MongoDB.

## Features

- Farmer and transporter registration/login
- JWT-based authentication support
- Gemini-powered AI fertilizer planning with saved history
- Live weather and planting advisory
- Mandi price tracker using data.gov.in with MongoDB caching
- Real-time transport marketplace with Socket.io
- Role-based farmer, transporter, and admin access
- Admin analytics dashboard with charts
- Optional Cloudinary crop photo upload
- PWA support for installable app behavior
- Contact form stored in MongoDB
- Responsive React pages for home, about, login, register, fertilizer, transport, and contact
- Backend REST APIs built with Express and Mongoose

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React icons

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- bcrypt
- JSON Web Token
- dotenv
- CORS

## Project Structure

```text
FRESHAGRIPOOL/
|-- client/                 # React + Vite frontend
|   |-- src/
|   |   |-- components/     # Reusable UI components
|   |   |-- context/        # Auth, socket, and theme contexts
|   |   |-- pages/          # App pages
|   |   `-- utils/          # Axios API helper
|   `-- package.json
|-- server/                 # Express backend
|   |-- controllers/        # API controller logic
|   |-- models/             # Mongoose models
|   |-- routes/             # Express routes
|   |-- index.js            # Server entry point
|   `-- package.json
|-- vercel.json             # Frontend deployment config
`-- README.md
```

## Getting Started

### Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB database

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd FRESHAGRIPOOL
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend Environment

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SERVER_ROOT=http://localhost:5000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/oauth/google/callback
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/oauth/github/callback
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_16_character_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_openweathermap_api_key
MANDI_API_KEY=your_data_gov_in_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run the Backend

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd client
npm install
```

### 6. Configure Frontend Environment

Create a `.env` file inside the `client` folder:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 7. Run the Frontend

```bash
npm run dev
```

The frontend will run at the Vite local URL, usually:

```text
http://localhost:5173
```

## Available Scripts

### Client

```bash
npm run dev      # Start Vite development server
npm run build    # Build frontend for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server

```bash
npm start        # Start server with Node
npm run dev      # Start server with Nodemon
```

## Main Pages

- `/` - Home page
- `/register` - User registration
- `/login` - User login
- `/fertilizer` - Fertilizer planner
- `/transport` - Transport request page
- `/weather` - Weather and planting advisory
- `/mandi` - Mandi price tracker
- `/my-bookings` - Farmer booking history
- `/transporter-dashboard` - Transporter marketplace dashboard
- `/admin` - Admin analytics dashboard
- `/contact` - Contact page
- `/about` - About page

## API Endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Fertilizer

```text
POST /api/fertilizer/ai-recommend
GET  /api/fertilizer/my-plans
GET  /api/fertilizer/all
```

### Transport

```text
POST /api/transport/request
GET  /api/transport/open
GET  /api/transport/my-requests
GET  /api/transport/assigned
PUT  /api/transport/:id/accept
PUT  /api/transport/:id/status
PUT  /api/transport/:id/cancel
```

### Contact

```text
POST /api/contact/submit
```

### Weather, Mandi, and Admin

```text
GET /api/weather?city=CityName
GET /api/mandi?state=Punjab&commodity=Wheat
GET /api/admin/stats
GET /api/admin/users
GET /api/admin/contacts
```

## Deployment

The project includes a `vercel.json` file for deploying the frontend from the `client` folder. Before deployment, set the `VITE_API_BASE_URL` environment variable to your deployed backend URL.

## Notes

- Keep `.env` files private and do not commit database credentials or JWT secrets.
- Make sure MongoDB is running or your MongoDB Atlas connection string is valid before starting the backend.
- The backend root route returns a simple health message: `AgriPool backend is running...`
