const express = require("express");
const fs = require("fs");
const path = require("path");
const mongo = require("mongodb");

const app = express();
const port = process.env.PORT | "8080";
const parentDirectory = path.resolve(__dirname, '..');

const uri = "mongodb+srv://sn1p3r:Lazystamp57@howdoesthiswork.p7dya.mongodb.net/?retryWrites=true&w=majority";
const client = mongo.MongoClient;

/*client.connect(uri, function (err, db) {
    if (err) throw err;
});*/



app.use(express.static(parentDirectory));
app.use(express.urlencoded());

fs.readdir(parentDirectory, (err, files) => {
    if (err) {w
        console.log(`Could not list directory: ${parentDirectory}`);
        process.exit(1);
    }

    files.forEach((file, _index) => {
        if (/.*\.html/.test(file)) {
            let f = file.split('.')[0];
            
            app.get(`/${f}`, (req, res) => {
                res.status(200).sendFile(path.join(parentDirectory, file));
            });
        }
    });
});

app.get("/", (_req, res) => {
    res.redirect("/home");
});

app.post("/archive", (req, res) => {
    
});

app.listen(port, () => console.log(`Listening on port ${port}`));