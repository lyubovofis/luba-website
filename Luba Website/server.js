const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT_DIR = __dirname; // C:\Luba Website

console.log('🚀 Starting Local Server...');
console.log(`📂 Root directory: ${ROOT_DIR}`);
console.log(`🌐 Server will run on: http://localhost:${PORT}\n`);

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Handle directory requests
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'text/plain';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.log(`❌ 404: ${req.url}`);
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                console.log(`❌ 500: ${error.code}`);
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            console.log(`✅ 200: ${req.url}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`✅ Server is running!`);
    console.log(`\n📍 Open in browser:`);
    console.log(`   - Main: http://localhost:${PORT}`);
    console.log(`   - Test CRM: http://localhost:${PORT}/test-crm-connection.html`);
    console.log(`   - CRM: http://localhost:${PORT}/crm/login.html`);
    console.log(`   - Quiz: http://localhost:${PORT}/quiz/\n`);
});
