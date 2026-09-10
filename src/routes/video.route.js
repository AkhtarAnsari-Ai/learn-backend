import { Router } from "express"
import { upload }  from "../middlewares/multer.middleware"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { publishedVideo } from "../controllers/video.controller.js";


const router = Router()

router.route("/publish-video").post(verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    publishedVideo
)

