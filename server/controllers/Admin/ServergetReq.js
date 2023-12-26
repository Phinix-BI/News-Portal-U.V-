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

import postCounterRoutes from '../../routes/postCounterRoutes.js';

import postRoutes from '../../routes/postRoutes.js';

import upcomingRoutes from '../../routes/upcomingRoutes.js';

import adminRoutes from '../../routes/adminRoutes.js';

import viewsCounterRoutes from '../../routes/viewsCounterRoutes.js';

const app = express();

app.use("/api",postCounterRoutes);
app.use("/api",postRoutes);
app.use("/api",upcomingRoutes);
app.use("/api",adminRoutes);
app.use("/api",viewsCounterRoutes);


export const adminLoginPage = async(req,res)=>{
    res.render("partials/loginPage.ejs");
}


export const errorPage = (req, res) => {
    res.render("partials/random404.ejs");
  };

  const BASE_URL = 'http://localhost:3000/api';

export const adminDashboard =  async (req, res) => {
    try {
    const limit = 5; // Specify the limit for the number of posts you want to retrieve
  
  // Get the total count of posts
  
  const newsCount = await axios.get(`${BASE_URL}/counter`);
  
  const totalPosts = newsCount.data.count - 1;
  
  const upcomingnewsCount = await axios.get(`${BASE_URL}/upcoming/counter`);
  
  const upcomingTotalPosts = upcomingnewsCount.data.count - 1;
  
  // Calculate the page number where the last 5 posts start
  let pageForLastFive = Math.ceil(totalPosts / limit);
  
  let pageForLastUpcomingNews = Math.ceil(upcomingTotalPosts / limit);
  
  const response = await axios.get(`${BASE_URL}/posts?page=${pageForLastFive}&limit=${limit}`);
  
  const Upcomingresponse = await axios.get(`${BASE_URL}/upcoming/posts/dateTime?page=${pageForLastUpcomingNews}&limit=${limit}`);
  
      const admin_res = await axios.get(`${BASE_URL}/admin/posts`);
  
      const viewsCount = await axios.get(`${BASE_URL}/Pageviews`);
  
  
        res.render("partials/adminPanel.ejs", {
          Total_news: newsCount.data.count - 1,
          admin_post: admin_res.data[0],
          upcoming_news: upcomingnewsCount.data.count - 1,
          totalVisits: viewsCount.data.count , // Pass the total visit count to your admin page
          posts : response.data.results,
          upcomingPosts : Upcomingresponse.data.results
        });
      
    } catch (error) {
      res.status(500).json({
        message: "Error fetching posts",
      });
      console.log(error);
    }
  };


  export const addNews = async (req, res) => {
    const admin_res = await axios.get(`${BASE_URL}/admin/posts`);
  
    res.render("partials/addNews.ejs", {
      heading: "Add News",
      admin_post: admin_res.data[0],
    });
  } 

  export const getNewsById =  async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${req.params.id}`);
      const admin_res = await axios.get(`${BASE_URL}/admin/posts`);

      console.log(response.data);

      res.render("partials/addNews.ejs", {
        heading: "Edit News",
        post: response.data,
        admin_post: admin_res.data[0],
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching post",
      });
    }
  };

  export const upcomingNewsById = async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/upcoming/posts/${req.params.id}`);
  
      const admin_res = await axios.get(`${BASE_URL}/admin/posts`);

      console.log(response.data);

      res.render("partials/addNews.ejs", {
        heading: "Edit News",
        post: response.data,
        admin_post: admin_res.data[0],
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching post",
      });
    }
  };

  export const allNews = async (req, res) => {

    try {
      let selectedPage = (parseInt)(req.query.page) || 1;
    console.log(selectedPage);
  
      const response = await axios.get(`${BASE_URL}/posts?page=${selectedPage}&limit=5`);
      // console.log("API Response:", response.data.results);
      const admin_res = await axios.get(`${BASE_URL}/admin/posts`);
  
      const total_news_response = await axios.get(`${BASE_URL}/counter`);
      const total_news_count = total_news_response.data.count;
  
      const itemsPerPage = 5;
      const totalPages = Math.ceil((total_news_count - 1) / itemsPerPage);
  
      let iterator = (selectedPage - 5) < 1 ? 1 : selectedPage - 5;
      let endingLink = (iterator + 9) <= totalPages ? (iterator + 9) : selectedPage + (totalPages - selectedPage);
      if(endingLink < (selectedPage + 4)){
          iterator -= (selectedPage + 4) - totalPages;
      }
  
      res.render("partials/allNews.ejs", {
        allNews: {
          posts: response.data.results,
          admin_post: admin_res.data[0],
          totalPages: totalPages,
          currPAge:selectedPage,
          iterator:iterator,
          endingLink:endingLink
  
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching posts",
      });
    }
  };

  export const upcomingNews =  async (req, res) => {
    try {
      let selectedPage = (parseInt)(req.query.page) || 1;
      console.log(selectedPage);
  
      const response = await axios.get(`${BASE_URL}/upcoming/posts/dateTime`);
  
      const admin_res = await axios.get(`${BASE_URL}/admin/posts`);
      const total_news_response = await axios.get(`${BASE_URL}/upcoming/counter`);
      const total_news_count = total_news_response.data.count;
  
      const itemsPerPage = 5;
      const totalPages = Math.ceil((total_news_count - 1) / itemsPerPage);
  
      let iterator = (selectedPage - 5) < 1 ? 1 : selectedPage - 5;
      let endingLink = (iterator + 9) <= totalPages ? (iterator + 9) : selectedPage + (totalPages - selectedPage);
      if(endingLink < (selectedPage + 4)){
          iterator -= (selectedPage + 4) - totalPages;
      }
  
      res.render("partials/upcomingNews.ejs", {
        allNews: {
        posts: response.data.results,
        admin_post: admin_res.data[0],
        totalPages: totalPages,
        currPAge:selectedPage,
        iterator:iterator,
        endingLink:endingLink
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching posts",
      });
    }
  };

  export const settingPage = async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/posts`);
  
      res.render("partials/Profile_Settings.ejs", {
        post: response.data[0],
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching post",
      });
    }
  }

  export const deleteFromAllnews = async (req, res) => {

    const id = req.params.id;

    console.log(req.params.id);

    try {
      // const postResponse = await axios.get(`${API_URL}/posts/${postId}`);
      //   const post = postResponse.data;
  
      await axios.delete(`${BASE_URL}/posts/${req.params.id}`);
  
      // Delete the associated image file
      //    if (post.banner_img) {
      //     const imagePath = `public/uploads/${post.banner_img}`;
      //     fs.unlinkSync(imagePath);
      // }
  
      res.redirect("/allNews");
    } catch (error) {
      res.status(500).json({
        message: "Error deleting post",
      });
    }
  };

  export const deleteFromUpcoming = async (req, res) => {

    const id = req.params.id;

    console.log(req.params.id);

    try {
     
      axios.delete(`${BASE_URL}/upcoming/posts/${req.params.id}`);
  
      // Delete the associated image file
      //    if (post.banner_img) {
      //     const imagePath = `public/uploads/${post.banner_img}`;
      //     fs.unlinkSync(imagePath);
      // }
     
      res.redirect("/upcoming");

    } catch (error) {
      res.status(500).json({
        message: "Error deleting post",
      });
      console.log(error);
    }
  }

  export const logout = (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        // Handle the error if necessary
      } else {
        // Redirect to the login page or any other desired destination after logout
        res.redirect("http://localhost:3001");
      }
    });
  };