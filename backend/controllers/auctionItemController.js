  // import { Auction } from "../models/auctionSchema.js";
  // import User from "../models/userSchema.js";
  // import { catchAsyncErrors } from "../middlewares/cacheAsyncError.js";
  // import {v2 as cloudinary }from "cloudinary"
  // import errorHandler from "../middlewares/error.js";

  // export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  //   if (!req.files || Object.keys(req.files).length === 0) {
  //     return next(new errorHandler("Profile Image Required", 400));
  //   }

  //   const { image } = req.files;
  //   const allowFormat = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  //   if (!allowFormat.includes(image.mimetype)) {
  //     return res.status(400).json({
  //       message:
  //         "Invalid file format. Only JPEG, PNG, GIF, and WEBP are allowed.",
  //     });
  //   }

  //   const {
  //     title,
  //     description,
  //     category,
  //     condition,
  //     starttingBid,
  //     startTime,
  //     endTime,
  //   } = req.body;

  //   if(
  //     !title||
  //     !description||
  //     !category||
  //     !condition||
  //     !starttingBid||
  //     !startTime||
  //     !endTime
  // ){
  //     return next(new errorHandler("Please Provide All Details", 400))
  // }

  // if(new Date(startTime)< Date.now()){
  //     return next(new errorHandler("Auction Starting Time Must Be Greater Than Present Time", 400))
  // }
  // if(new Date(startTime)>=new Date.now(endTime)){
  //     return next(new errorHandler("Auction Starting Time Must Be Greater Than Present Time", 400))
  // }

  // const alreadyOneAuctionActive = await Auction.find({
  //     createdBy : req.User._id,
  //     endTime : {$gt : DAte.now()}
  // });

  // if(alreadyOneAuctionActive){
  //     return next(new errorHandler("You already have an One Active auction "))
  // }

  // try {
  //     const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
  //         folder: "BID_AUCTION_PLATFORM_AUCTION",
  //       });
    
  //       if (!cloudinaryResponse || cloudinaryResponse.error) {
  //         console.log("Cloudinary error:", cloudinaryResponse.error || "Unknown Cloudinary error");
  //         return next(new errorHandler("Failed to upload Auction Image to Cloudinary", 500));
  //       }

  //       const auctionItem = await Auction.create({title,
  //         description,
  //         category,
  //         condition,
  //         starttingBid,
  //         startTime,
  //         endTime,
  //         image : {
  //             public_id : cloudinaryResponse.public_id,
  //             url:cloudinaryResponse.secure_url
  //         },
  //         createdBy :req.User._id
  //     });
  //     return res.status({
  //         success :true,
  //         message : `Auction item Created and will be listed on Auction Page at ${auctionItem}`
  //     })

  // } catch (error) {
  //     return next(error.message || "Failed to created auction .", 500)
  // }
  // });


  import { Auction } from "../models/auctionSchema.js";
  import User from "../models/userSchema.js";
  import { catchAsyncErrors } from "../middlewares/cacheAsyncError.js";
  import { v2 as cloudinary } from "cloudinary";
  import errorHandler from "../middlewares/error.js";
  import { Bid } from "../models/bidSchema.js";
