import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // TODO : file upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("respne : ",response)

    // console.log("file is upload on cloudiry ", response);
    // console.log("file is upload on cloudiry URL : ", response.url);
    // TODO : remove file from local uploads folder after uploading on cloudinary
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    // TODO : remove file from local storage if uload failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

 const deleteFromCloudinary = async (publicId , resourceType = "image") => {
  try {
    if(!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId,{
      resource_type: resourceType,
    })
    return response;

  } catch (error) {
    console.error("Error while deleting file from cloudinary : ", error);
    return null
  }
 }

export { uploadOnCloudinary, deleteFromCloudinary };
