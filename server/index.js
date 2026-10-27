// Express app starter file

// import
import 'dotenv/config';
import app from './app.js'

const PORT = process.env.PORT || 3001;

// server listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
