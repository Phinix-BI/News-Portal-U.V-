import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { getAllPosts,getPaginatedPost,getUpcomingPostsById,deleteUpcomingPost } from "../controllers/upcomingPostController.js";

const router = express.Router();


import upcomingPostNews from "../models/upcomingPostNews.js";
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

router.get('/upcoming/posts',getAllPosts);

router.get('/upcoming/posts/dateTime',paginatedResults(upcomingPostNews),getPaginatedPost);

router.get("/upcoming/posts/:id",getUpcomingPostsById);


// PATCH a post when updating parameters


// DELETE a specific post by providing the post id
router.delete("/upcoming/posts/:id",deleteUpcomingPost);

export default router;