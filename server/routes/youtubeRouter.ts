import express from "express";
import { YoutubeController } from "../controllers/youtubeController";
import { contentInfoRateLimit, downloadRateLimit } from '../validator/validate'

const router = express.Router();

// Parse JSON request bodies
router.use(express.json());

router.post("/video-info", contentInfoRateLimit, YoutubeController.getVideoInfo);
router.get("/download", downloadRateLimit, YoutubeController.downloadVideo);

export default router;