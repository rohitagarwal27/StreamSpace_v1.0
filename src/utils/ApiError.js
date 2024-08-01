class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") 
    {
        super(); // Calls the constructor of the Error class with the provided message

        // Initialize properties specific to ApiError
        this.statusCode = statusCode; // HTTP status code associated with the error
        this.data = null; // Additional data associated with the error (initially set to null)
        this.success = false; // Indicates whether the operation was successful (initially set to false)
        this.errors = errors; // List of errors associated with the operation (which is not correctly set)
        this.message = message;
        // If a custom stack trace is provided, set it; otherwise, capture the stack trace using Error.captureStackTrace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};


// try {
//     // Simulating an error scenario
//     throw new ApiError(500, "Internal Server Error", [], "Custom stack trace", {
//         userId: "12345",
//         operation: "Login",
//         timestamp: new Date()
//     });
// } catch (err) {
//     console.error(err.message); // Output: "Internal Server Error"
//     console.error(err.statusCode); // Output: 500
//     console.error(err.errors); // Output: []
//     console.error(err.data); // Output: { userId: "12345", operation: "Login", timestamp: Wed Jul 04 2024 15:42:45 GMT-0700 (Pacific Daylight Time) }
//     console.error(err.stack); // Output: "Custom stack trace"
// }


// Error.captureStackTrace(this, this.constructor):

// This method is a Node.js feature that captures the current stack trace into the stack property of the error object (this refers to the current instance of ApiError).
// Error.captureStackTrace is used to customize or capture the stack trace for an error instance, particularly useful when you want to provide a meaningful trace of where the error originated within your code.