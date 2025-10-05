const https = require('https');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execPromise = promisify(exec);

const SITE_ID = 'c07e600b-d21c-4ee8-814d-19b78a708c7b';

async function deployToNetlify() {
    console.log('🚀 DEPLOYING CRM TO NETLIFY\n');
    
    try {
        // Get auth token
        console.log('🔑 Getting Netlify token...');
        const { stdout: tokenOutput } = await execPromise('netlify env:get NETLIFY_AUTH_TOKEN 2>nul || echo ""');
        
        // Alternative: try to deploy using git push
        console.log('\n📦 Using Git-based deployment...');
        console.log('   This will trigger automatic Netlify build from GitHub\n');
        
        // Add and commit changes
        console.log('1️⃣ Adding files to git...');
        await execPromise('git add crm/login.html crm/index.html netlify.toml');
        
        console.log('2️⃣ Committing changes...');
        try {
            await execPromise('git commit -m "feat: deploy compact CRM design to Netlify"');
            console.log('   ✅ Committed');
        } catch (e) {
            if (e.message.includes('nothing to commit')) {
                console.log('   ℹ️  No changes to commit');
            } else {
                throw e;
            }
        }
        
        console.log('3️⃣ Pushing to GitHub...');
        const { stdout, stderr } = await execPromise('git push origin main 2>&1');
        
        if (stderr && !stderr.includes('up-to-date') && !stderr.includes('Everything up-to-date')) {
            console.log('   ✅ Pushed to GitHub!');
            console.log('\n🎉 DEPLOYMENT TRIGGERED!');
            console.log('\nNetlify will automatically deploy from GitHub.');
            console.log('Check your Netlify dashboard:');
            console.log('https://app.netlify.com/sites/your-site-name/deploys\n');
        } else {
            console.log('   ℹ️  Already up to date');
        }
        
        console.log('\n✅ DONE! CRM will be live in 1-2 minutes');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        
        console.log('\n💡 ALTERNATIVE: Manual Deploy Options\n');
        console.log('Option 1 - Netlify Dashboard:');
        console.log('  1. Go to: https://app.netlify.com');
        console.log('  2. Select your site');
        console.log('  3. Click "Deploys" tab');
        console.log('  4. Click "Trigger deploy" → "Deploy site"\n');
        
        console.log('Option 2 - Drag & Drop:');
        console.log('  1. Zip the project folder');
        console.log('  2. Go to: https://app.netlify.com/drop');
        console.log('  3. Drag the ZIP file\n');
        
        console.log('Option 3 - Fix CLI:');
        console.log('  npm uninstall -g netlify-cli');
        console.log('  npm install -g netlify-cli@latest');
        console.log('  netlify deploy --prod --dir=.\n');
    }
}

deployToNetlify();
