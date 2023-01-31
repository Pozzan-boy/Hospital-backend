import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3001, (err) => {
    if (err) {
        return console.log(err);        
    }

    console.log('Server started...');
});