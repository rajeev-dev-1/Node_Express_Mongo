const express = require('express');
const router = express.Router();
const path = require('path');


router.get('^/$|index(.html)?', (req, res)=>{
    //res.send('Hello World!');
    //Following to avoid 304 in status code
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': false, 
        'Last-Modified': new Date().toUTCString()
    });
    res.sendFile(path.join(__dirname, '..','views', 'index.html'));
})

router.get('/hello', (req, res)=>{
    //res.status(404).send('Hello World!');
    res.send('Hello World!');
    
})


router.get('/new-page(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, '..','views', 'new-page.html'));
})

router.get('/old-page(.html)?', (req, res)=>{
    res.status(301).redirect('/new-page.html');
})

module.exports = router;