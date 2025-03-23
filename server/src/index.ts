import "module-alias/register"; // Resolve path aliases at runtime
import "dotenv/config"; // Load environment variables from .env file

import express, { Request, Response, NextFunction } from "express";

// Database connection
import "#/db/index"; // Ensure this file initializes your database connection

// Routers
import authRouter from "#/routers/auth";
import audio from "./routers/audio";
import favorites from "./routers/favorites";
import playlistRouter from "./routers/playlist";
import profileRouter from "./routers/profile";
import historyRouter from "./routers/history";
import cors from "cors";

// Utilities
import { PORT } from "#/utils/variables"; // Ensure this file exports the PORT variable
import { errorHandler } from "./middleware/error"; // Custom error handler

// Cron jobs
import "#/utils/cron"; // Ensure this file initializes any cron jobs

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files from the "src/public" directory
app.use(express.static("src/public"));
app.use(cors());
app.options("*", cors());
// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.use("/auth", authRouter);
app.use("/audio", audio);
app.use("/favorites", favorites);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app
  .listen(PORT)
  .on("listening", () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err: Error) => {
    console.error("Server error:", err.message);
  });

// Export the app for Vercel or testing
export default app;