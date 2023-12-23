import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    image: String,
  });
  
  const postSchema = mongoose.Schema({
    news_No: Number,
    banner_img: String,
    title: String,
    catgeory: String,
    content: String,
    other_img: [imageSchema],
    img_caption: String,
    date: String
  });

const PostNews = mongoose.model('PostNews', postSchema);

export default PostNews;
