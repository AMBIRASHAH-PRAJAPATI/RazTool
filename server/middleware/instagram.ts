import express from 'express';

// Validation middleware for content-info
export const validateContentInfoRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'URL is required and must be a string'
        });
    }

    // Basic URL validation
    try {
        new URL(url);
    } catch {
        return res.status(400).json({
            success: false,
            error: 'Invalid URL format'
        });
    }

    next();
};

// Validation middleware for download
export const validateDownloadRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { mediaUrl } = req.query;

    if (!mediaUrl || typeof mediaUrl !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Media URL is required'
        });
    }

    next();
};

