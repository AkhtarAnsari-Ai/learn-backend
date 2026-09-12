import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  if (channelId.toString() === req.user?._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const channel = await User.exists({ _id: channelId });
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const remove = await Subscription.findOneAndDelete({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (remove) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isSubscribed: false, channelId },
          "Unsubscribed successfully"
        )
      );
  }

  try {
    const subscription = await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
    });

    if (!subscription) {
      throw new ApiError(500, "Error while subscribing to channel");
    }
  } catch (error) {
    if (error?.code !== 11000) throw error;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isSubscribed: true, channelId },
        "Subscribed successfully"
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page, limit, skip } = getPagination(req.query);

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const channel = await User.exists({ _id: channelId });
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

   const viewerId = new mongoose.Types.ObjectId(req.user?._id) 
   
});

export { 
    toggleSubscription,
    getUserChannelSubscribers, 
};
