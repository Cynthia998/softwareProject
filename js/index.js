const express = require("express");
const fs = require("fs");
const path = require("path");
const mongo = require("mongodb");

const app = express();
const port = process.env.PORT || "8080";
const parentDirectory = path.resolve(__dirname, '..');

const uri = "mongodb+srv://3cinnamon12:Aac-1995@aac.kkvbf.mongodb.net/?retryWrites=true&w=majority";
const client = mongo.MongoClient;
const grid = mongo.GridFSBucket;

let META_DATA = {
    "6285e9ba30c3cad22af68cc6": "lord",
    "6285e9ba30c3cad22af68cc4": "faith",
    "6285e9ba30c3cad22af68cc7": "holiness",
    "6285e9ba30c3cad22af68cc0": "leaders",
    "6285e9ba30c3cad22af68cbf": "hope",
    "6285e9ba30c3cad22af68cc3": "life"
}

app.use(express.static(parentDirectory));
app.use(express.urlencoded());

fs.readdir(parentDirectory, (err, files) => {
    if (err) {
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
    res.status(200);
    let found = false;
    Object.entries(META_DATA).forEach(([key, value]) => {
        if (new RegExp(value).test(req.body.query)) {
            found = true;

            client.connect(uri, async (error, result) => {
                if (error) {
                    throw error;
                }

                const db = result.db("sermons");
                const gfs = new grid(db);

                await getFile(gfs, key).then((_d) => {
                    res.write(_d, () => {
                        return res.end();
                    });
                }).catch((err) => console.log(err));
            });
        }
    });

    if (!found) {
        return res.end();
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`));

async function getFile (gridFS, objectID) {
    return new Promise((resolve, reject) => {
        const downloadStream = gridFS.openDownloadStream(new mongo.ObjectId(objectID));

        let chunks = [];

        downloadStream.on("error", (err) => reject(err));

        downloadStream.on("data", (chunk) => {
            chunks.push(chunk);
        });

        downloadStream.on("end", async () => {
            let base64 = Buffer.concat(chunks).toString('base64');
            resolve(base64);
        });
    });
}