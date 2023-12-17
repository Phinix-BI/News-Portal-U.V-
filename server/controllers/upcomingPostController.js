import upcomingPostNews from "../models/upcomingPostNews.js";
import formattedDate  from "./formattedDate.js";

import upcomingCounterModel from "../models/upcomingCounterModel.js";

export const getAllPosts = async (req, res) => {

    // res.json(res.paginatedResults);
    try {
      const allPosts = await upcomingPostNews.find().lean();
  
      res.send(allPosts);
  
    } catch (error) {
      console.log(error);
      res.json({
        message: "Internal Server Error"
      });
    }
  };

export const getPaginatedPost = async (req, res) => {

    res.json(res.paginatedResults);
  };

export const getUpcomingPostsById =  async (req, res) => {

    const id = req.params.id;
    try {
      // Find the post by news_No
      const post = await upcomingPostNews.findOne({
        _id: id
      });
  
      if (!post) {
        return res.status(404).json({
          error: 'Post not found'
        });
      }
  
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  
  };

  

  export const deleteUpcomingPost =  async (req, res) => {

    try {
      const id = req.params.id;
  
      // Use findOneAndRemove with news_No
      const docDelete = await upcomingPostNews.findOneAndDelete({
        _id: id
      });

      console.log(docDelete);
  
      // Get all remaining posts and update news_No accordingly
      const remainingPosts = await upcomingPostNews.find({}, '_id').sort({
        news_No: 1
      });
  
      for (let i = 0; i < remainingPosts.length; i++) {
        const postId = remainingPosts[i]._id;
        await upcomingPostNews.findByIdAndUpdate(postId, {
          $set: {
            news_No: i + 1
          }
        });
  
      }
      console.log(remainingPosts.length);

      await upcomingCounterModel.updateOne({}, {
        count: remainingPosts.length + 1
      });
  
      console.log("Successfully deleted and updated posts");
      
    } catch (error) {
      console.error(error);
      res.status(500).send("error in deleteion");
    }
  
  };

