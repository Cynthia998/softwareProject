const http = require('http');
const { readFile } = require('fs');
 

http.createServer((req, res) => {
    readFile("./home.html", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(data);
        }
    })
}).listen(5000);