import User from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import { catchAsyncErrors } from "./cacheAsyncError.js"
import errorHandler from "./error.js"

// The isAuthenticated middleware that checks the JWT token from cookies
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    // Get the token from cookies
    const token = req.cookies.token;
    console.log("Token received from cookies:", token);

    // If no token is found, return an error
    if (!token) {
        return next(new errorHandler("User not authenticated.", 401));  // 401 is appropriate for authentication errors
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach the decoded user data to the request object
        req.User = await User.findById(decoded.userId); // Use decoded.userId instead of decoded.id as per your previous code

        if (!req.User) {
            return next(new errorHandler("User not found.", 401));
        }

        // Call next() to pass the request to the next middleware or route handler
        next();
    } catch (err) {
        console.error("Error verifying token:", err);
        return next(new errorHandler("User not authenticated.", 401));
    }
});
