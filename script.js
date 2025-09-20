// Переменные для теста
let currentQuestion = 1;
let answers = {};

// Функция перехода к следующему вопросу
function nextQuestion(nextNum, answer) {
    // Сохраняем ответ
    answers[`q${currentQuestion}`] = answer;
    
    // Скрываем текущий вопрос
    document.getElementById(`q${currentQuestion}`).classList.remove('active');
    
    // Показываем следующий вопрос
    if (nextNum <= 5) {
        document.getElementById(`q${nextNum}`).classList.add('active');
        currentQuestion = nextNum;
        
        // Обновляем прогресс-бар
        const progress = (nextNum / 5) * 100;
        document.getElementById('progress').style.width = progress + '%';
    }
}

// Функция показа результата
function showResult(readiness) {
    answers['readiness'] = readiness;
    
    // Скрываем последний вопрос
    document.getElementById('q5').classList.remove('active');
    
    // Показываем форму
    document.getElementById('leadForm').style.display = 'block';
    
    // Сохраняем результаты в localStorage
    localStorage.setItem('testResults', JSON.stringify(answers));
}// Обработка формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                testResults: JSON.parse(localStorage.getItem('testResults') || '{}'),
                timestamp: new Date().toISOString()
            };
            
            // Здесь будет отправка данных на сервер
            console.log('Form data:', formData);
            
            // Отправка события в Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Денежные блоки тест',
                    content_category: 'Quiz'
                });
            }
            
            // Показываем сообщение об успехе
            form.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3 style="color: green;">✓ Спасибо!</h3>
                    <p>Ваш результат отправлен. Мы свяжемся с вами в течение 30 минут.</p>
                    <p style="margin-top: 20px;">А пока подпишитесь на Instagram:</p>
                    <a href="https://instagram.com/luba_money_flow" target="_blank" 
                       style="display: inline-block; margin-top: 10px; padding: 10px 30px; 
                              background: var(--gradient); color: white; text-decoration: none; 
                              border-radius: 25px;">
                        @luba_money_flow
                    </a>
                </div>
            `;
        });
    }
});// Прокрутка к тесту
function scrollToTest() {
    document.getElementById('test').scrollIntoView({ behavior: 'smooth' });
}

// Таймер обратного отсчета
function startTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    let hours = 23;
    let minutes = 47;
    let seconds = 15;
    
    setInterval(function() {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 23;
                }
            }
        }
        
        const display = 
            String(hours).padStart(2, '0') + ':' + 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
        
        timerElement.textContent = display;
    }, 1000);
}

// Запуск таймера при загрузке страницы
startTimer();// Анимация при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.pain-card, .testimonial-card, .week, .benefit');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Запуск анимаций
document.addEventListener('DOMContentLoaded', animateOnScroll);
