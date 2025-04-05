import mongoose from "mongoose";
import { catchAsyncErrors } from "./cacheAsyncError.js";
import errorHandler from "./error.js";
import { Auction } from "../models/auctionSchema.js";

export const checkAuctionEndTime = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new errorHandler("Invalud ID format.", 400));
  }
  const auction = await Auction.findById(id);
  if (!auction) {
    return next(new errorHandler("Auction not found.", 404));
  }
  const now = new Date();
  if (new Date(auction.startTime) > now) {
    return next(new errorHandler("Auction has not started yet.", 400));
  }
  if (new Date(auction.endTime) < now) {
    return next(new errorHandler("Auction is ended.", 400));
  }
  next();
});