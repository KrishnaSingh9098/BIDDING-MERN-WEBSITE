// This is a higher-order function that wraps an asynchronous function
// to catch any unhandled errors and forward them to the error-handling middleware (next).
export const catchAsyncErrors = (theFunction) => {
    
    // Return a new function that will be used as the route handler
    return (req, res, next) => {
        
        // Wrap the asynchronous function (theFunction) inside a Promise
        // and catch any errors using .catch() method.
        Promise.resolve(theFunction(req, res, next))  // This executes the passed function (theFunction).
            .catch(next);  // If the function throws an error, it will be passed to the next middleware (error handler).
    };
};
