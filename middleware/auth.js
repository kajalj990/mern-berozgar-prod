import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

UnAuthenticatedError;
const auth = async (req, res, next) => {
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  //   throw new UnAuthenticatedError("Authentication Failed");
  // }
  // const token = authHeader.split(" ")[1];

  const token = req.cookies.token;
  if (!token) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    const testUser = payload.userId === "64d7cc34fbbb3786136b3c9b";
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Failed");
  }
};
export default auth;
