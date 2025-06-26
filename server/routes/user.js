// import express from "express";

// import { getAllUsers, getUser } from "../controllers/user.js";

// const router = express.Router();

// router.get("/", getAllUsers);
// router.get("/:userId", getUser);

// export default router;
import express from "express";
import { getAllUsers, getUser, registerUser } from "../controllers/user.js";
import { VerifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.post("/register",VerifyToken, registerUser);  // 🔥 New route for registering user in backend
router.get("/", getAllUsers);
router.get("/:userId", getUser);



export default router;

