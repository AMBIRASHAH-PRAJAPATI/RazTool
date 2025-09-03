
import express from 'express';
import { InstagramController } from '../controllers/instagramController';
import { validateContentInfoRequest, validateDownloadRequest } from '../middleware/instagram'
import { contentInfoRateLimit, downloadRateLimit } from '../validator/validate'

const router = express.Router();


// Get Instagram content information
router.post('/content-info',
  contentInfoRateLimit,
  validateContentInfoRequest,
  InstagramController.getContentInfo
);

// Download Instagram media
router.get('/download',
  downloadRateLimit,
  validateDownloadRequest,
  InstagramController.downloadMedia
);

// Error handling middleware
router.use(InstagramController.errorHandler);

export default router;