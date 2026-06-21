import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";

// Local routes
import connectDB from "./config/dbconfig.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import creditRoutes from "./routes/creditRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

//DB CONNECTION

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

//Body-Parser

app.use(express.json());
app.use(express.urlencoded());

// Serve Frontend

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "WELCOME TO VOLT API",
    });
  });
}

// Auth Routes

app.use("/api/auth", authRoutes);

// Admin Routes

app.use("/api/admin", adminRoutes);

// Event Routes

app.use("/api/events", eventRoutes);

//order Routes & Ticket Booking Routes

app.use("/api/order", orderRoutes);

// Comment Routes

app.use("/api/comment/" , commentRoutes)

// Credit Routes
app.use("/api/credits", creditRoutes);

app.use("/api/chat", chatRoutes);

// Error Handler

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`SERVER IS RUNNING AT PORT : ${PORT} `.bgBlue.white),
);

