const path = require('path');
const http = require('http');
const fs = require('fs');
const karma = require('karma');
const {e2eGlob} = require('../package.json');

const serverPort = 3000;

// modest static server for basic e2e tests
const app = http.createServer((req,res) => {
    const toFetch = req.url.trim() === '/' ? 'index.html' : req.url.trim();
    console.log(`fetching ${toFetch}`);
    const filePath = path.join(__dirname, '..', 'dist', toFetch);
    fs.readFile(filePath, (err, data)=>{
        if (err){
            console.error(`error fetching ${toFetch}`, err);
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200);
            res.end(data);
        }
    });
});
console.log(`\n\nstarting server at port ${serverPort}\n\n`);
app.listen(serverPort);
// extend default configuration
const karmaConfig = karma.config.parseConfig(path.resolve(__dirname, '../karma.conf.js'), {
    urlRoot: '/karma/',

    proxies: {
        '/': 'http://localhost:' + serverPort
    },
    singleRun: true,
    preprocessors: {
        '**/*.ts': ['webpack']
    },


    files: [e2eGlob],
    browserNoActivityTimeout: 100000000
});

const karmaServer = new karma.Server(karmaConfig, function(exitCode) {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode)
});
// karmaServer.on('browser_register', function (browser) {
//     console.log('A new browser was registered')
// });
console.log('\n\nstarting test\n\n');

karmaServer.start();
