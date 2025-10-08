const { chromium, firefox, webkit } = require('playwright');

// Test configurations for different devices and sizes
const devices = [
    // Mobile devices
    { name: 'iPhone 13', viewport: { width: 390, height: 844 }, userAgent: 'iPhone' },
    { name: 'iPhone SE', viewport: { width: 375, height: 667 }, userAgent: 'iPhone' },
    { name: 'Samsung Galaxy S21', viewport: { width: 360, height: 800 }, userAgent: 'Android' },
    { name: 'iPad', viewport: { width: 768, height: 1024 }, userAgent: 'iPad' },
    
    // Desktop sizes
    { name: 'Desktop 1920x1080', viewport: { width: 1920, height: 1080 }, userAgent: 'Desktop' },
    { name: 'Desktop 1366x768', viewport: { width: 1366, height: 768 }, userAgent: 'Desktop' },
    { name: 'Desktop 1440x900', viewport: { width: 1440, height: 900 }, userAgent: 'Desktop' },
    { name: 'Laptop 1280x720', viewport: { width: 1280, height: 720 }, userAgent: 'Desktop' },
];

async function testQuizOnDevice(browser, device) {
    console.log(`\n📱 Testing: ${device.name} (${device.viewport.width}x${device.viewport.height})`);
    
    const context = await browser.newContext({
        viewport: device.viewport,
        userAgent: device.userAgent
    });
    
    const page = await context.newPage();
    
    try {
        // Navigate to quiz
        await page.goto('https://lyubovpsy.com/quiz/', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        // Wait for quiz to load
        await page.waitForSelector('.quiz-container', { timeout: 10000 });
        
        // Check if first question is visible
        const step1Visible = await page.isVisible('#step1');
        console.log(`   Step 1 visible: ${step1Visible ? '✅' : '❌'}`);
        
        if (!step1Visible) {
            console.log('   ❌ First step not visible!');
            await context.close();
            return { device: device.name, success: false, error: 'Step 1 not visible' };
        }
        
        // Take screenshot before click
        await page.screenshot({ 
            path: `test-results/quiz-${device.name.replace(/\s+/g, '-')}-before.png`,
            fullPage: false
        });
        
        // Try to click first option
        const firstOption = page.locator('.option-card').first();
        const isClickable = await firstOption.isVisible();
        console.log(`   First option visible: ${isClickable ? '✅' : '❌'}`);
        
        if (!isClickable) {
            console.log('   ❌ Options not visible!');
            await context.close();
            return { device: device.name, success: false, error: 'Options not visible' };
        }
        
        // Click the first option
        await firstOption.click();
        await page.waitForTimeout(1000);
        
        // Check if option was selected
        const selectedOption = await page.locator('.option-card.selected').count();
        console.log(`   Option selected: ${selectedOption > 0 ? '✅' : '❌'}`);
        
        // Check if "Next" button is enabled
        const nextBtn = page.locator('#btn1');
        const btnDisabled = await nextBtn.getAttribute('disabled');
        const btnEnabled = btnDisabled === null;
        console.log(`   Next button enabled: ${btnEnabled ? '✅' : '❌'}`);
        
        if (!btnEnabled) {
            console.log('   ❌ Button still disabled after selection!');
            await page.screenshot({ 
                path: `test-results/quiz-${device.name.replace(/\s+/g, '-')}-error.png`,
                fullPage: false
            });
            await context.close();
            return { device: device.name, success: false, error: 'Button not enabled' };
        }
        
        // Click next button
        await nextBtn.click();
        await page.waitForTimeout(2000);
        
        // Check if moved to step 2
        const step2Visible = await page.isVisible('#step2.active');
        console.log(`   Moved to Step 2: ${step2Visible ? '✅' : '❌'}`);
        
        if (!step2Visible) {
            console.log('   ❌ Did not progress to step 2!');
            await context.close();
            return { device: device.name, success: false, error: 'Cannot progress to step 2' };
        }
        
        // Take screenshot after successful click
        await page.screenshot({ 
            path: `test-results/quiz-${device.name.replace(/\s+/g, '-')}-step2.png`,
            fullPage: false
        });
        
        // Test step 2
        await page.locator('#step2 .option-card').first().click();
        await page.waitForTimeout(500);
        
        const btn2Enabled = await page.locator('#btn2').getAttribute('disabled') === null;
        console.log(`   Step 2 button enabled: ${btn2Enabled ? '✅' : '❌'}`);
        
        // Check for JavaScript errors
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        if (errors.length > 0) {
            console.log(`   ⚠️  JavaScript errors: ${errors.length}`);
            errors.forEach(err => console.log(`      - ${err}`));
        }
        
        console.log(`   ✅ ${device.name} - QUIZ WORKS!`);
        
        await context.close();
        return { 
            device: device.name, 
            success: true, 
            viewport: device.viewport,
            errors: errors
        };
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        await page.screenshot({ 
            path: `test-results/quiz-${device.name.replace(/\s+/g, '-')}-crash.png`,
            fullPage: true
        });
        await context.close();
        return { device: device.name, success: false, error: error.message };
    }
}

async function runAllTests() {
    console.log('🧪 COMPREHENSIVE QUIZ TEST - ALL DEVICES\n');
    console.log('=' .repeat(60));
    
    const results = {
        chrome: [],
        firefox: [],
        webkit: []
    };
    
    // Test on Chrome
    console.log('\n🌐 TESTING ON CHROMIUM (Chrome/Edge)');
    console.log('=' .repeat(60));
    const chrome = await chromium.launch({ headless: true });
    for (const device of devices) {
        const result = await testQuizOnDevice(chrome, device);
        results.chrome.push(result);
    }
    await chrome.close();
    
    // Test on Firefox
    console.log('\n🦊 TESTING ON FIREFOX');
    console.log('=' .repeat(60));
    const ff = await firefox.launch({ headless: true });
    for (const device of devices.slice(0, 3)) { // Test only key devices
        const result = await testQuizOnDevice(ff, device);
        results.firefox.push(result);
    }
    await ff.close();
    
    // Test on Safari (WebKit)
    console.log('\n🧭 TESTING ON WEBKIT (Safari)');
    console.log('=' .repeat(60));
    const wk = await webkit.launch({ headless: true });
    for (const device of devices.slice(0, 3)) { // Test only key devices
        const result = await testQuizOnDevice(wk, device);
        results.webkit.push(result);
    }
    await wk.close();
    
    // Summary
    console.log('\n');
    console.log('=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    
    const chromeSuccess = results.chrome.filter(r => r.success).length;
    const firefoxSuccess = results.firefox.filter(r => r.success).length;
    const webkitSuccess = results.webkit.filter(r => r.success).length;
    
    console.log(`\n✅ Chrome: ${chromeSuccess}/${results.chrome.length} passed`);
    console.log(`✅ Firefox: ${firefoxSuccess}/${results.firefox.length} passed`);
    console.log(`✅ Safari: ${webkitSuccess}/${results.webkit.length} passed`);
    
    // Failed tests
    const allResults = [...results.chrome, ...results.firefox, ...results.webkit];
    const failed = allResults.filter(r => !r.success);
    
    if (failed.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        failed.forEach(f => {
            console.log(`   - ${f.device}: ${f.error}`);
        });
    }
    
    // Success rate
    const total = allResults.length;
    const successful = allResults.filter(r => r.success).length;
    const successRate = ((successful / total) * 100).toFixed(1);
    
    console.log(`\n📈 OVERALL SUCCESS RATE: ${successRate}% (${successful}/${total})`);
    
    if (successRate < 80) {
        console.log('\n⚠️  WARNING: Success rate below 80%! Quiz has issues!');
    } else if (successRate === 100) {
        console.log('\n✅ PERFECT! Quiz works on all devices!');
    } else {
        console.log('\n✅ GOOD! Quiz works on most devices, but some issues found.');
    }
    
    console.log('\n📸 Screenshots saved in test-results/ folder');
    console.log('=' .repeat(60));
}

runAllTests().catch(console.error);
