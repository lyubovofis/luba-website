        function createLeadCard(lead) {
            const card = document.createElement('div');
            card.className = 'lead-card';
            card.draggable = true;
            card.dataset.id = lead.id;
            
            // Parse quiz_answers if it's a string
            let quizAnswers = {};
            if (lead.quiz_answers) {
                try {
                    quizAnswers = typeof lead.quiz_answers === 'string' 
                        ? JSON.parse(lead.quiz_answers) 
                        : lead.quiz_answers;
                } catch (e) {
                    console.error('Error parsing quiz_answers:', e);
                }
            }
            
            const formatDate = (dateStr) => {
                if (!dateStr) return 'Не указано';
                const date = new Date(dateStr);
                return date.toLocaleDateString('ru', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            };
            
            card.innerHTML = `
                <div class="lead-header">
                    <div style="flex: 1">
                        <div class="lead-name">${lead.name || 'Без имени'}</div>
                        <div style="font-size: 12px; color: var(--text-gray); margin-top: 3px;">
                            ID: ${lead.id}
                        </div>
                    </div>
                    <div class="lead-actions">
                        <button class="lead-action" onclick="event.stopPropagation(); contactLead('${lead.phone}',${lead.id})" title="WhatsApp">
                            💬
                        </button>
                        <button class="lead-action" onclick="event.stopPropagation(); moveToNext(${lead.id})" title="Следующий этап">
                            ➡️
                        </button>
                    </div>
                </div>
                
                <div class="lead-info-row">
                    <span class="lead-info-icon">📱</span>
                    <span class="lead-info-label">Телефон:</span>
                    <span class="lead-info-value">${lead.phone || 'Не указан'}</span>
                </div>
                
                ${lead.email ? `
                <div class="lead-info-row">
                    <span class="lead-info-icon">📧</span>
                    <span class="lead-info-label">Email:</span>
                    <span class="lead-info-value">${lead.email}</span>
                </div>
                ` : ''}
                
                ${lead.age ? `
                <div class="lead-info-row">
                    <span class="lead-info-icon">👤</span>
                    <span class="lead-info-label">Возраст:</span>
                    <span class="lead-info-value">${lead.age} лет</span>
                </div>
                ` : ''}
                
                <div class="lead-info-row">
                    <span class="lead-info-icon">📅</span>
                    <span class="lead-info-label">Создан:</span>
                    <span class="lead-info-value">${formatDate(lead.created_at)}</span>
                </div>
                
                ${quizAnswers.currentIncome || quizAnswers.desiredIncome ? `
                <div class="lead-section">
                    <div class="lead-section-title">💰 Доход</div>
                    <div class="lead-info-row">
                        <span class="lead-info-icon">📊</span>
                        <span class="lead-info-label">Текущий:</span>
                        <span class="lead-info-value">€${quizAnswers.currentIncome || '-'}</span>
                    </div>
                    <div class="lead-info-row">
                        <span class="lead-info-icon">🎯</span>
                        <span class="lead-info-label">Желаемый:</span>
                        <span class="lead-info-value">€${quizAnswers.desiredIncome || '-'}</span>
                    </div>
                </div>
                ` : ''}
                
                ${lead.main_block ? `
                <div class="lead-tags">
                    <span class="lead-tag important">${lead.main_block}</span>
                </div>
                ` : ''}
            `;
            
            // Click on card to show details
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.lead-action')) {
                    showLeadDetails(lead.id);
                }
            });
            
            card.addEventListener('dragstart', e => { 
                draggedElement = card; 
                card.style.opacity = '0.5'; 
            });
            
            card.addEventListener('dragend', e => { 
                card.style.opacity = ''; 
            });
            
            return card;
        }
        
        function showLeadDetails(leadId) {
            const lead = allLeads.find(l => l.id == leadId);
            if (!lead) return;
            
            // Parse quiz answers
            let quizAnswers = {};
            if (lead.quiz_answers) {
                try {
                    quizAnswers = typeof lead.quiz_answers === 'string' 
                        ? JSON.parse(lead.quiz_answers) 
                        : lead.quiz_answers;
                } catch (e) {
                    console.error('Error parsing quiz_answers:', e);
                }
            }
            
            const formatDate = (dateStr) => {
                if (!dateStr) return 'Не указано';
                const date = new Date(dateStr);
                return date.toLocaleDateString('ru', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            };
            
            const getStageText = (stage) => {
                const stages = {
                    'new': '📝 Новый',
                    'consultation': '💬 Консультация',
                    'paid': '✅ Оплачен'
                };
                return stages[stage] || stage;
            };
            
            document.getElementById('modalBody').innerHTML = `
                <!-- Contact Information -->
                <div class="modal-section">
                    <div class="modal-section-title">
                        <span>👤</span> Контактная информация
                    </div>
                    <div class="modal-info-grid">
                        <div class="modal-info-item">
                            <div class="modal-info-label">Имя</div>
                            <div class="modal-info-value" id="view-name">${lead.name || 'Не указано'}</div>
                            <input type="text" class="edit-input" id="edit-name" value="${lead.name || ''}" />
                        </div>
                        <div class="modal-info-item">
                            <div class="modal-info-label">Телефон</div>
                            <div class="modal-info-value" id="view-phone">${lead.phone || 'Не указан'}</div>
                            <input type="tel" class="edit-input" id="edit-phone" value="${lead.phone || ''}" />
                        </div>
                        <div class="modal-info-item">
                            <div class="modal-info-label">Email</div>
                            <div class="modal-info-value" id="view-email">${lead.email || 'Не указан'}</div>
                            <input type="email" class="edit-input" id="edit-email" value="${lead.email || ''}" />
                        </div>
                        <div class="modal-info-item">
                            <div class="modal-info-label">Возраст</div>
                            <div class="modal-info-value" id="view-age">${lead.age || 'Не указан'}</div>
                            <input type="number" class="edit-input" id="edit-age" value="${lead.age || ''}" min="18" max="100" />
                        </div>
                    </div>
                </div>
                
                <!-- Status Information -->
                <div class="modal-section">
                    <div class="modal-section-title">
                        <span>📊</span> Статус
                    </div>
                    <div class="modal-info-grid">
                        <div class="modal-info-item">
                            <div class="modal-info-label">Текущий этап</div>
                            <div class="modal-info-value" id="view-stage">${getStageText(lead.stage)}</div>
                            <select class="edit-input" id="edit-stage" style="display: none;">
                                <option value="new" ${lead.stage === 'new' ? 'selected' : ''}>📝 Новый</option>
                                <option value="consultation" ${lead.stage === 'consultation' ? 'selected' : ''}>💬 Консультация</option>
                                <option value="paid" ${lead.stage === 'paid' ? 'selected' : ''}>✅ Оплачен</option>
                            </select>
                        </div>
                        <div class="modal-info-item">
                            <div class="modal-info-label">Основной блок</div>
                            <div class="modal-info-value" id="view-main_block">${lead.main_block || 'Не определен'}</div>
                            <input type="text" class="edit-input" id="edit-main_block" value="${lead.main_block || ''}" />
                        </div>
                        <div class="modal-info-item">
                            <div class="modal-info-label">ID Лида</div>
                            <div class="modal-info-value">${lead.id}</div>
                        </div>
                        <div class="modal-info-item">
                            <div class="modal-info-label">Дата создания</div>
                            <div class="modal-info-value">${formatDate(lead.created_at)}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Quiz Answers -->
                ${Object.keys(quizAnswers).length > 0 ? `
                <div class="modal-section">
                    <div class="modal-section-title">
                        <span>🎯</span> Ответы на квиз
                    </div>
                    ${quizAnswers.currentIncome || quizAnswers.desiredIncome ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div class="modal-info-item">
                            <div class="modal-info-label">💰 Текущий доход</div>
                            <div class="modal-info-value">€${quizAnswers.currentIncome || '-'}</div>
                        </div>
                        <div class="modal-info-item">
                            <div class="modal-info-label">🎯 Желаемый доход</div>
                            <div class="modal-info-value">€${quizAnswers.desiredIncome || '-'}</div>
                        </div>
                    </div>
                    ` : ''}
                    
                    ${Object.entries(quizAnswers).filter(([key]) => key !== 'currentIncome' && key !== 'desiredIncome').map(([question, answer]) => `
                        <div class="quiz-answer-item">
                            <div class="quiz-question">${question}</div>
                            <div class="quiz-answer">${answer}</div>
                        </div>
                    `).join('')}
                </div>
                ` : '<div class="modal-section"><p style="text-align:center;color:var(--text-gray)">Нет данных квиза</p></div>'}
            `;
            
            // Setup modal footer
            const modal = document.getElementById('leadModal');
            const modalHeader = modal.querySelector('.modal-header');
            
            modalHeader.innerHTML = `
                <div>
                    <h2>${lead.name || 'Лид без имени'}</h2>
                    <div class="modal-header-subtitle">${getStageText(lead.stage)}</div>
                </div>
                <button class="modal-close" onclick="closeModal()">✕</button>
            `;
            
            let modalFooter = modal.querySelector('.modal-footer');
            if (!modalFooter) {
                modalFooter = document.createElement('div');
                modalFooter.className = 'modal-footer';
                modal.querySelector('.modal-content').appendChild(modalFooter);
            }
            
            modalFooter.innerHTML = `
                <button class="btn btn-edit" id="editBtn" onclick="toggleEditMode()">
                    ✏️ Редактировать
                </button>
                <button class="btn btn-edit" id="saveBtn" onclick="saveLeadChanges(${lead.id})" style="display: none;">
                    💾 Сохранить
                </button>
                <button class="btn btn-edit" id="cancelBtn" onclick="cancelEdit()" style="display: none;">
                    ❌ Отмена
                </button>
                <button class="btn btn-whatsapp" onclick="contactLead('${lead.phone}',${lead.id})">
                    💬 Написать в WhatsApp
                </button>
            `;
            
            modal.classList.add('active');
        }
        
        function toggleEditMode() {
            const modalBody = document.getElementById('modalBody');
            modalBody.classList.add('edit-mode');
            
            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('saveBtn').style.display = 'block';
            document.getElementById('cancelBtn').style.display = 'block';
            
            // Show all edit inputs
            document.querySelectorAll('.edit-input').forEach(input => {
                input.style.display = 'block';
            });
        }
        
        function cancelEdit() {
            const modalBody = document.getElementById('modalBody');
            modalBody.classList.remove('edit-mode');
            
            document.getElementById('editBtn').style.display = 'block';
            document.getElementById('saveBtn').style.display = 'none';
            document.getElementById('cancelBtn').style.display = 'none';
            
            // Hide all edit inputs
            document.querySelectorAll('.edit-input').forEach(input => {
                input.style.display = 'none';
            });
        }
        
        async function saveLeadChanges(leadId) {
            const lead = allLeads.find(l => l.id == leadId);
            if (!lead) return;
            
            // Get updated values
            const updatedData = {
                name: document.getElementById('edit-name').value,
                phone: document.getElementById('edit-phone').value,
                email: document.getElementById('edit-email').value || null,
                age: document.getElementById('edit-age').value ? parseInt(document.getElementById('edit-age').value) : null,
                stage: document.getElementById('edit-stage').value,
                main_block: document.getElementById('edit-main_block').value || null
            };
            
            try {
                if (typeof window.supabase !== 'undefined') {
                    const { createClient } = window.supabase;
                    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                    
                    const { data, error } = await supabase
                        .from('quiz_leads')
                        .update(updatedData)
                        .eq('id', leadId)
                        .select()
                        .single();
                    
                    if (error) throw error;
                    
                    // Update local data
                    Object.assign(lead, updatedData);
                    
                    console.log(`✅ Lead ${leadId} updated successfully`);
                    
                    // Refresh display
                    renderAll();
                    closeModal();
                    
                    // Show success message
                    alert('✅ Данные успешно сохранены!');
                } else {
                    throw new Error('Supabase not available');
                }
            } catch (error) {
                console.error('❌ Error saving lead:', error);
                alert('❌ Ошибка сохранения: ' + error.message);
            }
        }
        
        // Global functions
        window.toggleEditMode = toggleEditMode;
        window.cancelEdit = cancelEdit;
        window.saveLeadChanges = saveLeadChanges;
