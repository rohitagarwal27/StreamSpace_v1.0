
// we can give custom name v2 as cloudinary
import { v2 as cloudinary } from 'cloudinary';
// fs --> file system node js ke sath by deafult milta hai u can do now read, write, remove, know path ,delete --> unlink(path)etc 
import fs from "fs"

 
    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET  
    });

    

    const uploadOnCloudinary = async(localFilePath)=>{
        try {
            if(!localFilePath) return null;
            // upload cloudinary
         const response = await cloudinary.uploader.upload(localFilePath,{ resource_type:'auto'})
            // file uploaded sucessfully
            console.log("File is uploaded on cloudinary");
            // uload hone ke bbad url mil jayega
            //console.log(response.url);
            fs.unlinkSync(localFilePath)
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath)
            // remove the loacally saved temporary file as the upload operation got failed
            return null;
        }
    }

     
    export   {uploadOnCloudinary};

    // now create middle ware in middleware