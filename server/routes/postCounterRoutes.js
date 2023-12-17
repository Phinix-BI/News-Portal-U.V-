import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import {newsCounter,upcomingNewsCounter} from '../controllers/counterController.js';

const router = express.Router();

router.get("/counter",newsCounter);

router.get("/upcoming/counter",upcomingNewsCounter);

export default router;