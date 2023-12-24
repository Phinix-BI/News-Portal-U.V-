import express from "express";
import bodyParser from "body-parser";
import countapi from 'countapi-js';
// for admin authentication
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
//npm module for file storeing in local storage
import multer from "multer";
//npm module for hashing
import bcrypt from "bcryptjs";

// all routes for news post,delete,patch
import postRoutes from './routes/postRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
import viewsCounterRoutes from './routes/viewsCounterRoutes.js';
import upcomingPostRoutes from './routes/upcomingRoutes.js';
import postCounterRoutes from './routes/postCounterRoutes.js';


import { addNews, adminDashboard, adminLoginPage, allNews, deleteFromAllnews, deleteFromUpcoming, errorPage, getNewsById, logout, settingPage, upcomingNews, upcomingNewsById } from "./controllers/Admin/ServergetReq.js";

//this is the master id & pass for admin login 
import { masterId,masterKey } from "./controllers/Admin/aminIdPass.js";

//using for hashing passwords

import { hashPassword , verifyPassword , authenticateUser} from "./controllers/Admin/PasswordProtection.js";

import { adminData, adminLoginCheck, newsData, postsById, updateUpcomingNews ,countPageViews } from "./controllers/Admin/ServerPostReq.js";

import PostNews from "./models/PostNews.js"

const port = 3000;
const app = express();

app.use(cors({
  origin:[ 'https://insights-insight-thick-prison.trycloudflare.com','http://localhost:3001'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use('/api',postRoutes);
app.use('/api',adminRoutes);
app.use('/api',viewsCounterRoutes);
app.use('/api',upcomingPostRoutes);
app.use('/api',postCounterRoutes);

app.use(express.static("public"));

app.use(bodyParser.json());

app.use( bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/NewsDb", {
  useNewUrlParser: true
})

// Set up express-session middleware (we use this for admin panel authentication)
app.use(
  session({
    secret: "c957fa32c75dcd49f0becb7346e566b529a4795ef001a640b6b0ea1c74dea2ca", // Replace with a strong secret key
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/",countPageViews);

app.get("/errorPage", errorPage);

//admin login 
app.get("/Admin_login",adminLoginPage);

app.post("/submit",adminLoginCheck);

// after login 

app.get("/adminPage", authenticateUser,adminDashboard);

// File upload system 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/getImageURL', (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }
  // Construct and send the URL based on the filename
  const imageUrl = `/uploads/${filename}`; // Modify the path as per your folder structure
  res.json({ imageUrl });
});
// another pages of admin panel 

app.get("/addNews", authenticateUser, addNews);

// get data from a  post
app.get("/edit/:id", authenticateUser,getNewsById);

// get data from upcoming  post
app.get("/upcoming/edit/:id", authenticateUser, upcomingNewsById);

// Route to render the main page
app.get("/allNews", authenticateUser, allNews);


// render upcoming posts
app.get("/upcoming", authenticateUser,upcomingNews);

// admin get

app.get("/setting", authenticateUser, settingPage);

app.get('/api/v2/posts', async (req, res) => {

  const category = req.query.category; // Get the category from the query parameter
    console.log(category);
  try {
    // Fetch posts filtered by the category (assuming 'category' is a field in your Post model)
    const posts = await PostNews.find({ catgeory: category }).exec();
    res.json({ results: posts }); // Send the filtered posts as JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", authenticateUser, deleteFromAllnews);

// Delete a post for upcoming post
app.get("/upcoming/api/posts/delete/:id", authenticateUser, deleteFromUpcoming);

//logout route
app.get("/logout", authenticateUser, logout);

// post methods

app.post( "/api/posts", authenticateUser, upload.single("banner_img") , newsData );

// patially update all news 
app.post("/api/posts/:id",authenticateUser,upload.single("banner_img"), postsById);

// patially update for upcoming post
app.post("/api/upcoming-posts/:id",authenticateUser, upload.single("banner_img"), updateUpcomingNews);


//admin post
app.post("/administrator/posts",authenticateUser,upload.single("admin_img"), adminData);





app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });