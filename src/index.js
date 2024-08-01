// require('dotenv').config({path:'./env'})// proper statement but visible too odd
// or 
import dotenv from "dotenv"
dotenv.config({
    path: './.env' // recently introduced in package .json add this  "dev": "nodemon -r dotenv/config--experimental-json-modules src/index.js"(old)----->node -r dotenv/config src/index.js(new)
})
import connectDB from "./db/index.js";// if error .db/index.js sometimes extesnions .js also needed



import {app} from './app.js'
connectDB() //aysnc function hai toh promise return karega hi
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
    })
    // Define a custom error event listener
    app.on("error",(error)=>{
     console.log("ERROR",error)
      throw error;
    })
})
.catch((err)=>console.log("MONGO DB CONNECTION PROBLEM",err)) 


// import mongoose from "mongoose";
// import express from "express"
 // const app = express();
// function connectDB(){
// } another better option
//;IFFE-- semicolon for clean code
// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}}`)
//         app.on("error",(error)=>{
//             console.log("ERROR",error)
//             throw error
//         })
//         app.listen(process.env.MONGODB_URI,()=>{
//             console.log(`port is running on ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("ERROR",error);
//         throw error;
//     }
// })()