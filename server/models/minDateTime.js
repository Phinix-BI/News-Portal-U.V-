import mongoose from "mongoose";

const MinDateTime = new mongoose.Schema({
    minDate:String,
    minTime: String
  });

  const minDateTime = mongoose.model('minDateTime', MinDateTime);

  export  default minDateTime;