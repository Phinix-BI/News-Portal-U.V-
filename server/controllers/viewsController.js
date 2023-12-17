import ViewsCounterModel from '../models/ViewsCounterModel.js';

export const getPageViews = async (req, res) => {
    // Logic for fetching views count
    try {
        const counter = await ViewsCounterModel.findOne();
        if (!counter) {
          // If there is no counter, you may want to handle this case accordingly
          counter = await ViewsCounterModel.create({ count: 0 });
          // res.status(404).json({ error: "Counter not found" });
        } else {
          res.json(counter);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
  };

  // export const countPageViews = async (req, res) => {
  //   // Logic for updating views count
  //   try {
  //       const  count = req.body.count; // Extract the count from the request body
    
  //       if (typeof count === 'undefined') {
  //         return res.status(400).send('Count is missing in the request body');
  //       }
    
  //       // Update the count in the ViewsCounterModel using Mongoose $set operator
  //       await ViewsCounterModel.updateOne({}, { $set: { count: count } });
    
  //       res.status(200).send('Count updated successfully');
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).send(error.message);
  //     }
  //   };