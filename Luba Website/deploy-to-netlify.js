// Netlify Deploy Script
const NETLIFY_TOKEN = 'nfp_x4kuLcrQRpzWXb3XfopEr1VqmJzZ6Uz3da43';
const SITE_ID = 'c07e600b-d21c-4ee8-814d-19b78a708c7b'; // lyubovpsy.com

async function deployToNetlify() {
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');
    
    console.log('📦 Creating deployment package...');
    
    // Create zip file
    const sourceDir = 'C:\\Luba Website';
    const zipFile = 'C:\\temp\\deploy.zip';
    
    // Create temp directory if not exists
    if (!fs.existsSync('C:\\temp')) {
        fs.mkdirSync('C:\\temp');
    }
    
    // Create zip using PowerShell
    execSync(`powershell -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${zipFile}' -Force"`);
    
    console.log('📤 Uploading to Netlify...');
    
    // Read zip file
    const zipBuffer = fs.readFileSync(zipFile);
    
    // Upload to Netlify
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NETLIFY_TOKEN}`,
            'Content-Type': 'application/zip'
        },
        body: zipBuffer
    });
    
    if (response.ok) {
        const deploy = await response.json();
        console.log('✅ Deployment successful!');
        console.log(`🌐 Deploy URL: ${deploy.deploy_ssl_url}`);
        console.log(`📊 Admin URL: ${deploy.admin_url}`);
        return deploy;
    } else {
        const error = await response.text();
        console.error('❌ Deployment failed:', error);
        throw new Error(error);
    }
}

// Run deployment
deployToNetlify().catch(console.error);