import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

/* Configurations */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

/* Middleware */
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
const allowedOrigins = ['http://localhost:3000']; // Add allowed frontend origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  })
);

app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')));

/* File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

/* Test Route */
app.get('/', (req, res) => {
  res.send('API is running...');
});

/* File Upload Test Route */
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).send({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).send({ error: 'File upload failed' });
  }
});

/* MongoDB Connection */
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
})();