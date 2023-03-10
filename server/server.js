const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const mysql = require('mysql');
const util = require('util');
const path = require("path");

const PORT = 3000

const app = express();
app.use(express.urlencoded({extended: false})); // Handles URL encoded data
app.use(express.json({limit: '1mb'}));
app.use(express.static(path.join(__dirname, '../client'), {index: false}), );
app.use(cors());
app.use(cookieParser());

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "team_project",
    password: "test1234",
    database: "team-project"
});
const query = util.promisify(dbConnection.query).bind(dbConnection);

app.get('/', async (req, res, next) =>{
    const uid = req.cookies.userID;
    console.log(uid);
    if(uid != null){
        const rows = await query("SELECT username FROM users WHERE userID = " + mysql.escape(uid));
        console.log(rows);
        if(rows != null){
            res.sendFile(path.join(__dirname, '../client', 'index.html' ) );
        }else{
            res.sendFile(path.join(__dirname, '../client', 'login.html' ) );
        }
    }else{
        res.sendFile(path.join(__dirname, '../client', 'login.html' ));
    }

});

app.post('/login', (req, res) =>{
    console.log(req.body);
    login(req.body.email, req.body.pass, res).then();
});

app.post('/register', (req, res) =>{
    console.log(req.body);
    addUser(req.body.email, req.body.pass, res);
});

async function login(email, pass, res) {
    // Check username and password are correct
    // TODO: Currently using plaintext passwords. Should be hashed
    console.log(email, pass);
    let auth = false;
    try{
        const rows = await query("SELECT userID, password FROM users WHERE username = " + mysql.escape(email));
        console.log(rows);
        auth = rows[0].password === pass;
        if(auth){
            res.cookie('userID', rows[0].userID);
            res.status(201).send("Authorised");
        }else{
            res.status(401).send('Unauthorised');
        }
    } catch(e) {
        console.log(e);
        res.status(401).send('Auth error');
    }
}

function addUser(email, pass, res) {
    dbConnection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        dbConnection.query(sql, [email, pass], function (err, result) {
            if (err) {
                res.status(500).send('Server error: registration failed');
                throw err;
            }
            res.cookie('userID', result.insertId);
            res.status(201).send("User added");
            console.log(result);
        });
    });
}

app.listen(PORT, () => console.log('App available on http://localhost:'+PORT));
