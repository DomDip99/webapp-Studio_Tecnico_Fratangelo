// import
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// init
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(cors());

/* ROUTES */

// GET /api/health
app.get('/api/health', (req, res) => {
    res.json({ status: "ok" });
});

// server listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
