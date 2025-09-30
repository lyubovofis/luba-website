const fs = require('fs');
const path = require('path');

const folders = ['quiz-a', 'quiz-b', 'quiz-c', 'quiz-a-uk', 'quiz-b-uk', 'quiz-c-uk'];

const validationCode = `        async function validateAndShowResult() {
            const name = document.getElementById('name').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // Reset errors
            document.querySelectorAll('.error-message').forEach(err => {
                err.style.display = 'none';
            });
            
            let valid = true;
            
            // Validate name
            const fakenames = ['test', 'asdf', 'qwerty', 'aaaa', 'bbbb', 'qqqq', 'wwww', 'eeee'];
            if (!name || name.length < 2) {
                document.getElementById('nameError').textContent = 'Введите ваше имя (минимум 2 буквы)';
                document.getElementById('nameError').style.display = 'block';
                valid = false;
            } else if (fakenames.includes(name.toLowerCase()) || /^\\d+$/.test(name)) {
                document.getElementById('nameError').textContent = 'Пожалуйста, введите настоящее имя';
                document.getElementById('nameError').style.display = 'block';
                valid = false;
            }
            
            // Validate phone
            const cleanPhone = whatsapp.replace(/\\D/g, '');
            if (!whatsapp || cleanPhone.length < 10) {
                document.getElementById('whatsappError').textContent = 'Введите номер телефона (минимум 10 цифр)';
                document.getElementById('whatsappError').style.display = 'block';
                valid = false;
            } else if (!whatsapp.startsWith('+')) {
                document.getElementById('whatsappError').textContent = 'Номер должен начинаться с + (например: +380501234567)';
                document.getElementById('whatsappError').style.display = 'block';
                valid = false;
            } else if (/^(\\+1{10,}|\\+9{10,}|\\+0{10,})$/.test(whatsapp)) {
                document.getElementById('whatsappError').textContent = 'Пожалуйста, введите настоящий номер телефона';
                document.getElementById('whatsappError').style.display = 'block';
                valid = false;
            }
            
            if (!valid) return;
            
            // Store contact info
            quizState.answers.name = name;
            quizState.answers.whatsapp = whatsapp;
            if (email) quizState.answers.email = email;
            
            // Calculate results
            calculateResults();
            
            // Submit to database
            try {
                await submitQuiz();
            } catch (error) {
                console.error('Error submitting quiz:', error);
                // Continue anyway - don't block user
            }
            
            // Show results
            nextStep(8);
        }`;

folders.forEach(folder => {
    const filePath = path.join(__dirname, folder, 'index.html');
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find and replace validateAndShowResult function
        const regex = /async function validateAndShowResult\(\) \{[\s\S]*?nextStep\(8\);\s*\}/;
        
        if (regex.test(content)) {
            content = content.replace(regex, validationCode);
            
            // Update placeholder
            content = content.replace(
                'placeholder="+34 600 000 000"',
                'placeholder="+380501234567" pattern="^\\+[1-9][0-9]{9,14}$"'
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated validation in ${folder}`);
        } else {
            console.log(`⚠️  Could not find validation function in ${folder}`);
        }
    }
});

console.log('\n✅ All quiz versions updated with validation!');
