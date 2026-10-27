// Express app constructor file

// import
import express from 'express';
import cors from 'cors';

// init
const app = express();

// middleware
app.use(express.json());
app.use(cors());

/* ROUTES */

// GET /api/health
app.get('/api/health', (req, res) => {
    res.json({ status: "ok" });
});



export default app;