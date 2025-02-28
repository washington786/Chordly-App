import mongoose from "mongoose";
import { URL } from "#/utils/variables";

mongoose
  .connect(URL as string)
  .then(
    () => {
      console.log("Connected to database server!");
    }
  )
  .catch((error: Error) => {
    console.log("=".repeat(10));
    console.log(error.name);
    console.log(error.message);
    console.log("=".repeat(10));
  });
