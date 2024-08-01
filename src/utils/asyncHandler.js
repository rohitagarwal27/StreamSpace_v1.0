// asyncHandler.js

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};

export default asyncHandler;

 
// const asyncHandler =(fn)=> async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:true,
//             message:error.message
//         })
//     }
// }






//---------------------- AI -------------------------------
// const express = require('express');
// const app = express();

// // Define asyncHandler
// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch(next);
//     };
// };

// // Example of an asynchronous route handler
// const getData = async (req, res) => {
//     // Simulate an asynchronous operation that may throw an error
//     const data = await someAsyncOperation();
//     res.json(data);
// };

// // Use asyncHandler to wrap the asynchronous route handler
// app.get('/data', asyncHandler(getData));

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred' });
// });

// // Simulated async operation
// const someAsyncOperation = async () => {
//     // Simulate an async operation, such as a database query
//     return { message: 'Async data' };
// };

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
