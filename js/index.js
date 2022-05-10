const http = require('http');


http.createServer((req, res) => {
    res.write("<b>Hello, World</b>");
    return res.end();
}).listen(5000);