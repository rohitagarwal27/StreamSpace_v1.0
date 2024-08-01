import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"; 
const app = express();

// Allow all origins
// app.use(cors());

// Allow specific origins
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credential:true
}))
app.use(express.json({limit:"16kb"}))// now currently u can use it directly but old days we use body parser
app.use(express.urlencoded({extended:true,limit:"16kb"}))// url jab search karte hai toh udaar ?=google+search hota hai toh +?= hata ne ke lliye we use encoded aur extended isliye kabhi object ke andar objects hoyenge toh bass
app.use(express.static("public")) // public assets(style.css,html) can be acess // // Serve static files from the "public" directory

// Use cookie-parser middleware
app.use(cookieParser())

// routes
import  userRouter from "./routes/user.routers.js"

// routes declaration // abb router ko alag jaggah le gaye hai
app.use("/api/v1/users", userRouter)
// hhtp://localhost:8000/api/v1/users/register


export {app};