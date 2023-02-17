const { response } = require('express');
const express = require('express');
const {readFile} = require('fs').promises;


const app = express();

app.get('/', async (req, res) =>{
    res.send( await readFile('../client/index.html', 'utf-8'))    

});

app.listen(3000, () => console.log('App avalable on http://localhost:3000'));
