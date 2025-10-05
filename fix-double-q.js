const fs = require('fs');

['quiz-a-uk', 'quiz-b-uk', 'quiz-c-uk'].forEach(folder => {
    const file = `${folder}/index.html`;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\?\?/g, '?');
    fs.writeFileSync(file, content);
    console.log(`✅ Fixed ${folder}`);
});
