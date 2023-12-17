import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    count: {
      type: Number,
      default: 0
    }
  });

  const CounterModel = mongoose.model('CounterModel', counterSchema);

  export default CounterModel;