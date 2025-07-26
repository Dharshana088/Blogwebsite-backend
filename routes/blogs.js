import express from "express";
import protect from "../middleware/auth.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { validateBlog } from "../middleware/validation.js";

import {uploadBlogImages} from '../middleware/upload.js';

const router = express.Router();


router.post("/", 
  protect, 
uploadBlogImages,
    validateBlog,  
  createBlog
);


router.get("/", protect, getAllBlogs);


router.get("/:id", protect, getBlogById);


router.put("/:id", 
  protect, 
  uploadBlogImages,
    validateBlog, 
  updateBlog
);


router.delete("/:id", protect, deleteBlog);

export default router;