import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";


 export const verifyJWT = asyncHandler(async function (req,_,next) {

    try {
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token) {
            throw new ApiError(401,"unAuthorized request")
        }
        // TODO : decode  token
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        
         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
         if(!user){
            throw new ApiError(401,"invalid acces token")
         }

         req.user = user
         next()
    } catch (error) {
        throw new ApiError(401 ,error?.message || "invalid acces token")

    }
 }) 