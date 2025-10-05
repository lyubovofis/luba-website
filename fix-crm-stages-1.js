// ВИПРАВЛЕННЯ CRM - ЧАСТИНА 1/3
// Проблема: Невідповідність стадій між квізом та CRM

const fs = require('fs');
const path = require('path');

console.log('🔧 Виправлення CRM стадій...\n');

const crmPath = path.join(__dirname, 'crm', 'index.html');
let content = fs.readFileSync(crmPath, 'utf8');

// 1. Виправити стадії колонок воронки
content = content.replace(
    /data-stage="new"/g,
    'data-stage="quiz_new"'
);

content = content.replace(
    /const stages = \['new', 'consultation', 'paid'\];/g,
    `const stages = ['quiz_new', 'consultation', 'paid'];`
);

// 2. Додати console.log для відладки drag & drop
const dragDropSection = `                    const leadId = parseInt(draggedElement.dataset.id);
                    const newStage = column.dataset.stage;
                    const lead = allLeads.find(l => l.id == leadId);
                    
                    console.log('🔄 Drag & Drop:', { leadId, newStage, currentStage: lead?.stage });`;

content = content.replace(
    /const leadId = parseInt\(draggedElement\.dataset\.id\);\s*const newStage = column\.dataset\.stage;\s*const lead = allLeads\.find\(l => l\.id == leadId\);/,
    dragDropSection
);

// 3. Додати then() після update для перевірки помилок
content = content.replace(
    /(await supabase\.from\('quiz_leads'\)\.update\(\{[\s\S]*?\}\)\.eq\('id', leadId\);)/g,
    `const { data, error } = $1
                        
                        if (error) {
                            console.error('❌ Update error:', error);
                            alert('Помилка оновлення: ' + error.message);
                            await loadData(); // Reload to revert visual change
                            return;
                        }
                        
                        console.log('✅ Updated successfully');`
);

fs.writeFileSync(crmPath, content);

console.log('✅ Частина 1/3 завершено');
console.log('   - Виправлено стадії воронки');
console.log('   - Додано логування');
console.log('   - Додано обробку помилок\n');
