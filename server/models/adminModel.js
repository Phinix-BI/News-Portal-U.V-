import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    admin_name: String,
    admin_id: String,
    admin_Pass: String,
    admin_img: String
  });
  
  const adminModel = mongoose.model('adminModel', adminSchema);

  export default adminModel;