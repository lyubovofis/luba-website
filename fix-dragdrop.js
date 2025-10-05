// ВИПРАВЛЕННЯ DRAG & DROP - повна заміна
const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, 'crm', 'index.html');
let content = fs.readFileSync(crmPath, 'utf8');

// Знаходимо секцію Drag & Drop
const dragDropStart = content.indexOf('// Drag & Drop');
const dragDropEnd = content.indexOf('// Add lead form');

if (dragDropStart > 0 && dragDropEnd > dragDropStart) {
    const before = content.substring(0, dragDropStart);
    const after = content.substring(dragDropEnd);
    
    const newDragDrop = `// Drag & Drop
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.kanban-column').forEach(column => {
                column.addEventListener('dragover', e => e.preventDefault());
                
                column.addEventListener('drop', async e => {
                    e.preventDefault();
                    
                    if (!draggedElement) return;
                    
                    const leadId = parseInt(draggedElement.dataset.id);
                    const newStage = column.dataset.stage;
                    const lead = allLeads.find(l => l.id == leadId);
                    
                    if (!lead || lead.stage === newStage) return;
                    
                    try {
                        const { createClient } = window.supabase;
                        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                        
                        const { error } = await supabase
                            .from('quiz_leads')
                            .update({ stage: newStage })
                            .eq('id', leadId);
                        
                        if (error) throw error;
                        
                        await loadData();
                    } catch (error) {
                        console.error('Drag & drop error:', error);
                        alert('Помилка переміщення');
                        await loadData();
                    }
                });
            });
        });
        
        `;
    
    content = before + newDragDrop + after;
    fs.writeFileSync(crmPath, content);
    console.log('✅ Drag & Drop виправлено');
} else {
    console.log('❌ Не знайдено секцію Drag & Drop');
}
