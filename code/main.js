import express from 'express';

const PORT = 3000;

const app = express();

app.use('/static', express.static('static')) //path should look like http://localhost:3000/static/css/style.css
app.get('/', (req, res) => {
    res.redirect('/static/index.html') //send to home page as default 
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