import mongoose from "mongoose";
  export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new errorHandler("Profile Image Required", 400));
    }
  
    console.log(req.files);
    const { image } = req.files;
    console.log("Uploaded File MIME Type:", image.mimetype);
  
    const allowFormat = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  
    if (!allowFormat.includes(image.mimetype)) {
      return res.status(400).json({
        message: "Invalid file format. Only JPEG, PNG, GIF, and WEBP are allowed.",
      });
    }
  
    if (!req.body) {
      return next(new errorHandler("Request body is missing.", 400));
    }
  
    let { title, description, category, condition, startingBid, startTime, endTime } = req.body;
  
    // Normalize condition to be either "new" or "Used"
    condition = condition.trim().toLowerCase() === "used" ? "Used" : condition;
  
    console.log(
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime
    );
  
    if (
      !title ||
      !description ||
      !category ||
      !condition ||
      !startingBid ||
      !startTime ||
      !endTime
    ) {
      return next(new errorHandler("Please Provide All Details", 400));
    }
  
    if (new Date(startTime) < Date.now()) {
      return next(new errorHandler("Auction Starting Time Must Be Greater Than Present Time", 400));
    }
  
    if (new Date(startTime) >= new Date(endTime)) {
      return next(new errorHandler("Auction Starting Time Must Be Greater Than Present Time", 400));
    }
  
    const alreadyOneAuctionActive = await Auction.find({
      createdBy: req.user._id,
      endTime: { $gt: Date.now() },
    });
  
    console.log(alreadyOneAuctionActive);
  
    if (alreadyOneAuctionActive.length > 0) {
      return next(new errorHandler("You already have an Active auction", 400));
    }
  
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "BID_AUCTION_PLATFORM_AUCTION",
      });
  
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("Cloudinary error:", cloudinaryResponse.error || "Unknown Cloudinary error");
        return next(new errorHandler("Failed to upload Auction Image to Cloudinary", 500));
      }
  
      const auctionItem = await Auction.create({
        title,
        description,
        category,
        condition,  // Save the normalized condition
        startingBid,
        startTime,
        endTime,
        image: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
        createdBy: req.user._id,
      });
  
      console.log(auctionItem);
  
      return res.status(200).json({
        success: true,
        message: `Auction item Created and will be listed on Auction Page at ${startTime}`,
        auctionItem,
      });
    } catch (error) {
      return next(new errorHandler(error.message || "Failed to create auction.", 500));
    }
  });
  


  export const getAllItems = catchAsyncErrors(async (req, res, next) => {
    try {
      // Fetch all items from the database
      let items = await Auction.find();
  
      // Send the response with the fetched items
      res.status(200).json({
        success: true,
        items,
      });
    } catch (error) {
      next(error); // Pass any error to the error-handling middleware
    }
  });
  
  export const getMyAuctionItems  = catchAsyncErrors(async (req,res,next)=>{
   
   const items = await Auction.find({createdBy :req.user._id })
   res.status(200).json({
    success: true,
   items,
   
});

console.log(getMyAuctionItems)
  })
  export const getAuctionDetail = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new errorHandler("Invalid Id Format.", 400));
    }
    const auctionItem = await Auction.findById(id);
    if (!auctionItem) {
        return next(new errorHandler("Auction Not Found.", 404));
    }
    const bidders = auctionItem.bids.sort((a, b) => b.bid - a.bid);
    res.status(200).json({
        success: true,
        auctionItem,
        bidders
    });
});

  export const removeFromAuction  = catchAsyncErrors(async (req,res,next)=>{
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new errorHandler("Invalid Id Format.", 400));
    }
    const auctionItem = await Auction.findById(id);
    if (!auctionItem) {
        return next(new errorHandler("Auction Not Found.", 404));
    }
    await auctionItem.deleteOne();
    res.status(200).json({
      success: true,
     message : "Auction Item deleted successFully."
     
  });
  })
  export const republishItem  = catchAsyncErrors(async (req,res,next)=>{
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new errorHandler("Invalid Id Format.", 400));
    }
    let auctionItem = await Auction.findById(id);
    if (!auctionItem) {
        return next(new errorHandler("Auction Not Found.", 404));
    }
    if(!req.body.startTime || !req.body.endTime ){
      return next(new errorHandler("StartTime And Endtime ifor republish is mandatory",400))
    }
    if(new Date(auctionItem.endTime )> Date.now()){
      return next(new errorHandler("Auction is Already active or Not Republish",400))
    }

    let data = {
      startTime : new Date(req.body.startTime),
      endTime : new Date(req.body.endTime)
    }
    if(data.startTime < Date.now()){
      return next(new errorHandler("Auction Startimg Tie MMust Be Greater Than Present Time",400))
    }

    if(data.startTime >= data.endTime){
      return next(new errorHandler("Auction Startimg Tie Must Be Greater Than Less Time",400))
    }

    if(auctionItem.highestBidder){
      const highestBidder = await User.findById(auctionItem.highestBidder);
      highestBidder.moneySpent -= auctionItem.currentBid;
      highestBidder.auctionWon -= -1;
      highestBidder.save();
    }

    data.bids = []
    data.commissionCalculated = false
    data.currentBid = 0;

     data.highestBidder =  null;
    auctionItem = await Auction.findByIdAndUpdate(id,Date,{
      new : true,
      runValidators :true,
      useFindAndModify : false

    })
    
    await Bid.deleteMany({ auctionItem: auctionItem._id });
    const createdBy = await User.findByIdAndUpdate(req.user._id,{unpaidCommission : 0},{
      new : true,
      runValidators : false,
      useFindAndModify : false,
    })
    res.status(200).json({
      success : true,
      auctionItem,
      message:`Auction republished and will be active on ${req.body.startTime}`,
      createdBy
    })
  })
  