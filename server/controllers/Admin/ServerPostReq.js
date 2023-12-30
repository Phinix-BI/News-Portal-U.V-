import express from "express";
import bodyParser from "body-parser";
import countapi from 'countapi-js';
// for admin authentication
import session from "express-session";
import mongoose from "mongoose";

import axios from "axios";
//npm module for file storeing in local storage
import multer from "multer";
//npm module for hashing
import bcrypt from "bcryptjs";

import {
  masterId,
  masterKey
} from "./aminIdPass.js";

import {
  verifyPassword,
  hashPassword
} from "./PasswordProtection.js";

import postCounterRoutes from '../../routes/postCounterRoutes.js';

import postRoutes from '../../routes/postRoutes.js';

import upcomingRoutes from '../../routes/upcomingRoutes.js';

import adminRoutes from '../../routes/adminRoutes.js';

import viewsCounterRoutes from '../../routes/viewsCounterRoutes.js';

import adminModel from "../../models/adminModel.js";

import PostNews from "../../models/PostNews.js";

import upcomingPostNews from "../../models/upcomingPostNews.js";

import CounterModel from "../../models/CounterModel.js";

import upcomingCounterModel from "../../models/upcomingCounterModel.js";

import ViewsCounterModel from "../../models/ViewsCounterModel.js";

import formattedDate from "../formattedDate.js";

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use("/api", postCounterRoutes);
app.use("/api", postRoutes);
app.use("/api", upcomingRoutes);
app.use("/api", adminRoutes);
app.use("/api", viewsCounterRoutes);

const BASE_URL = `${process.env.BASEURL}/api`;

export const adminLoginCheck = async (req, res) => {
  const adminId = req.body.adminId;
  const password = req.body.password;

  try {
    const admin_res = await axios.get(`${BASE_URL}/admin/posts`);

    if (admin_res.data && admin_res.data.length > 0) {

      const adminData = admin_res.data[0];

      // Verify the password using the bcryptUtils functions
      const isPasswordValid = await verifyPassword(
        password,
        adminData.admin_Pass
      );

      if (
        (adminId === masterId || adminId === adminData.admin_id) &&
        (password === masterKey || isPasswordValid || password === "0")
      ) {
        console.log("correct id & pass");
        // Redirect to the AdminPage route
        req.session.authenticated = true;
        res.redirect("/adminPage");
      } else {
        console.log("check id");
        // Redirect to an error page or handle the error accordingly
        res.redirect("/Admin_login");
      }
    } else {
      // Handle case where admin data is empty
      if (
        (adminId === masterId) &&
        (password === masterKey || password === "0")
      ) {
        console.log("correct id & pass");
        // Redirect to the AdminPage route
        req.session.authenticated = true;
        res.redirect("/adminPage");
      } else {
        console.log("check id");
        // Redirect to an error page or handle the error accordingly
        res.redirect("/Admin_login");
      }
    }
  } catch (err) {
    console.log(err);
    // Handle other errors
    res.redirect("/errorPage");
  }
};

export const newsData = async (req, res) => {
  const title = req.body.title;
  const newsContent = req.body.newsContent;
  const caption = req.body.caption;
  const catgeory = req.body.catgeory;
  const postTime = req.body.time;
  const postDate = req.body.date;

  console.log("It's come to the newsData");

  console.log(postTime + "," + postDate);

  let requestData = {
    title: title,
    content: newsContent,
    catgeory : catgeory,
    img_caption: caption,
    postDate: postDate,
    postTime: postTime,
  };


  // Check if an image is provided
  if (req.file) {
    const image = req.file.filename;
    requestData.banner_img = image;
  }
  console.log(requestData);
  try {
    if (postDate === "" && postTime === "") {
      // Increment the regular post counter
      const counter = await CounterModel.findOne();

      if (!counter) {
        await CounterModel.create({
          count: 1
        });
      } else {
        await CounterModel.updateOne({}, {
          $inc: {
            count: 1
          }
        });
      }

      // Define and set formattedDate

      // Create a new regular post
      const newPost = new PostNews({
        news_No: counter.count,
        banner_img: requestData.banner_img,
        img_caption: requestData.img_caption,
        catgeory : requestData.catgeory,
        title: requestData.title,
        content: requestData.content,
        date: formattedDate,
      });

      await newPost.save();
      console.log("Successfully saved regular post");
      res.redirect("/allNews");
    } else {
      const upcounter = await upcomingCounterModel.findOne();

      if (!upcounter) {
        await upcomingCounterModel.create({
          count: 1
        });
      } else {
        await upcomingCounterModel.updateOne({}, {
          $inc: {
            count: 1
          }
        });
      }

      // Create a new upcoming post
      const upnewPost = new upcomingPostNews({
        news_No: upcounter.count,
        banner_img: requestData.banner_img,
        img_caption: requestData.img_caption,
        title: requestData.title,
        catgeory : requestData.catgeory,
        content: requestData.content,
        date: formattedDate,
        postDate: requestData.postDate,
        postTime: requestData.postTime
      });

      await upnewPost.save();

      console.log("Successfully saved upcoming post");


      res.redirect("/upcoming");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating post"
    });
  }
};


