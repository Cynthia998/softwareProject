const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT | "8080";
const parentDirectory = path.resolve(__dirname, '..');

app.use(express.static(parentDirectory));

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

app.listen(port, () => console.log(`Listening on port ${port}`));