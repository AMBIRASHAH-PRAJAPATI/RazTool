import express from "express";
import youtubeContrller from "../controllers/youtubeController";

const router = express.Router();

// Parse JSON request bodies
router.use(express.json());

router.get("/video-info", youtubeContrller.getVideoInfo);

export default router;