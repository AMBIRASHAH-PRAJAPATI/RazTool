import rateLimit from 'express-rate-limit';

// Rate limiting middleware
const createRateLimit = (windowMs: number, max: number, message: string) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            error: message
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Rate limit for content info requests (more lenient)
export const contentInfoRateLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    30, // max 30 requests per 15 minutes
    'Too many content info requests. Please try again later.'
);

// Rate limit for download requests (stricter)
export const downloadRateLimit = createRateLimit(
    10 * 60 * 1000, // 10 minutes
    20, // max 20 downloads per 10 minutes
    'Too many download requests. Please try again later.'
);