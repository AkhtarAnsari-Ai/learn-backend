import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  publishedVideo,
  getAllPublishedVideos,
  getVideoById,
  videoDetailsUpdate,
  deleteVideo,
  togglePublishStatus,
  updateThumbnail,
} from "../controllers/video.controller.js";
import { videoOwnership } from "../middlewares/videoOwnership.middleware.js";

const router = Router();

router.route("/publish-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishedVideo
);

router.route("/all-published-videos").get(verifyJWT, getAllPublishedVideos);
router.route("/get-video/:videoId").get(verifyJWT, getVideoById);
router.route("/update-video-details/:videoId").patch(verifyJWT, videoOwnership, videoDetailsUpdate);
router.route("/delete-video/:videoId").delete(verifyJWT, videoOwnership, deleteVideo);
router.route("/update-thumbnail/:videoId").put(verifyJWT, videoOwnership, upload.single("thumbnail"), updateThumbnail);
router.route("/toggle-publish-status/:videoId").patch(verifyJWT, videoOwnership, togglePublishStatus);

export default router;
