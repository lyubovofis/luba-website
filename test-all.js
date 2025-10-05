const { chromium } = require('playwright');

async function testCRMAndQuiz() {
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    
    try {
        // TEST 1: QUIZ
        console.log('\n=== ТЕСТ КВІЗУ ===\n');
        const quizPage = await browser.newPage();
        await quizPage.goto('http://localhost:8000/quiz-test/');
        
        // Пройти всі 7 питань
        for (let i = 1; i <= 4; i++) {
            await quizPage.locator(`#step${i} .option-card`).first().click();
            await quizPage.locator(`#btn${i}`).click();
            await quizPage.waitForTimeout(500);
        }
        
        // Слайдери
        await quizPage.locator('#currentSlider').fill('3000');
        await quizPage.locator('#desiredSlider').fill('8000');
        await quizPage.locator('#btn5').click();
        await quizPage.waitForTimeout(500);
        
        // Питання 6-7
        for (let i = 6; i <= 7; i++) {
            await quizPage.locator(`#step${i} .option-card`).first().click();
            await quizPage.locator(`#btn${i}`).click();
            await quizPage.waitForTimeout(500);
        }
        
        // Форма
        await quizPage.locator('#userName').fill('Playwright Test');
        await quizPage.locator('#userPhone').fill('380991234567');
        await quizPage.locator('#submitBtn').click();
        await quizPage.waitForTimeout(3000);
        
        const resultShown = await quizPage.locator('#step9').isVisible();
        console.log(`Квіз: ${resultShown ? '✅ ПРАЦЮЄ' : '❌ НЕ ПРАЦЮЄ'}`);
        
        // TEST 2: CRM
        console.log('\n=== ТЕСТ CRM ===\n');
        const crmPage = await browser.newPage();
        await crmPage.goto('http://localhost:8000/crm/login.html');
        
        // Логін
        await crmPage.locator('#username').fill('Luba');
        await crmPage.locator('#password').fill('Luba1488@');
        await crmPage.locator('button[type="submit"]').click();
        await crmPage.waitForTimeout(2000);
        
        const dashboardVisible = await crmPage.locator('#dashboard').isVisible();
        console.log(`CRM логін: ${dashboardVisible ? '✅ ПРАЦЮЄ' : '❌ НЕ ПРАЦЮЄ'}`);
        
        if (dashboardVisible) {
            // Перейти на Воронку
            await crmPage.locator('text=Воронка').click();
            await crmPage.waitForTimeout(1000);
            
            // Перевірити чи є ліди
            const leadsExist = await crmPage.locator('.lead-card').count() > 0;
            console.log(`Ліди в воронці: ${leadsExist ? '✅ Є' : '⚠️ Немає'}`);
            
            if (leadsExist) {
                // Спробувати архівувати
                const notInterestedBtn = await crmPage.locator('button[title="Не зацікавлений"]').first();
                if (await notInterestedBtn.isVisible()) {
                    await notInterestedBtn.click();
                    await crmPage.locator('text=OK').click();
                    await crmPage.waitForTimeout(2000);
                    
                    // Перейти в Архів
                    await crmPage.locator('text=Архів').click();
                    await crmPage.waitForTimeout(1000);
                    
                    const archivedLeads = await crmPage.locator('.archive-lead-card').count();
                    console.log(`Архів: ${archivedLeads > 0 ? '✅ ПРАЦЮЄ' : '❌ НЕ ПРАЦЮЄ'}`);
                }
            }
        }
        
        await crmPage.waitForTimeout(3000);
        
        console.log('\n=== ТЕСТИ ЗАВЕРШЕНО ===\n');
        
    } catch (error) {
        console.error('❌ Помилка:', error.message);
    } finally {
        await browser.close();
    }
}

testCRMAndQuiz();
