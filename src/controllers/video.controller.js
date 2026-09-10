import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { isValidObjectId } from "mongoose";

const publishedVideo = asyncHandler(async (req, res) => {
  // TODO : get video from body
  // TODO : check video is present or not
  // TODO : upload video on cloudinary
  // TODO : extract video url from cloudinary response
  // TODO : save video url details in database
  // TODO : send response to user with video url

  const { title, description } = req.body;
  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "title and description fields are required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail files are required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile.url || !thumbnail.url) {
    throw new ApiError(
      500,
      "Failed to upload video or thumbnail to cloudinary"
    );
  }

  const video = await Video.create({
    title,
    description,
    views: 0,
    isPublished: true,
    owner: req.user?._id,
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    duration: videoFile?.duration || 0,
    videoFilePublicId: videoFile?.public_id,
    thumbnailPublicId: videoFile?.public_id,
  });

  if (!video) {
    throw new ApiError(500, "Failed to save video details in database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getAllPublishedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const videoDetailsUpdate = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "title and description are required");
  }

  const videoUpdated = await Video.findByIdAndUpdate(
    req.video?._id,
    {
      $set: {
        title,
        description,
      },
    },
    { new: true }
  );

  if (!videoUpdated) {
    throw new ApiError(500, "Error while updating video details");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoUpdated, "Video details updated successfully")
    );
});

const updateThumbnail = asyncHandler(async (req, res) => {

  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail?.url) {
    throw new ApiError(500, "Failed to upload thumbnail to cloudinary");
  }

  const updatedThumbnail = await Video.findByIdAndUpdate(
    req.video?._id,
    {
      $set: {
        thumbnail: thumbnail?.url,
      },
    },
    { new: true }
  );

  if (!updatedThumbnail) {
    throw new ApiError(500, "Something went wrong while updating thumbnail");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedThumbnail, "Thumbnail updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {

  const deletedVideo = await Video.findByIdAndDelete(req.video?._id);
  if (!deletedVideo) {
    throw new ApiError(500, "Error while deleting video");
  }

  const deleteVideoFromCloudinary = await deleteFromCloudinary(
    req.video?.videoFilePublicId,
    "video"
  );
  const deleteThumbnailFromCloudinary = await deleteFromCloudinary(
    req.video?.thumbnailPublicId,
    "image"
  );

  if (!deleteVideoFromCloudinary || !deleteThumbnailFromCloudinary) {
    throw new ApiError(
      500,
      "Video deleted from database but failed to delete files from cloudinary"
    );
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,deletedVideo, "Video and thumbnail  deleted successfully"
    )
  );
});

const togglePublishStatus = asyncHandler(async (req, res) => {

  req.video.isPublished = !req.video.isPublished;
  const videoUpdated = await req.video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoUpdated, "Publish status toggled successfully")
    );
});

export {
  publishedVideo,
  getAllPublishedVideos,
  getVideoById,
  videoDetailsUpdate,
  deleteVideo,
  togglePublishStatus,
  updateThumbnail,
};
