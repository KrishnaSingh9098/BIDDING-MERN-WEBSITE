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
  
