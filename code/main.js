import express from 'express';

const PORT = 3000;

const app = express();

// Middleware for static directory.
app.use(express.static("static"));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
