import CounterModel from "../models/CounterModel.js";
import upcomingCounterModel from "../models/upcomingCounterModel.js";

export const newsCounter = async (req, res) => {
    try {
      const counter = await CounterModel.findOne();
      if (!counter) {
        // If there is no counter, you may want to handle this case accordingly
        res.status(404).json({ error: "Counter not found" });
      } else {
        res.json(counter);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

export const upcomingNewsCounter =  async (req, res) => {
    try {
      const counter = await upcomingCounterModel.findOne();
      if (!counter) {
        // If there is no counter, you may want to handle this case accordingly
        res.status(404).json({ error: "Counter not found" });
      } else {
        res.json(counter);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };