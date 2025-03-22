import "gitignore";
import express from "express";
import "dotenv/config";

import "#/db/index.ts";

import { PORT } from "#/utils/variables";
import authRouter from "#/routers/auth";
import audio from "./routers/audio";
import favorites from "./routers/favorites";
import playlistRouter from "./routers/playlist";
import profileRouter from "./routers/profile";
import historyRouter from "./routers/history";

import "./utils/cron.ts";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(express.json());

app.use(express.static("src/public"));

app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/audio", audio);
app.use("/favorites", favorites);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);

app.use(errorHandler);

app
  .listen(PORT)
  .on("listening", function () {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", function (err: Error) {
    console.log(err.message);
  });
