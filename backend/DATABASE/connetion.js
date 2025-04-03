import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "BID_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to the Database");
    })
    .catch((error) => {
      console.log(`Some error occurred while connecting to the database: ${error}`);
    });
};
