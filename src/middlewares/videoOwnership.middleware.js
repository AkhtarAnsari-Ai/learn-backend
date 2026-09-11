import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const videoOwnership = asyncHandler(async (req, _, next) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(
        403,
        "You are not authorized to change publish status of this video"
      );
    }
    req.video = video;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "videoOwnership Error");
  }
});
