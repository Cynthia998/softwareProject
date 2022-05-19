const fs = require("fs");
const mongo = require("mongodb");
const path = require("path");

/* INSERT YOUR MONGODB LINK */
const uri = "mongodb+srv://3cinnamon12:Aac-1995@aac.kkvbf.mongodb.net/?retryWrites=true&w=majority";
const client = mongo.MongoClient;
const grid = mongo.GridFSBucket;

client.connect(uri, (err, database) => {
    if (err) throw err;

    /* INSERT YOUR DATABASE */
    const db = database.db("sermons");
    const gridfs = new grid(db);

    fs.readdir('./', (error, files) => {
        if (error) {
            console.log(`Could not read the current working directory`);
            process.exit(1);
        }

        files.forEach(async (file, _index) => {
            if (/.*.mp3/.test(file)) {

                await uploadFile(gridfs, path.resolve(file)).then((done) => {
                    if (done) {
                        console.log("File uploaded!");
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        })
    });
});

function uploadFile (gfs, _path) {
    return new Promise((resolve, reject) => {
        let writeStream = gfs.openUploadStream(_path);

        fs.createReadStream(_path).pipe(writeStream);

        writeStream.on("finish", (f) => {
            if (f.filename) {
                console.log(`Successfully uploaded file: ${f.filename}`);
                return resolve(true);
            } else {
                return reject(`Failed to upload file`);
            }
        });
    });
}