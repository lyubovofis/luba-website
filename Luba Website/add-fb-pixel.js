const fs = require('fs');
const path = require('path');

const fbPixelCode = `    <!-- Facebook Pixel -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '2067039850492790');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=2067039850492790&ev=PageView&noscript=1"
    /></noscript>
    
`;

const folders = ['quiz-a', 'quiz-b', 'quiz-c', 'quiz-a-uk', 'quiz-b-uk', 'quiz-c-uk'];

folders.forEach(folder => {
    const filePath = path.join(__dirname, folder, 'index.html');
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if FB Pixel already exists
        if (!content.includes('fbq(\'init\'')) {
            // Insert before Hotjar
            content = content.replace(
                '    <!-- Hotjar -->',
                fbPixelCode + '    <!-- Hotjar -->'
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added FB Pixel to ${folder}`);
        } else {
            console.log(`⏭️  ${folder} already has FB Pixel`);
        }
    }
});

console.log('\n✅ All quiz versions updated!');
