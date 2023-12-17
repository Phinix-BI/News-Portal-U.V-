import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const router = express.Router();

import {getPageViews} from '../controllers/viewsController.js';

// Update views count
// router.post("/Pageviews",countPageViews);

// GET views count
router.get("/Pageviews",getPageViews);

export default router;