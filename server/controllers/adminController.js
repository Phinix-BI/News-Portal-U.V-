import adminModel from "../models/adminModel.js";

  export const getAdminData = async (req, res) => {
  
    try {
      const allPosts = await adminModel.find().lean();
  
      res.send(allPosts);
  
    } catch (error) {
      console.log(error);
      res.json({
        message: "Internal Server Error"
      });
    }
  
  };