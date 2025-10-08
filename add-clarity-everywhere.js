const fs = require('fs');

const clarityCode = `
    <!-- Microsoft Clarity - FREE & BETTER -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "tmyxczr5sn");
    </script>`;

const files = [
    'quiz-test/index.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if Clarity already added
    if (content.includes('tmyxczr5sn')) {
        console.log(`✅ ${file} - Clarity already installed`);
        return;
    }
    
    // Add after Hotjar
    if (content.includes('hotjar')) {
        content = content.replace(
            /(<\/script>\s*)(<!-- Supabase -->)/,
            `$1${clarityCode}\n    $2`
        );
        
        fs.writeFileSync(file, content);
        console.log(`✅ ${file} - Clarity added!`);
    } else {
        console.log(`⚠️  ${file} - Hotjar not found`);
    }
});

console.log('\n✅ Done! Microsoft Clarity installed everywhere.');
