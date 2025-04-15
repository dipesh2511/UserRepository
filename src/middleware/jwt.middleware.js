import jwt from "jsonwebtoken";
import GenericErrorHandler from "../utility/generic.error.handler.js";
import { tc } from "../utility/common.utitlity.functions.js";

export const jwtAuthGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new GenericErrorHandler(
        "Authorization header not found",
        401,
        "Unauthorized",
        null
      )
    );
  }
  const token = authHeader.split(" ")[1];
  const [error, decode] = await tc(jwt.verify(token, process.env.JWT_SECRET));

  if (error) {
    return next(
      new GenericErrorHandler("Invalid token", 401, "Unauthorized", null)
    );
  }

  req.payload = {};
  req.payload.user_id = decode.payload.user_id;
  req.payload.email = decode.payload.email;
  req.payload.firstName = decode.payload.firstName;
  req.payload.lastName = decode.payload.lastName;

  next();
};
