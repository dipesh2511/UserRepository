import {
  applySalt,
  checkHash,
  jwtSign,
  jwtTokenSign,
  jwtVerify,
} from "../../utility/common.utitlity.functions.js";
import GenericErrorHandler from "../../utility/generic.error.handler.js";
import GenericResponseHandler from "../../utility/generic.response.handle.js";
import UserRepository from "./user.repository.js";
import UserModel from "./user.model.js";
import { UserPayloadClass } from "../../utility/payload.class.js";
import { tc } from "../../utility/common.utitlity.functions.js";
import path from "path";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async forgotPassword(req, res, next) {
    const { email } = req.body;

    if (!email) {
      return next(
        new GenericErrorHandler("Email is required", 400, "Bad req", null)
      );
    }

    let [error, data] = await tc(this.userRepository.checkUserExist(email));

    if (error || data instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler("User not found", 404, "Not found", null)
      );
    }
    let token = jwtTokenSign(email);
    const emailSent = await UserModel.createEmail(email, token);
    if (!emailSent) {
      return next(
        new GenericErrorHandler(
          "Email not sent",
          500,
          "Internal server error",
          null
        )
      );
    }
    [error, data] = await tc(this.userRepository.updateToken(email, token));
    if (error || data instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler("User not found", 404, "Not found", null)
      );
    }
    return res
      .status(200)
      .send(
        new GenericResponseHandler(
          "Email sent successfully on your email with reset link",
          200,
          "EMAIL",
          null
        )
      );
  }

  async setNewPassword(req, res, next) {
    const token = req.params.token;

    let [error, data] = await tc(jwtVerify(token));
    if (error || !data) {
      return next(
        new GenericErrorHandler("Url is invalid", 404, "BAD REQUEST", null)
      );
    }

    let [userError, userData] = await tc(
      this.userRepository.checkUserExist(data.email)
    );

    if (userError || userData instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler("User not found", 404, "Not found", null)
      );
    }

    if (userData.resetPasswordToken != token) {
      return next(
        new GenericErrorHandler(
          "Trying reset password again",
          404,
          "BAD REQUEST",
          null
        )
      );
    }
    
    let new_path = path.join(
      path.resolve(),
      "src",
      "view",
      "forgot.password.html"
    );
    res.sendFile(new_path);
  }

  async resetPassword(req, res, next) {
    const { password } = req.body;
    const token = req.params.token;
    if (!password) {
      return next(
        new GenericErrorHandler("Password is required", 400, "Bad req", null)
      );
    }
    let [error, data] = await tc(jwtVerify(token));
    if (error || !data) {
      return next(
        new GenericErrorHandler("Token is invalid", 401, "Unauthorized", null)
      );
    }

    let [userError, userData] = await tc(
      this.userRepository.checkUserExist(data.email)
    );

    if (userError || userData instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler("User not found", 404, "Not found", null)
      );
    }
    console.log("User data", userData);
    if (userData.resetPasswordToken != token) {
      return next(
        new GenericErrorHandler(
          "Trying reset password again",
          404,
          "BAD REQUEST",
          null
        )
      );
    }
    let new_password = await applySalt(password);

    let [updateError, updateData] = await tc(
      this.userRepository.updatePassword(data.email, new_password)
    );

    if (updateError || updateData instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler(
          "Password not updated",
          500,
          "Internal server error",
          null
        )
      );
    }
    res
      .status(200)
      .send(
        new GenericResponseHandler(
          "Password updated successfully",
          200,
          "UPDATE",
          null
        )
      );
  }

  // use for get user details whos logged in
  async get(req, res, next) {
    const { user_id, email, firstName, lastName } = req.payload;
    let [error, data] = await tc(this.userRepository.get(user_id));
    if (error || !data || data instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler("User not found", 404, "Not found", null)
      );
    }
    res
      .status(200)
      .send(new GenericResponseHandler("User found", 200, "GET", data));
  }

  // use for register a user
  async register(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    if (!password) {
      return next(
        new GenericErrorHandler("Password is required", 400, "Bad req", null)
      );
    }
    let new_password = await applySalt(password);
    let new_user = UserModel.register(firstName, lastName, email, new_password);

    let [error, data] = await tc(this.userRepository.create(new_user));
    if (error || !data || data instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler(
          "User not created",
          500,
          "Internal server error",
          null
        )
      );
    }
    res
      .status(201)
      .send(
        new GenericResponseHandler(
          "User created successfully",
          201,
          "CREATE",
          data
        )
      );
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    let [error, data] = await tc(this.userRepository.login(email, password));
    console.log("Data", data);
    if (error || !data || data instanceof GenericErrorHandler) {
      return next(
        new GenericErrorHandler("User not found", 404, "Not found", null)
      );
    }

    let [compareError, compareData] = await tc(
      checkHash(password, data.password)
    );
    if (
      compareError != null ||
      compareData == false ||
      typeof compareData != "boolean"
    ) {
      return next(
        new GenericErrorHandler(
          "Password is incorrect",
          401,
          "Unauthorized",
          null
        )
      );
    }

    let userPayload = new UserPayloadClass(
      data.firstName,
      data.lastName,
      data.email,
      data._id
    );

    let token = jwtSign(userPayload);
    data = { accessToken: `Bearer ${token}` };
    res
      .status(200)
      .send(
        new GenericResponseHandler(
          "User logged in successfully",
          200,
          "LOGIN",
          data
        )
      );
  }
}
