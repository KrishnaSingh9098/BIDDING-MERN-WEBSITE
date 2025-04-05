import  User  from "../models/userSchema.js";
// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { catchAsyncErrors } from "./cacheAsyncError.js";
import errorHandler from "../middlewares/error.js";

export const trackCommissionStatus = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user.unpaidCommission > 0) {
      return next(
        new errorHandler(
          "You have unpaid commissions. Please pay them before posting a new auction.",
          403
        )
      );
    }
    next();
  }
);