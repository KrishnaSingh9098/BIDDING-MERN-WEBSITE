

// import jwt from "jsonwebtoken";

// export const generateToken = (user, profileImageUrl, message, statusCode, res) => {
//   // If you're generating a token for the user, you only need user data (not the entire model)
//   const payload = {
//     userId: user._id, // Use user._id, and other user-specific fields
//     userName: user.userName,
//     email: user.email,
//     profileImageUrl: profileImageUrl, // Profile image URL
//   };

//   // Debugging: Log the payload to check the values before signing the token
//   console.log("Payload to be used for token generation:", payload);

//   try {
//     // You can generate a JWT token here
//     const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

//     // Debugging: Log the generated token to verify its creation
//     console.log("Generated JWT token:", token);

//     res.status(statusCode).json({
//       success: true,
//       message: message,
//       token: token,
//       user: payload,
//     });
//   } catch (error) {
//     // If there's an error during token generation, catch it and log it
//     console.error("Error generating JWT token:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to generate token. Please try again later.",
//     });
//   }
// };

import jwt from "jsonwebtoken";

// The function to generate the token and set it as an HTTP-only cookie
export const generateToken = (user, profileImageUrl, message, statusCode, res) => {
  // Create the payload with the user data
  const payload = {
    userId: user._id, // Use user._id, and other user-specific fields
    userName: user.userName,
    email: user.email,
    profileImageUrl: profileImageUrl, // Profile image URL
  };

  // Debugging: Log the payload to check the values before signing the token
  console.log("Payload to be used for token generation:", payload);

  try {
    // Generate a JWT token using the payload
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Debugging: Log the generated token to verify its creation
    console.log("Generated JWT token:", token);

    // Set the token in an HTTP-only cookie and respond with a JSON message
    res.status(statusCode).cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Set cookie expiration
      httpOnly: true,  // Ensure the cookie is not accessible via JavaScript
      sameSite: "None", // Allow cross-domain cookie sharing (if using cross-origin requests)
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
    }).json({
      success: true,
      message: message,
      token: token,
      user: payload,
    });
  } catch (error) {
    // If there's an error during token generation, catch it and log it
    console.error("Error generating JWT token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate token. Please try again later.",
    });
  }
};
