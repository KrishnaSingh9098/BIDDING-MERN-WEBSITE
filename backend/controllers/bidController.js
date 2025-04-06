import { catchAsyncErrors } from "../middlewares/cacheAsyncError.js";
import errorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import User from "../models/userSchema.js";

// The placeBid function to handle bid placement logic
export const placeBid = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body); // Log the request body to check its contents

  // Extract the auction item ID from the request parameters
  const { id } = req.params;

  // Find the auction item in the database
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new errorHandler("Auction Item not found.", 404));
  }

  // Extract the bid amount from the request body
  const { amount } = req.body;
  console.log(amount);
  if (!amount) {
    return next(new errorHandler("Please place your bid.", 404));
  }

  // Check if the bid amount is greater than the current bid
  if (amount <= auctionItem.currentBid) {
    return next(
      new errorHandler("Bid amount must be greater than the current bid.", 404)
    );
  }

  // Check if the bid amount is greater than the starting bid
  if (amount < auctionItem.startingBid) {
    return next(
      new errorHandler("Bid amount must be greater than starting bid.", 404)
    );
  }

  try {
    // Check if the user has already placed a bid for this auction item
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });

    // Check if the user already has a bid in this auction
    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() === req.user._id.toString()
    );

    // If the user already has a bid, update the bid
    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBidInAuction.save();
      await existingBid.save();
      auctionItem.currentBid = amount;
    } else {
      // If no existing bid, create a new bid
      const bidderDetail = await User.findById(req.user._id);
      console.log(bidderDetail);

      // Use the profileImage from the user's profile (profileImage will be fetched from the User model)
      const profileImage = bidderDetail.profileImage?.url || "defaultProfileImageUrl"; // Use the default if no profile image

      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: profileImage, // Use profileImage from the user's account creation
        },
        auctionItem: auctionItem._id,
      });

      // Push the new bid into the auction item bids array
      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: profileImage, // Use profileImage from the user's account creation
        amount,
      });
      auctionItem.currentBid = amount;
    }

    // Save the updated auction item
    // await auctionItem.save();
    const newBid = auctionItem.bids[auctionItem.bids.length - 1];
await newBid.save({ suppressWarning: true }); // Suppress the warning


// Then save the parent document
await auctionItem.save();

    // Send the success response
    res.status(201).json({
      success: true,
      message: "Bid placed.",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    // Handle any errors that occur
    return next(new errorHandler(error.message || "Failed to place bid.", 500));
  }
});




