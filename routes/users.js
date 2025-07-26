import express from "express";
import protect from "../middleware/auth.js";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getUserBlogs
} from "../controllers/userController.js";
import { upload } from "../middleware/upload.js"; 

const router = express.Router();

router.route("/me")
  .get(protect, getUserProfile)
  .put(protect, upload.single("avatar"), updateUserProfile); 

router.put("/password", protect, updatePassword);
router.get("/blogs", protect, getUserBlogs);

export default router;
