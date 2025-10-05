const { chromium } = require('playwright');

async function testQuizButtons() {
    console.log('🧪 ТЕСТ КНОПОК В КВИЗЕ\n');
    
    const browser = await chromium.launch({ 
        headless: false, 
        slowMo: 1000 
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('1️⃣ Открываем квиз...');
        await page.goto('http://localhost:8000/quiz-test/', {
            waitUntil: 'networkidle'
        });
        console.log('   ✅ Квиз загружен\n');
        
        await page.waitForTimeout(2000);
        
        // Вопрос 1
        console.log('2️⃣ Тест вопроса 1...');
        const options = await page.locator('.option-card').all();
        console.log(`   Найдено опций: ${options.length}`);
        
        if (options.length > 0) {
            await options[0].click();
            console.log('   ✅ Опция кликается');
            await page.waitForTimeout(500);
            
            const btn1 = page.locator('#btn1');
            const isVisible = await btn1.isVisible();
            const isEnabled = await btn1.isEnabled();
            
            console.log(`   Кнопка #btn1 видна: ${isVisible ? '✅' : '❌'}`);
            console.log(`   Кнопка #btn1 активна: ${isEnabled ? '✅' : '❌'}`);
            
            if (isVisible && isEnabled) {
                console.log('   🖱️ Пробуем нажать кнопку...');
                await btn1.click();
                await page.waitForTimeout(1000);
                
                const step2Visible = await page.locator('#step2').isVisible();
                console.log(`   Переход на шаг 2: ${step2Visible ? '✅' : '❌'}\n`);
                
                if (step2Visible) {
                    // Вопрос 2
                    console.log('3️⃣ Тест вопроса 2...');
                    const options2 = await page.locator('#step2 .option-card').all();
                    if (options2.length > 0) {
                        await options2[0].click();
                        await page.waitForTimeout(500);
                        
                        const btn2 = page.locator('#btn2');
                        await btn2.click();
                        await page.waitForTimeout(1000);
                        
                        const step3Visible = await page.locator('#step3').isVisible();
                        console.log(`   Переход на шаг 3: ${step3Visible ? '✅' : '❌'}\n`);
                    }
                }
            } else {
                console.log('   ❌ ПРОБЛЕМА: Кнопка не работает\n');
            }
        } else {
            console.log('   ❌ ПРОБЛЕМА: Опции не найдены\n');
        }
        
        console.log('\n📊 РЕЗУЛЬТАТ:');
        const currentStep = await page.evaluate(() => {
            const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'];
            for (let step of steps) {
                const el = document.getElementById(step);
                if (el && el.classList.contains('active')) {
                    return step;
                }
            }
            return 'unknown';
        });
        console.log(`Текущий шаг: ${currentStep}`);
        
        if (currentStep === 'step3' || currentStep === 'step4') {
            console.log('✅ КНОПКИ РАБОТАЮТ ПРАВИЛЬНО');
        } else {
            console.log('❌ КНОПКИ НЕ РАБОТАЮТ');
        }
        
        await page.waitForTimeout(3000);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await browser.close();
    }
}

testQuizButtons();
