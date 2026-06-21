# ⚡ VOLT – Feel The Voltage (AI-Powered Ticketing)

VOLT is a cutting-edge, MERN-stack live event and ticketing platform.
It empowers users to seamlessly discover concerts, book tickets, manage event listings, and converse with **VoltBot**, an embedded AI assistant built directly into the app using Google Gemini!

---

## 🚀 Features

### 🎫 Event Booking & Management
- Browse upcoming live events with rich cinematic video trailers.
- View real-time seat availability and dynamically calculated ticket prices.
- Book tickets securely and apply promotional coupons.
- Fair cancellation policies (100% refund within 24 hours, 90% up to 7 days).

### 🧑‍💼 User Authentication
- Secure JWT-based authentication.
- Passwords fully encrypted with bcrypt.
- Private wallet system tracking user credits and refunds.

### 🤖 VoltBot (Google Gemini AI)
- Fully integrated conversational AI companion powered by **@google/genai**.
- Context-aware: VoltBot secretly analyzes the live database to recommend active concerts!
- Rate-limited and aggressively guarded to prevent off-topic prompts.

### ⚡ State Management & UI
- Built with **React** and powered by **Vite** for blazing fast HMR.
- Global state heavily managed by **Redux Toolkit**.
- Beautiful, fully responsive frontend styled via **Tailwind CSS**.

---

## 🏗️ Tech Stack

### Frontend
- React 19 + Vite
- Redux Toolkit (State Management)
- Tailwind CSS
- Axios

### Backend
- Node.js (Express 5.x)
- MongoDB & Mongoose
- Cloudinary (Image Hosting)

### AI Integration
- Google Gemini SDK (`@google/genai`)

---

## 📁 Project Structure

```text
VOLT/
│
├── client/        # React Frontend (Vite, Redux, Tailwind)
├── server/        # Express Backend
│   ├── models/    # MongoDB Schemas (User, Event, Order, Coupon)
│   ├── routes/    # API Routes
│   └── controllers/ # Business Logic (Rate limiting, ticketing math)
└── package.json   # Monolith Deployment Scripts
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder and include the following:

```env
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## ⚙️ Installation & Deployment

This project is configured as a monolithic service, making it incredibly easy to deploy on platforms like Render.

### 1. Local Development

Backend:
```bash
cd server  
npm run dev
```

Frontend:
```bash
cd client  
npm run dev
```

### 2. Production Deployment (Monolith)

In production, the Express backend serves the static React files automatically. Ensure `NODE_ENV=production` is set in your environment.

From the root directory, run:
```bash
npm run build
npm start
```

---

## 👨‍💻 Author

**Rishi Sahu**  
Full Stack Developer | MERN Stack