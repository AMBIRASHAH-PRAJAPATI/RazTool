
import express from 'express';
import { InstagramController } from '../controllers/instagramController';
import { contentInfoRateLimit, downloadRateLimit } from '../validator/validate'

const router = express.Router();

// Get Instagram content information
router.post('/content-info',
  contentInfoRateLimit,
  InstagramController.getContentInfo
);

// Download Instagram media
router.get('/download',
  downloadRateLimit,
  InstagramController.downloadMedia
);

export default router;