// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({})
//  | OR |
 
import mongoose ,{Schema,model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const videoSchema = new Schema({
    videoFile:{
        type:String, // cloudinary url
        required:true,
    },
    thumbnail:{
        type:String, // cloudinary url
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String, 
        required:true,
    },
    duration:{
        type:Number, // cloudinary url aws
        required:true
    },
    viwes:{
        type:Number,  
        default:0,
        min:0,
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true});
 
//export karne se phele u have to use mongooseAggregatePaginate
videoSchema.plugin(mongooseAggregatePaginate) // helps us for advance level work

export const Video = model("Video",videoSchema);
// ------------------------name----basedon----