const { chromium } = require('playwright');

async function testQuiz() {
    console.log('🧪 Тест квізу quiz-test\n');
    
    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const page = await browser.newPage();
    
    try {
        // 1. Відкрити квіз
        console.log('1. Відкриття квізу...');
        await page.goto('http://localhost:8000/quiz-test/');
        await page.waitForLoadState('networkidle');
        console.log('✅ Квіз завантажено\n');
        
        // 2. Вопрос 1
        console.log('2. Питання 1...');
        await page.locator('.option-card').first().click();
        await page.waitForTimeout(500);
        const btn1Enabled = await page.locator('#btn1').isEnabled();
        console.log(`   Кнопка активна: ${btn1Enabled ? '✅' : '❌'}`);
        
        await page.locator('#btn1').click();
        await page.waitForTimeout(800);
        console.log('✅ Перехід на крок 2\n');
        
        // 3. Вопрос 2
        console.log('3. Питання 2...');
        await page.locator('#step2 .option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn2').click();
        await page.waitForTimeout(800);
        console.log('✅ Перехід на крок 3\n');
        
        // 4. Вопрос 3
        console.log('4. Питання 3...');
        await page.locator('#step3 .option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn3').click();
        await page.waitForTimeout(800);
        console.log('✅ Перехід на крок 4\n');
        
        // 5. Вопрос 4
        console.log('5. Питання 4...');
        await page.locator('#step4 .option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn4').click();
        await page.waitForTimeout(800);
        console.log('✅ Перехід на крок 5\n');
        
        // 6. Вопрос 5 (слайдери)
        console.log('6. Питання 5 (слайдери)...');
        await page.locator('#currentSlider').fill('3000');
        await page.locator('#desiredSlider').fill('8000');
        await page.waitForTimeout(500);
        await page.locator('#btn5').click();
        await page.waitForTimeout(800);
        console.log('✅ Перехід на крок 6\n');
        
        // 7. Вопрос 6
        console.log('7. Питання 6...');
        await page.locator('#step6 .option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn6').click();
        await page.waitForTimeout(800);
        console.log('✅ Перехід на крок 7\n');
        
        // 8. Вопрос 7
        console.log('8. Питання 7...');
        await page.locator('#step7 .option-card').first().click();
        await page.waitForTimeout(500);
        await page.locator('#btn7').click();
        await page.waitForTimeout(800);
        console.log('✅ Перехід на форму\n');
        
        // 9. Форма
        console.log('9. Заповнення форми...');
        await page.locator('#userName').fill('Test User');
        await page.locator('#userPhone').fill('380501234567');
        await page.locator('#userEmail').fill('test@example.com');
        await page.waitForTimeout(500);
        
        console.log('✅ Форма заповнена');
        console.log('   Ім\'я: Test User');
        console.log('   Телефон: 380501234567');
        console.log('   Email: test@example.com\n');
        
        await page.locator('#submitBtn').click();
        await page.waitForTimeout(2000);
        
        // 10. Результат
        const resultVisible = await page.locator('#step9').isVisible();
        console.log(`10. Результат: ${resultVisible ? '✅ Показано' : '❌ Не показано'}\n');
        
        if (resultVisible) {
            const blockName = await page.locator('#resultBlockName').textContent();
            console.log(`📊 Визначений блок: ${blockName}`);
        }
        
        await page.waitForTimeout(3000);
        
        console.log('\n✅ ТЕСТ ЗАВЕРШЕНО УСПІШНО!');
        
    } catch (error) {
        console.error('\n❌ ПОМИЛКА:', error.message);
    } finally {
        await browser.close();
    }
}

testQuiz();
