const express = require('express');
require('dotenv').config();
var api = require('./api/app')

const app = express();
app.set('trust proxy', 1);
app.use('/api/', api);

app.get('/', (req, res) => {
    res.json({
        message: 'Securing usage of our APIs - OwlBot free dictionary api'
    });
});

const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Listening: http://localhost:${port}`));
