import express from "express";
import dotenv from "dotenv";
import colors from "colors";

// Local routes
import connectDB from "./config/dbconfig.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import commentRoutes from "./routes/commentRoutes.js"
import creditRoutes from "./routes/creditRoutes.js";
import giveAnswer from "./controllers/chatController.js";
import protect from "./middleware/authMiddleware.js";

dotenv.config();

//DB CONNECTION

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

//Body-Parser

app.use(express.json());
app.use(express.urlencoded());

// default Route

app.get("/", (req, res) => {
  res.json({
    message: "WELCOME TO MOODGO API",
  });
});

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

//Chat Routes

app.post("/api/chat" , protect.forUser , giveAnswer)

// Error Handler

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`SERVER IS RUNNING AT PORT : ${PORT} `.bgBlue.white),
);

