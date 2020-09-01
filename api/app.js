const express = require('express');
const axios = require('axios');

const rateLimit = require("express-rate-limit");
const slowDown = require('express-slow-down');

// rate limiting the usage of api
const limiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 10, // max 10 requests, after that user will get '429' error
});

// slowing down the requests if too many
const speedLimiter = slowDown({
    windowMs: 60 * 1000, // 1 minute
    delayAfter: 2, // delay afetr 2 requests
    delayMs: 500, // delay response time by 500ms
});

// check for our own api key
const apiKeys = new Map();
apiKeys.set('12345', true);
const checkAPI = (req, res, next) => {
    const apiKey = req.get('X-API-KEY');
    if (apiKeys.has(apiKey)) 
        next();
    else
        res.json({
            message: 'Invalid API Key'
        });
}

const router = express.Router();

let word = 'matter';
let base_url = 'https://owlbot.info/api/v4/dictionary/';

let cacheData;
let cacheTime;

router.get('/', limiter, speedLimiter, checkAPI, (req, res) => {
    // check cacheing for 30 secs
    if (cacheTime && cacheTime > Date.now() - 30 * 1000)
        return res.json(cacheData);
    axios.get(`${base_url}${word}`, {
        headers: {
            Authorization: 'Token ' + process.env.API_TOKEN
        }
    }).then((result) => {
        cacheData = {
            message: result.data.definitions[0].definition
        }
        cacheTime = Date.now();
        return res.json(cacheData);
    }).catch((err) => console.log(err));
});

module.exports = router;