import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { getPosts,getPostsById,deletePost } from "../controllers/posts.js";

const router = express.Router();

import PostNews from '../models/PostNews.js';
// pagination function 

function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const results = {};
  
      try {
        const totalDocuments = await model.countDocuments().exec();
  
        if (endIndex < totalDocuments) {
          results.next = {
            page: page + 1,
            limit: limit,
            totalDocuments : totalDocuments
          };
        }
  
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit,
          };
        }
  
        results.results = await model.find().limit(limit).skip(startIndex).exec();
        res.paginatedResults = results;
        next();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  }

router.get('/posts',paginatedResults(PostNews),getPosts);

router.get("/posts/:id",getPostsById);

// DELETE a specific post by providing the post id
router.delete("/posts/:id",deletePost);

export default router;