// Secure Quiz Implementation with Supabase Integration
// This replaces the inline script in quiz/index.html

// Quiz state management
const quizState = {
    currentStep: 1,
    totalSteps: 7,
    answers: {},
    userData: {},
    startTime: Date.now(),
    blockType: null
};

// Initialize quiz when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    setupEventListeners();
    
    // Track quiz start
    if (window.SupabaseIntegration) {
        window.SupabaseIntegration.updateAnalytics('quiz_start');
    }
});

// Initialize quiz components
function initializeQuiz() {
    // Set initial progress
    updateProgress();
    
    // Show first step
    showStep(1);
    
    // Initialize Supabase if available
    if (window.SupabaseIntegration) {
        console.log('✅ Supabase Integration ready');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Option selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', handleOptionSelect);
    });
    
    // Next buttons
    for (let i = 1; i <= 6; i++) {
        const btn = document.getElementById(`btn${i}`);
        if (btn) {
            btn.addEventListener('click', () => nextStep(i));
        }
    }
    
    // Form validation button
    const validateBtn = document.getElementById('btnValidate');
    if (validateBtn) {
        validateBtn.addEventListener('click', validateAndProceed);
    }
    
    // Submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuiz);
    }
    
    // Input field listeners for real-time validation
    const emailField = document.getElementById('email');
    const nameField = document.getElementById('name');
    const whatsappField = document.getElementById('whatsapp');
    
    if (emailField) {
        emailField.addEventListener('input', () => clearError('emailError'));
    }
    if (nameField) {
        nameField.addEventListener('input', () => clearError('nameError'));
    }
    if (whatsappField) {
        whatsappField.addEventListener('input', () => clearError('whatsappError'));
    }
}

// Handle option selection
function handleOptionSelect(e) {
    const option = e.currentTarget;
    const step = option.closest('.quiz-step');
    const stepNum = parseInt(step.id.replace('step', ''));
    
    // Remove previous selection
    step.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection
    option.classList.add('selected');
    
    // Store answer
    quizState.answers[`question${stepNum}`] = option.dataset.value;
    
    // Enable next button
    const nextBtn = document.getElementById(`btn${stepNum}`);
    if (nextBtn) {
        nextBtn.disabled = false;
    }
    
    // Auto-advance for better UX (optional)
    setTimeout(() => {
        if (stepNum < 6) {
            nextStep(stepNum);
        }
    }, 300);
}

// Navigate to next step
function nextStep(fromStep) {
    if (fromStep < quizState.totalSteps) {
        hideStep(fromStep);
        showStep(fromStep + 1);
        quizState.currentStep = fromStep + 1;
        updateProgress();
        
        // If moving to results, calculate them
        if (fromStep + 1 === 7) {
            calculateResult();
        }
    }
}

// Show specific step
function showStep(stepNum) {
    const step = document.getElementById(`step${stepNum}`);
    if (step) {
        step.classList.add('active');
        step.style.display = 'block';
    }
}

// Hide specific step
function hideStep(stepNum) {
    const step = document.getElementById(`step${stepNum}`);
    if (step) {
        step.classList.remove('active');
        setTimeout(() => {
            step.style.display = 'none';
        }, 300);
    }
}

