import { auth } from "../config/firebase-config.js";  // Import 'auth' properly

export const VerifyToken = async (req, res, next) => {
   console.log("VerifyToken middleware hit"); 
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided!" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token format is incorrect!" });
  }

  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized access!" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error", error: e.message });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token provided!"));
  }

  try {
    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      socket.user = decodeValue;
      return next();
    } else {
      return next(new Error("Unauthorized socket connection!"));
    }
  } catch (e) {
    return next(new Error("Internal Server Error: " + e.message));
  }
};
