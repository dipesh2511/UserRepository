import nodemailer from "nodemailer";
import getResetEmailTemplate from "./email.template.js";

export default class UserModel {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  static register(firstName, lastName, email, password) {
    const user = new UserModel(firstName, lastName, email, password);
    return user;
  }

  static async createEmail(email, token) {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.REGISTER_EMAIL,
        pass: process.env.REGISTER_PASSWORD, // keep credentials in .env
      },
    });

    const resetLink = `http://localhost:3000/api/users/set-new-password/${token}`;

    const mailOptions = {
      from: process.env.REGISTER_EMAIL,
      to: email,
      subject: "Password Reset Link",
      html: getResetEmailTemplate(resetLink),
    };

    try {
      const info = await transport.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}