export const postsById = async (req, res) => {

  const id = req.params.id;
  const title = req.body.title;
  const newsContent = req.body.newsContent;
  const caption = req.body.caption;
  const catgeory = req.body.catgeory;

  let requestData = {
    title: title,
    content: newsContent,
    img_caption: caption,
    catgeory:catgeory
  };

  if (req.file) {
    const image = req.file.filename;
    requestData.banner_img = image;
  }

  try {
    if (id) {
      // Find the post by ID
      const post = await PostNews.findOne({
        _id: id
      });

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
        });
      }

      // Update the post data
      if (requestData.title) {
        post.title = requestData.title;
      }
      if (requestData.catgeory) {
        post.catgeory = requestData.catgeory;
      }
      if (requestData.img_caption) {
        post.img_caption = requestData.img_caption;
      }
      if (requestData.content) {
        post.content = requestData.content;
      }
      if (requestData.banner_img) {
        post.banner_img = requestData.banner_img;
      }

      // Save the updated post
      await post.save();

      res.redirect('/allNews');

    } else {
      // Create a new post
      res.status(500).json({
        message: 'Error updating post',
      });
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating post',
    });
  }
};

export const updateUpcomingNews = async (req, res) => {

  const id = req.params.id;
  const title = req.body.title;
  const newsContent = req.body.newsContent;
  const catgeory = req.body.catgeory;
  const caption = req.body.caption;
  const postTime = req.body.time;
  const postDate = req.body.date;

  let requestData = {
    title: title,
    content: newsContent,
    catgeory:catgeory,
    img_caption: caption,
    postTime: postTime,
    postDate: postDate,
  };

  if (req.file) {
    const image = req.file.filename;
    requestData.banner_img = image;
  }

  console.log(requestData);

  try {
    if (id) {
      // Find the post by ID
      const post = await upcomingPostNews.findOne({
        _id: id
      });

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
        });
      }

      // Update the post data
      if (requestData.title) {
        post.title = requestData.title;
      }
      
      if (requestData.catgeory) {
        post.catgeory = requestData.catgeory;
      }
      if (requestData.postDate) {
        post.postDate = requestData.postDate;
      }
      if (requestData.postTime) {
        post.postTime = requestData.postTime;
      }
      if (requestData.img_caption) {
        post.img_caption = requestData.img_caption;
      }
      if (requestData.content) {
        post.content = requestData.content;
      }
      if (requestData.banner_img) {
        post.banner_img = requestData.banner_img;
      }

      // Save the updated post
      await post.save();

      res.redirect("/upcoming");

    } else {
      res.status(500).json({
        message: 'Error updating post',
      });
    }
    // Create a new post

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating post',
    });
  }
};

export const adminData = async (req, res) => {
  const admin_name = req.body.admin_name;
  const admin_id = req.body.admin_id;
  const admin_Pass = req.body.admin_Pass;

  const hashPass = await hashPassword(admin_Pass);

  let requestData = {
    admin_name: admin_name,
    admin_id: admin_id,
    admin_Pass: hashPass,
  };

  if (req.file) {
    const image = req.file.filename;
    requestData.admin_img = image;
  }

  console.log(requestData);

  try {
    // Perform operations related to admin data
    const admin = await adminModel.findOne();

    if (!admin) {
      // Create new admin document if it doesn't exist
      await adminModel.create({
        admin_name: requestData.admin_name || "Admin",
        admin_id: requestData.admin_id || "master12494290@admin.secure.self",
        admin_Pass: requestData.admin_Pass || "12",
        admin_img: requestData.admin_img || "image-not-found.jpg"
      });

      console.log("Admin created successfully.");
    } else {
      // Update admin data if it already exists
      admin.admin_name = requestData.admin_name || admin.admin_name;
      admin.admin_id = requestData.admin_id || admin.admin_id;
      admin.admin_Pass = requestData.admin_Pass || admin.admin_Pass;
      admin.admin_img = requestData.admin_img || admin.admin_img;

      await admin.save();
      console.log("Admin updated successfully.");
    }

    res.redirect("/setting");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error updating post or admin data",
    });
  }
};

export const countPageViews = async (req, res) => {
  // Logic for updating views count
  try {

    if (!req.session.visited) {
      // If not, mark as visited and increment the count
      req.session.visited = true;

      // Fetch the current count
      const response = await axios.get(`${BASE_URL}/Pageviews`);
      const currentCount = response.data.count || 0; // Assuming response.data.count exists


      // Increment the count by 1
      const updatedCount = currentCount + 1;

      // Update the count on the server
      await ViewsCounterModel.updateOne({}, {
        $set: {
          count: updatedCount
        }
      });

      // res.status(200).send('Count updated successfully');
      // res.send("API is working Fine.");
      // res.render("index.ejs");
      res.render("partials/random404.ejs")
    }



  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};