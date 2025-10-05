const fs = require('fs');
const path = require('path');

const folders = ['quiz', 'quiz-a', 'quiz-b', 'quiz-c', 'quiz-a-uk', 'quiz-b-uk', 'quiz-c-uk'];

folders.forEach(folder => {
    const file = path.join(__dirname, folder, 'index.html');
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove duplicate closing braces and window.location lines
    const bad = `            }, { once: true });
            
            window.location.href = whatsappUrl;
        }
            }
            
            window.location.href = whatsappUrl;
        }`;
    
    const good = `            }, { once: true });
            
            window.location.href = whatsappUrl;
        }`;
    
    if (content.includes(bad)) {
        content = content.replace(bad, good);
        fs.writeFileSync(file, content);
        console.log(`✅ Fixed ${folder}`);
    } else {
        console.log(`⏭️  ${folder} already OK`);
    }
});

console.log('\n✅ All fixed!');
