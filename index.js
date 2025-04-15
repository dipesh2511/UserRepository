// using dot env to load environment variables in all file
import "./env.js";

import express from "express";
import { connectToDatabase } from "./src/config/mongodb.config.js";

//router imports
import userRouter from "./src/features/users/user.router.js";

import GenericErrorHandler from "./src/utility/generic.error.handler.js";

const server = express();
const PORT = process.env.PORT || 3000;

// Basic middleware to used in the server
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Routes in Server
server.use("/api/users", userRouter);

// to handle Global and application errors
server.use((err, req, res, nest) => {
  if (err instanceof GenericErrorHandler) {
    console.log("Generic Error Handler", err);  
    let new_error = new GenericErrorHandler(
      err.message || "Some Thing went wrong",
      err.status || 500,
      err.error_type || "INTERNAL SERVER ERROR",
      err.validation_error || null
    );
    res.status(err.status || 500).send(new_error);
  }
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server to listen
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDatabase();
});
