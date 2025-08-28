import express from 'express';
import cors from 'cors';
import ytdl from '@nuclearplayer/ytdl-core';
import dotenv from 'dotenv';
import youtubeRouter from "./routes/youtubeRouter"
import instagramRouter from "./routes/instagramRouter"

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = (process.env.ALLOWED_ORIGIN || '').split(',').map(x => x.trim());

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true); // Allow non-browser clients like Postman
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   }
// }));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/youtube", youtubeRouter);
app.use("/api/instagram", instagramRouter);
// Base route
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to RazTube",
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});