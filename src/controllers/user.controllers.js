import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

// access and refresh token
const genrateAccessTokenAndRefreshToken = async(userId )=>
  {
  try {
       const user = await User.findById(userId)
       const accessToken = user.genrateAccessToken();
       const refreshToken = user.genrateRefreshToken();
     
       user.refreshToken = refreshToken
       // yahapar par toh save karne time password filed hamara required tha but ham wo toh nahi de rahe toh use {validateBeforeSave:false}
       await user.save({validateBeforeSave:false});
        
       return {accessToken,refreshToken}
     } 
  catch (error) {
    throw new ApiError(500,"SOMETHING WENT WRONG WHILE GENERATING USER TOKEN");
  }
 }

// signup
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { fullname, email, username, passWord } = req.body // from postman body, raw, json format post request

  // validation --> user details are there or not 
  if ([fullname, email, username, passWord].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields Are Required");
  }

  // check if user already exists: username, email
  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    throw new ApiError(400, "User Already Exist");
  }

  // check for images, check for avatar  // multer
  //const avatarLocalPath = req.files?.avatar[0]?.path;
   let  avatarLocalPath;
  if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0){
    avatarLocalPath = req.files.avatar[0].path;
  }
  //const coverImageLocalPath = req.files?.coverImage?[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath =req.files.coverImage[0].path
  }


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File Required");
  }

  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;
  


  if (!avatar) {
    throw new ApiError(400, "Avatar File Upload Failed");
  }

  // create user object -- create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    passWord,
    username: username.toLowerCase()
  });

  // check for user creation
  const createdUser = await User.findById(user._id).select("-passWord -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong While Registering");
  }

  // return response
  return res.status(201).json(new ApiResponse(200, createdUser, "User Register Success"));
});
//login
const loginUser = asyncHandler(async(req,res)=>{
   // req body se data
   const {username, email,passWord}= req.body;
   // username or email
   if(!username && !email){
    throw new ApiError(400,"username or email is required")
   }
   // find the user
  const user= await  User.findOne({$or:[{email},{username}]})
  if(!user){
    throw new ApiError(400,"User does not exist required")
   }
   //password check
   const isPasswordValid =await user.isPasswordCorrect(passWord);// password from req.body
   if(!isPasswordValid){
    throw new ApiError(401,"Invalid User Credentials")
   }
   const {accessToken , refreshToken}=await genrateAccessTokenAndRefreshToken(user._id)
   const loggedInUser = await User.findById(user._id).select("-passWord -refreshToken")
   // send cookie
   const options ={
        httpOnly:true, // cokkies only editable by server
        secure :true
   }
   return res.status(200)
   .cookie("accessToken" ,accessToken, options)// sending cokkie key value pair
   .cookie("refreshToken" ,refreshToken, options)
   .json(
    new ApiResponse(
     200, {
      user:loggedInUser,accessToken,refreshToken
     },"User Login In SuccessFul"
    )
   )


});

// logout
const logoutUser = asyncHandler(async(req,res)=>{
  User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true})
  const options ={
    httpOnly:true, // cokkies only editable by server
    secure :true
}
 return res.status(200)
 .clearCookie("accessToken",options)// sending cokkie key value pair
 .clearCookie("refreshToken" , options)
 .json(new ApiResponse(200,{},"User Logged Out"))
})
// refresh token // Define the function to refresh access token
const refreshAccessToken =asyncHandler(async(req,res)=>{
  
  // Retrieve the refresh token from cookies or the request body
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!incomingRefreshToken) {
     throw new ApiError(401,"Unauthorized error")
  }

  try {
    // decodedtoken will strore --> payload data
    const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
     const user = await User.findById(decodedToken?._id)
     if (!user) {
      throw new ApiError(401,"Invalid Access Token ")
   }
  
   if(incomingRefreshToken!==user?.refreshAccessToken){
    throw new ApiError(401,"Refresh Token   Expired or Used")
   }
  const  options  = {
    httpOnly:true,
    secure:true
  }
   const {accessToken , NEWrefreshToken}=await  genrateAccessTokenAndRefreshToken(user._id)
  
   return  res.status(200)
   .cookie("accessToken" ,accessToken , options )
   .cookie("redreshToken" , NEWrefreshToken, options)
   .json(
    new ApiResponse(
      200,{accessToken , refreshToken:NEWrefreshToken},"Acess Token Refreshed Sucessfully"
    )
   )
  } catch (error) {
       throw new ApiError(401, error?.message || "Invalid Refresh TAoken")
  }
})

