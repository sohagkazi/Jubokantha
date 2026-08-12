const fs = require('fs'); process.on('uncaughtException', (err) => { fs.writeFileSync(__dirname + '/error_log.txt', err.stack || err.toString()); }); require('./server.js');
