import mongoose from "mongoose";

const upcomingcounterSchema = new mongoose.Schema({
    count: {
      type: Number,
      default: 0
    }
  });

  const upcomingCounterModel = mongoose.model('upcomingCounterModel', upcomingcounterSchema);

  export default upcomingCounterModel;