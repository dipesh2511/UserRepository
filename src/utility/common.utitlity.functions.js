import bcrypt from "bcryptjs";
import e from "express";
import jwt from "jsonwebtoken";

// function is used to handle errors and result avoid using try and catch in every function
export const tc = async (Promise, errorExt = {}) => {
  try {
    const data = await Promise;
    return [null, data];
  } catch (error) {
    Object.assign(error, errorExt);
    return [error, null];
  }
};

// salting function for bcrypt to hash password
export const applySalt = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const new_password = await bcrypt.hash(password, salt);
  return new_password;
};

// checking the hashed password with the original password
export const checkHash = async (password, hash) => {
  const check_password = await bcrypt.compare(password, hash);
  return check_password;
};

// jwt sign function to create a token
export const jwtSign = (payload) => {
  let token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const jwtTokenSign = (email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  return token;
};
