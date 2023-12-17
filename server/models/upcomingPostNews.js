import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    image: String,
  });

const upcomingpostSchema = mongoose.Schema({
    news_No: Number,
    banner_img: String,
    title: String,
    content: String,
    other_img: [imageSchema],
    img_caption: String,
    date: String,
    postDate : String,
    postTime : String
  });


  const upcomingPostNews = mongoose.model("upcomingPostNews", upcomingpostSchema);

  export default upcomingPostNews;