import mongoose from "mongoose";
import { catchAsyncErrors } from "./cacheAsyncError.js";
import errorHandler from "./error.js";
import { Auction } from "../models/auctionSchema.js";

// The checkAuctionEndTime middleware
export const checkAuctionEndTime = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Validate if the auction ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new errorHandler("Invalid ID format.", 400));
  }

  
  // Find the auction from the database
  const auction = await Auction.findById(id);
  if (!auction) {
    return next(new errorHandler("Auction not found.", 404));
  }

  // Get the current time in UTC
  const now = new Date();

  // Auction start time (in UTC from the database)
  const auctionStartTime = new Date(auction.startTime);

  console.log("Auction Start Time (UTC):", auctionStartTime);
  console.log("Current Time (now in UTC):", now);

  // Check if auction has started
  if (auctionStartTime < now) {
    return next(new errorHandler("Auction has not started yet.", 400));
  }

  // Check if auction has ended
  const auctionEndTime = new Date(auction.endTime);
  if (auctionEndTime < now) {
    return next(new errorHandler("Auction has ended.", 400));
  }

  // If everything is fine, proceed to the next middleware
  next();
});




