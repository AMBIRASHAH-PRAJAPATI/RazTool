
import express from 'express';
import { InstagramController } from '../controllers/instagramController';
import { validateContentInfoRequest, validateDownloadRequest } from '../middleware/instagram'
import { contentInfoRateLimit, downloadRateLimit } from '../validator/validate'

const router = express.Router();


// Get Instagram content information
router.post('/content-info',
  InstagramController.getContentInfo
);

// Download Instagram media
router.get('/download',
  InstagramController.downloadMedia
);

export default router;