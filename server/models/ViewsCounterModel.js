import mongoose from "mongoose";

const ViewscounterSchema = new mongoose.Schema({
    count: {
      type: Number,
      default: 0
    }
  });

const ViewsCounterModel = mongoose.model('ViewsCounterModel', ViewscounterSchema);

export default ViewsCounterModel;