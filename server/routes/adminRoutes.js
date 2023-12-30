import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { getAdminData } from "../controllers/adminController.js";
import adminModel from "../models/adminModel.js";

const router = express.Router();
  
router.get("/admin/posts",getAdminData);

export default router;