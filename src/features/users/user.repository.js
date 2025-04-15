import mongoose from "mongoose";
import { UserSchema } from "./user.schema.js";
import { tc } from "../../utility/common.utitlity.functions.js";
import GenericErrorHandler from "../../utility/generic.error.handler.js";
import { ObjectId } from "mongodb";
export default class UserRepository {
  constructor() {
    this.userModel = mongoose.model("users", UserSchema);
  }

  async updateToken(email, token) {
    let [error, data] = await tc(
      this.userModel.findOneAndUpdate(
        { email: email },
        { resetPasswordToken: token },
        { new: true }
      )
    );
    if (error || !data) {
      return new GenericErrorHandler("User not found", 404, "Not found", null);
    }
    return data;
  }
  async checkUserExist(email) {
    let [error, data] = await tc(this.userModel.findOne({ email: email }).select("+resetPasswordToken"));
    if (error || !data) {
      return new GenericErrorHandler("User not found", 404, "Not found", null);
    }
    return data;
  }
  async updatePassword(email, password) {
    let [error, data] = await tc(
      this.userModel.findOneAndUpdate(
        { email: email },
        { password: password },
        { new: true }
      )
    );

    if( error || !data) {
      return new GenericErrorHandler(
        "User not updated try again later",
        404,
        "Not found",
        null
      );
    }
    return data;
  }
  async get(user_id) {
    let [error, data] = await tc(
      this.userModel
        .findById({ _id: new ObjectId(user_id) })
        .select("-password")
    );
    if (error || !data) {
      return new GenericErrorHandler("User not found", 404, "Not found", null);
    }
    return data;
  }
  async create(user) {
    let new_user = new this.userModel(user);
    let [error, data] = await tc(new_user.save());
    if (error || !data) {
      return new GenericErrorHandler(
        "User not created",
        500,
        "Internal server error",
        null
      );
    }
    return data;
  }
  async login(email) {
    let [error, data] = await tc(
      this.userModel.findOne({ email }).select("+password")
    );
    console.log("Data", data);
    if (error || !data) {
      return new GenericErrorHandler("User not found", 404, "Not found", null);
    }
    return data;
  }
}
