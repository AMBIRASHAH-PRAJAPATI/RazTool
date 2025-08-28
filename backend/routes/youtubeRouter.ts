import express from "express";
import youtubeController from "../controllers/youtubeController";

const router = express.Router();

// Parse JSON request bodies
router.use(express.json());

router.post("/video-info", youtubeController.getVideoInfo);
router.get("/download", youtubeController.downloadVideo);

export default router;