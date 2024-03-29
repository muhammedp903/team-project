const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require("path");

const PORT = 3000;

const app = express();
app.use(express.urlencoded({extended: false})); // Handles URL encoded data
app.use(express.json({limit: '1mb'}));
app.use(express.static(path.join(__dirname, '../client'), {index: false}), );
app.use(cors());
app.use(cookieParser());

let db = new sqlite3.Database('./database.db');

app.get('/', async (req, res) =>{
    const uid = req.cookies.userID;
    console.log(uid);
    if(uid != null){
        let sql = "SELECT username FROM users WHERE userID = ?";

        db.get(sql, [uid], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            return row
                ? res.sendFile(path.join(__dirname, '../client', 'index.html' ) )
                : res.sendFile(path.join(__dirname, '../client', 'login.html' ) );

        });
    }else{
        res.sendFile(path.join(__dirname, '../client', 'login.html' ));
    }
});

app.get('/tasks', (req, res) => {
    const uid = req.cookies.userID;

    let sql = `SELECT taskID, content, dueDate FROM tasks WHERE userID = ?`;

    db.all(sql, [uid], (err, rows) => {
        if (err) {
            throw err;
        }
        res.status(200).send(rows);
    });
});

app.post('/addTask', (req, res) =>{
    console.log("body: "+ req.body.content);
    addTask(req.cookies.userID, req.body.content, res);
});

app.delete('/removeTask', (req, res) =>{
    console.log(req.body);
    removeTask(req.cookies.userID, req.body.taskID, res);
});

app.post('/login', (req, res) =>{
    console.log(req.body);
    login(req.body.email, req.body.pass, res).then();
});

app.post('/register', (req, res) =>{
    console.log(req.body);
    addUser(req.body.name, req.body.email, req.body.pass, res);
});

app.get('/logout', (req, res) =>{
    console.log(req.body);
    res.clearCookie('userID');
    res.status(200).send();
});

async function login(email, pass, res) {
    // Check username and password are correct

    // TODO: Currently using plaintext passwords. Should be hashed
    console.log(email, pass);

    let sql = "SELECT userID, password FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
        if (err) {
            res.status(401).send('Auth error');
            return console.error(err.message);
        }
        console.log(row);
        if(typeof row === "undefined"){
            res.status(401).send("User doesn't exist");
        } else if(row.password === pass){
            res.cookie('userID', row.userID);
            res.status(201).send("Authorised");
        } else{
            res.status(401).send('Unauthorised');
        }
    });
}

function addUser(username, email, pass, res) {
    db.run(`INSERT INTO users(username, email, password) VALUES(?,?,?)`, [username, email, pass], function(err) {
        if (err) {
            res.status(500).send('Server error: registration failed');
            return console.log(err.message);
        }
        res.cookie('userID', this.lastID);
        res.status(201).send("User added");
        // get the last insert id
        console.log(`A row has been inserted with id ${this.lastID}`);
    });
}

function addTask(uid, content, res){
    db.run(`INSERT INTO tasks(userID, content) VALUES(?,?)`, [uid, content], function(err) {
        if (err) {
            res.status(500).send('Server error: add task failed');
            return console.log(err.message);
        }
        res.status(201).send({taskID: this.lastID});
        // get the last insert id
        console.log(`A row has been inserted with id ${this.lastID}`);
    });
}

function removeTask(uid, taskID, res){
    db.run(`DELETE FROM tasks WHERE taskID = ? AND userID = ?`, [parseInt(taskID), uid], function(err) {
        if (err) {
            res.status(500).send('Server error: remove task failed');
            return console.log(err.message);
        }
        if(this.changes === 1){
            res.status(200).send(`The task has been deleted`);
            return console.log(`The task has been deleted`, this.changes);
        }
        console.log("Nothing deleted", this.changes)
    });
}

app.listen(PORT, () => console.log('App available on http://localhost:'+PORT));