// password change
const changeCurrentPassword = asyncHandler(async (req, res)=>{
  const {oldPassword , newPassword} = req.body
  const user =  User.findById(req.user?._id) // from auth middleware as middleware --> req.user?._id
  
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid Old Password");
  }

  user.passWord = newPassword

  // now pre hook in user.models will be called pre("save")
  await user.save({validateBeforeSave:false})

  return res.status(200).json(new ApiResponse(200,{},"password changed sucessfully"))


})


// Current User
const getCurrentUser = asyncHandler(async(req,res)=>{
  return res.status(200).json(new ApiResponse(200,req.user,"Current User Fetched Sucessfully"))
})


// updateAccountDetails
const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullname , email} = req.body
 
  if(!fullname || !email ){
    throw new ApiError(404,"All Fields Are Required")

  }

  User.findByIdAndUpdate(req.user?._id, {$set :{fullname:fullname , email:email}}, {new:true}).select("-passWord") // password field is removed as we have deicated field to update

  return res.status(200).json(new ApiResponse(200,req.user,"Account Details Updated Sucessfully"))

})

// update avatar
const updateUserAvatar = asyncHandler(async(req,res)=>{
     // from multer
     const avatarlocalPath = req.file?.path;
     if(!avatarlocalPath){
      throw new ApiError(404,"Avatar File Missing")
     }
     const avatar = await uploadOnCloudinary(avatarlocalPath)

     if(!avatar.url){
      throw new ApiError(404,"Error While Uploading On Avatar")
     }

     const user =await User.findByIdAndUpdate(req.user?._id,{$set :{avatar:avatar.url }},{new:true}).select("-password")
     return res.res.status(200).json(new ApiResponse(200,user,"CoverImage Updated"))
     
})

// update coverImage
const updateCoverImage = asyncHandler(async(req,res)=>{
  // from multer
  const coverlocalPath = req.file?.path;
  if(!coverlocalPath){
   throw new ApiError(404,"cover File Missing")
  }
  const coverImage = await uploadOnCloudinary(coverlocalPath)

  if(!coverImage.url){
   throw new ApiError(404,"Error While Uploading On Cover")
  }

  const user = await User.findByIdAndUpdate(req.user?._id,{$set :{coverImage:coverImage.url }},{new:true}).select("-password")

  return res.status(200).json(new ApiResponse(200,user,"CoverImage Updated"))
})
 
export { registerUser , loginUser,logoutUser,refreshAccessToken,getCurrentUser, updateAccountDetails,updateUserAvatar,updateCoverImage};




// {
//   "statusCode": 200,
//   "data": {
//     "_id": "66943d221c1c88bff36ba679",
//     "username": "xyz",
//     "email": "a@gmail.com",
//     "fullname": "hhashsa",
//     "avatar": "http://res.cloudinary.com/dka4fo034/image/upload/v1720991013/f9ypphznzn2qrdtpcgkk.png",
//     "coverImage": "http://res.cloudinary.com/dka4fo034/image/upload/v1720991014/k6v0jbqqahgrjcuqjbl4.png",
//     "watchHistory": [],
//     "createdAt": "2024-07-14T21:03:30.342Z",
//     "updatedAt": "2024-07-14T21:03:30.342Z",
//     "__v": 0
//   },
//   "message": "User Register Success",
//   "sucess": true
// }
