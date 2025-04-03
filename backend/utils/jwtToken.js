
// Function to generate a JSON Web Token and send it in a response with a cookie
// export const generateToken = (req, message, statusCode, res) => {
//     // Generate the JWT token using the User model's static method
//     const token = User.generateJsonWebToken();

//     // Set the token in an HTTP-only cookie and respond with a JSON message
//     res.status(statusCode).cookie("token", token, {
//         expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Set cookie expiration
//         httpOnly: true // Ensure the cookie is not accessible via JavaScript
//     }).json({
//         success: true,
//         message: message,
//         user: req.User, // Assuming you want to send the user object in the response
//         token: token // Include the generated token in the response
//     });
// };


import jwt from "jsonwebtoken";

export const generateToken = (user, profileImageUrl, message, statusCode, res) => {
  // If you're generating a token for the user, you only need user data (not the entire model)
  const payload = {
    userId: user._id, // Use user._id, and other user-specific fields
    userName: user.userName,
    email: user.email,
    profileImageUrl: profileImageUrl, // Profile image URL
  };

  // You can generate a JWT token here
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

  res.status(statusCode).json({
    success: true,
    message: message,
    token: token,
    user: payload,
  });
};
