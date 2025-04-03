// import { User } from "../models/userSchema.js";
import User from "../models/userSchema.js"; // Use default import now

import errorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";

export const register = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("Profile Image Required", 400));
  }

  const { profileImage } = req.files;
  const allowFormat = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (!allowFormat.includes(profileImage.mimetype)) {
    return res.status(400).json({
      message: "Invalid file format. Only JPEG, PNG, GIF, and WEBP are allowed.",
    });
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    rajorPayAccountNumber,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new errorHandler("Please fill all the fields. All fields are required.", 400));
  }

  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(new errorHandler("Please provide your full bank details", 400));
    }
    if (!rajorPayAccountNumber) {
      return next(new errorHandler("Please provide your RazorPay account details", 400));
    }
    if (!paypalEmail) {
      return next(new errorHandler("Please provide your PayPal Email", 400));
    }
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new errorHandler("User already registered", 400));
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
      folder: "BID_AUCTION_PLATFORM_USER",
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log("Cloudinary error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return next(new errorHandler("Failed to upload Profile Image to Cloudinary", 500));
    }

    const newUser = new User({
      userName,
      email,
      password,
      phone,
      address,
      role,
      profileImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      paymentMethods: {
        bankTransfer: {
          bankAccountNumber,
          bankAccountName,
          bankName,
        },
        RazorPay: {
          rajorPayAccountNumber,
        },
        payPal: {
          paypalEmail,
        },
      },
    });

    try {
      const savedUser = await newUser.save();
      return res.status(201).json({
        success: true,
        message: "User registered successfully!",
        user: {
          userName: savedUser.userName,
          email: savedUser.email,
          profileImageUrl: savedUser.profileImage.url,
        },
      });
    } catch (saveError) {
      console.error("Error saving user to database:", saveError);
      return next(new errorHandler("Error saving user to database. Try again later.", 500));
    }
  } catch (error) {
    return next(new errorHandler("Cloudinary upload failed or database error. Try again later.", 500));
  }
};
