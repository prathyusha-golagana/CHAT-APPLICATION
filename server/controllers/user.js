// import auth from "../config/firebase-config.js";

// export const getAllUsers = async (req, res) => {
//   const maxResults = 10;
//   let users = [];

//   try {
//     const userRecords = await auth.listUsers(maxResults);

//     userRecords.users.forEach((user) => {
//       const { uid, email, displayName, photoURL } = user;
//       users.push({ uid, email, displayName, photoURL });
//     });
//     res.status(200).json(users);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getUser = async (req, res) => {
//   try {
//     const userRecord = await auth.getUser(req.params.userId);

//     const { uid, email, displayName, photoURL } = userRecord;

//     res.status(200).json({ uid, email, displayName, photoURL });
//   } catch (error) {
//     console.log(error);
//   }
// };
import User from "../models/User.js"; // MongoDB User model
import {auth} from "../config/firebase-config.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Now from MongoDB
    res.status(200).json(users);
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

// ✅ Used by /register route
export const registerUser = async (req, res) => {
  try {
    console.log("registerUser hit:", req.user.uid);
    const uid = req.user.uid; // From Firebase token verified in middleware
    const userRecord = await auth.getUser(uid); // Fetch user details from Firebase
    const { email, displayName, photoURL } = userRecord;

    // ✅ Check if user already exists in MongoDB
    let user = await User.findOne({ uid });

    if (!user) {
      // ✅ Create and save new user in MongoDB
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
      });
      await user.save();
    }

    res.status(201).json({
      message: "User registered and saved to MongoDB",
      user: { uid, email, displayName, photoURL },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};
