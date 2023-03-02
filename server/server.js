const express = require('express');
const cors = require('cors');
const PORT = 3000
let users = [
    {"name":"thomas@email.com", "pass":"secretPassword", "data":"THISISDATA"},
    {"name":"test@email.com", "pass":"testPass", "data":"THISISDATA"}
]

const app = express();
app.use(express.urlencoded({extended: false}));//Handles URL encoded data
app.use(express.json({limit: '1mb'}));
app.use(cors());    


app.post('/', (req, res) =>{
    console.log(req.body);
    if(checkHash(req.body.name, req.body.pass)){
        res.status(201).json({test:"Testing"});
    }else{
        res.status(401).send('Unauthorised')
    }
    
});

function checkHash(user, pass){
    // Check username and password are correct
    console.log(user, pass);
    return true;
}

app.listen(PORT, () => console.log('App available on http://localhost:'+PORT));
