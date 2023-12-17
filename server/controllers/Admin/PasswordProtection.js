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

export const authenticateUser = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  } else {
    // User is not authenticated, redirect to the login page or handle it accordingly
    res.redirect("/Admin_login");
  }
};

export const hashPassword = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  };
  
export  const verifyPassword = async (enteredPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    return isMatch;
  };