// Update progress bar
function updateProgress() {
    const progress = (quizState.currentStep / quizState.totalSteps) * 100;
    const progressBar = document.getElementById('progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    const stepIndicator = document.getElementById('stepIndicator');
    if (stepIndicator) {
        if (quizState.currentStep <= 6) {
            stepIndicator.textContent = `Шаг ${quizState.currentStep} из 7`;
        } else {
            stepIndicator.textContent = 'Ваш результат готов!';
        }
    }
}

// Validate user data and proceed
function validateAndProceed() {
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    let isValid = true;
    
    // Clear previous errors
    clearError('emailError');
    clearError('nameError');
    
    // Validate email
    if (!email) {
        showError('emailError', 'Пожалуйста, введите email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Введите корректный email адрес');
        isValid = false;
    }
    
    // Validate name
    if (!name) {
        showError('nameError', 'Пожалуйста, введите ваше имя');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Имя должно содержать минимум 2 символа');
        isValid = false;
    }
    
    if (isValid) {
        quizState.userData.email = email;
        quizState.userData.name = name;
        nextStep(6);
    }
}

// Calculate quiz result
function calculateResult() {
    const answers = quizState.answers;
    let fearCount = 0;
    let victimCount = 0;
    let worthCount = 0;
    
    // Count answer types
    Object.values(answers).forEach(answer => {
        switch(answer) {
            case 'fear':
                fearCount++;
                break;
            case 'victim':
                victimCount++;
                break;
            case 'worth':
                worthCount++;
                break;
        }
    });
    
    // Determine dominant block
    let blockType, title, description, recommendation;
    
    if (fearCount >= victimCount && fearCount >= worthCount) {
        blockType = 'fear';
        title = 'Страх больших денег';
        description = 'Вы подсознательно боитесь ответственности и изменений, которые приносят большие деньги.';
        recommendation = 'Начните с маленьких финансовых целей и постепенно увеличивайте планку.';
    } else if (victimCount >= fearCount && victimCount >= worthCount) {
        blockType = 'victim';
        title = 'Позиция жертвы';
        description = 'Вы склонны обвинять обстоятельства и других людей в своих финансовых проблемах.';
        recommendation = 'Возьмите 100% ответственность за свое финансовое положение.';
    } else {
        blockType = 'worth';
        title = 'Чувство недостойности';
        description = 'Глубоко внутри вы не верите, что достойны больших денег и успеха.';
        recommendation = 'Работайте над повышением самооценки и признанием своей ценности.';
    }
    
    // Store result
    quizState.blockType = blockType;
    quizState.userData.mainBlock = title;
    
    // Update UI
    document.getElementById('resultTitle').textContent = `Ваш главный блок: ${title}`;
    document.getElementById('resultDescription').textContent = description;
    document.getElementById('recommendation').textContent = recommendation;
}

// Submit quiz data
async function submitQuiz() {
    const whatsapp = document.getElementById('whatsapp').value.trim();
    
    // Clear previous errors
    clearError('whatsappError');
    
    // Validate WhatsApp
    if (!whatsapp) {
        showError('whatsappError', 'Пожалуйста, введите номер WhatsApp');
        return;
    }
    
    if (!isValidPhone(whatsapp)) {
        showError('whatsappError', 'Введите корректный номер телефона');
        return;
    }
    
    // Prepare submission data
    const formData = {
        name: quizState.userData.name,
        email: quizState.userData.email,
        phone: whatsapp,
        quiz_type: 'money_blocks',
        quiz_answers: quizState.answers,
        main_block: quizState.userData.mainBlock,
        quiz_completed_time: Math.floor((Date.now() - quizState.startTime) / 1000)
    };
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
        let result;
        
        // Try Supabase integration first
        if (window.SupabaseIntegration && window.SupabaseIntegration.submitQuizLead) {
            result = await window.SupabaseIntegration.submitQuizLead(formData);
        } else {
            // Fallback to direct submission
            result = await submitDirectly(formData);
        }
        
        if (result.success) {
            // Track completion
            if (window.SupabaseIntegration) {
                window.SupabaseIntegration.updateAnalytics('quiz_complete');
                window.SupabaseIntegration.trackConversion('Lead', {
                    value: 0,
                    currency: 'EUR',
                    content_name: 'Quiz Completion'
                });
            }
            
            // Show success message
            showSuccessMessage();
            
            // Redirect to WhatsApp after delay
            setTimeout(() => {
                window.location.href = `https://wa.me/34654420334?text=Здравствуйте! Я прошла тест. Мой главный блок: ${quizState.userData.mainBlock}. Хочу записаться на бесплатную консультацию.`;
            }, 3000);
        } else {
            throw new Error(result.error || 'Submission failed');
        }
    } catch (error) {
        console.error('Quiz submission error:', error);
        
        // Save to localStorage as fallback
        saveToLocalFallback(formData);
        
        // Still show success to user
        showSuccessMessage();
        
        // Still redirect to WhatsApp
        setTimeout(() => {
            window.location.href = `https://wa.me/34654420334?text=Здравствуйте! Я прошла тест. Мой главный блок: ${quizState.userData.mainBlock}. Хочу записаться на бесплатную консультацию.`;
        }, 3000);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Direct submission fallback
async function submitDirectly(formData) {
    const SUPABASE_URL = 'https://rntranckosfsnaakjrqh.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJhbmNrb3Nmc25hYWtqcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTUyNTIsImV4cCI6MjA3Mzg3MTI1Mn0.Nme48al5xSVPlD4l40z6ZPwTkSL0uC3JQ300IZu7WBA';
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/quiz_leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            throw new Error('Direct submission failed');
        }
    } catch (error) {
        console.error('Direct submission error:', error);
        return { success: false, error: error.message };
    }
}

// Save to local storage fallback
function saveToLocalFallback(formData) {
    try {
        const leads = JSON.parse(localStorage.getItem('pending_quiz_leads') || '[]');
        leads.push({
            ...formData,
            timestamp: new Date().toISOString(),
            synced: false
        });
        localStorage.setItem('pending_quiz_leads', JSON.stringify(leads));
        console.log('Lead saved to localStorage for later sync');
    } catch (error) {
        console.error('LocalStorage save error:', error);
    }
}

// Show success message
function showSuccessMessage() {
    const container = document.querySelector('.quiz-container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                <h2 style="color: var(--primary); margin-bottom: 20px;">Спасибо за прохождение теста!</h2>
                <p style="font-size: 18px; margin-bottom: 30px;">
                    Сейчас вы будете перенаправлены в WhatsApp для записи на бесплатную консультацию.
                </p>
                <div style="display: inline-block; padding: 10px 20px; background: var(--success); color: white; border-radius: 8px;">
                    Перенаправление через 3 секунды...
                </div>
            </div>
        `;
    }
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid phone number (at least 10 digits)
    return cleanPhone.length >= 10;
}

// Error handling helpers
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Export for testing
window.QuizManager = {
    quizState,
    submitQuiz,
    nextStep,
    calculateResult
};
