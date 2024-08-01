// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({})
//  | OR |
 
import mongoose ,{Schema,model} from "mongoose";
 import jwt from "jsonwebtoken";
 import bcrypt from "bcrypt";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,// cloudinary url we will use
        required:true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    passWord:{
        type:String,
        required:[true,'Paasword Required']
    },
    refreshToken:{
        type:String,
    }

},{timestamps:true});
//pre hook
// userSchema.pre("save",callbackfn)// dont use arrow function inside callback
userSchema.pre("save",async function(next){ // pre("save", ...): This sets up a pre-save hook. A pre-save hook is a middleware function that runs before a document is saved to the database.
    if(!this.isModified("passWord")) return next();
    this.passWord= await bcrypt.hash(this.passWord, 10);  //The 10 is the number of salt rounds, which influences the complexity and security of the hash.
    next()
})

userSchema.methods.isPasswordCorrect = async function(passWord){
    return await bcrypt.compare(passWord,this.passWord)
}
userSchema.methods.genrateAccessToken = function(){
  return  jwt.sign(
        { // data --> payload
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
       },// accsess token
       process.env.ACCESS_TOKEN_SECRET,
       {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
       }
)
}
userSchema.methods.genrateRefreshToken = function(){
    return  jwt.sign(
        { // data --> payload
        _id:this._id,
         
       },// accsess token
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
)
}

export const User = model("User",userSchema);
