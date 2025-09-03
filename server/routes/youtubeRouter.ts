import express from "express";
import { YoutubeController } from "../controllers/youtubeController";

const router = express.Router();

// Parse JSON request bodies
router.use(express.json());

router.post("/video-info", YoutubeController.getVideoInfo);
router.get("/download", YoutubeController.downloadVideo);

export default router;