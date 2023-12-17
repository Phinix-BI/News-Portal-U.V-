import PostNews from "../models/PostNews.js";
import upcomingPostNews from "../models/upcomingPostNews.js";
import formattedDate  from "./formattedDate.js";
import CounterModel from "../models/CounterModel.js";
import upcomingCounterModel from "../models/upcomingCounterModel.js";
export const getPosts = async (req, res) => {
    res.json(res.paginatedResults);
  };

export const getPostsById = async (req, res) => {
  
  const id = req.params.id;
  try {
    // Find the post by news_No
    const post = await PostNews.findOne({
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


export const deletePost = async(req,res)=>{
  try {
    const id = req.params.id;

    // Use findOneAndRemove with news_No
    const docDelete = await PostNews.findOneAndDelete({
      _id: id
    });

    // Get all remaining posts and update news_No accordingly
    const remainingPosts = await PostNews.find({}, '_id').sort({
      news_No: 1
    });

    for (let i = 0; i < remainingPosts.length; i++) {
      const postId = remainingPosts[i]._id;
      await PostNews.findByIdAndUpdate(postId, {
        $set: {
          news_No: i + 1
        }
      });

    }
    console.log(remainingPosts.length);
    
    await CounterModel.updateOne({}, {
      count: remainingPosts.length + 1
    });

    console.log("Successfully deleted and updated posts");
    res.status(200).json({
      message: "Successfully deleted and updated posts"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }

};
