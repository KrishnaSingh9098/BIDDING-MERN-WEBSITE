// Custom Error class for handling errors
class errorHandler extends Error {
    constructor(message, statusCode) {
      super(message); // Parent Error class ko call karke message pass kiya
      this.statusCode = statusCode; // Status code bhi set kar rahe hain error object ke saath
    }
  }
  
  // Middleware function to handle errors in the application
  export const errorMiddleWare = (err, req, res, next) => {
    // Agar error ka message nahi hai to default "Internal Server Error" set karo
    err.message = err.message || "Internal Server Error .";
    err.statusCode = err.statusCode || 500; // Agar statusCode nahi diya to default 500 set karo (Server Error)
    
    console.log(err); // Error ko console par print kar rahe hain debugging ke liye
  
    // Agar error ka type jsonWebTokenError hai (invalid JWT token)
    if (err.name === "jsonWebTokenError") {
      const message = "Json web token is invalid, Try Again"; // Custom message define kiya
      err = new errorHandler(message, 400); // New error object create kiya with 400 status code
    }
  
    // Agar error ka type TokenExpiredError hai (token expired ho gaya)
    if (err.name === "TokenExpiredError") {
      const message = "Json web token is expired, Try Again"; // Expired token ka custom message
      err = new errorHandler(message, 400); // Error object ko update karte hain with 400 status
    }
  
    // Agar error ka type CastError hai (type casting error, jaise invalid ObjectId)
    if (err.name === "CastError") {
      const message = `Invalid ${err.path}`; // Error path ko specify kar rahe hain jaise invalid ObjectId
      err = new errorHandler(message, 400); // Error ko update kar rahe hain with 400 status
    }
  
    // Agar error me specific validation errors hain to unko join kar rahe hain
    const errorMEssage = err.errors
      ? Object.values(err.errors) // Error object ke andar jo errors hain unko array me convert kar rahe hain
          .map((error) => error.message) // Har error ka message nikaal rahe hain
          .join(" ") // Sab errors ko ek saath join kar rahe hain ek string me
      : err.message; // Agar koi specific errors nahi hain to simple error message hi use kar rahe hain
  
  return   res.status(err.statusCode).json({ success : false, message: errorMEssage }); // Final response bhej rahe hain client ko with error message aur status code
  };


  export default errorHandler;
  