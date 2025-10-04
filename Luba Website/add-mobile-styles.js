const fs = require('fs');

const mobileCSS = `
        /* Enhanced Mobile Styles */
        @media (max-width: 640px) {
            .quiz-container {
                padding: 20px 15px;
                padding-bottom: 100px;
                max-width: 100%;
            }
            
            h2 {
                font-size: 22px !important;
                line-height: 1.3 !important;
            }
            
            .question-subtitle {
                font-size: 14px !important;
            }
            
            .options-grid {
                grid-template-columns: 1fr;
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .option-card {
                padding: 20px 15px;
                min-height: auto;
            }
            
            .option-icon {
                font-size: 28px;
            }
            
            .option-text {
                font-size: 13px;
            }
            
            .buttons-row {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                padding: 12px 15px;
                box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
                display: flex;
                gap: 8px;
                z-index: 100;
                margin: 0;
            }
            
            .btn {
                padding: 14px 20px;
                font-size: 15px;
                flex: 1;
            }
            
            .btn-secondary {
                margin-right: 0;
                padding: 14px 15px;
            }
            
            .form-group input {
                font-size: 16px; /* Prevents zoom on iOS */
                padding: 14px;
            }
            
            .whatsapp-btn {
                padding: 16px 20px;
                font-size: 16px;
            }
            
            .result-content {
                padding: 20px 15px;
            }
            
            .block-description {
                font-size: 14px;
            }
        }
        
        /* Tablet Styles */
        @media (min-width: 641px) and (max-width: 1024px) {
            .quiz-container {
                max-width: 600px;
                padding: 40px 30px;
            }
            
            .options-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        /* Small phones */
        @media (max-width: 375px) {
            h2 {
                font-size: 20px !important;
            }
            
            .option-card {
                padding: 16px 12px;
            }
            
            .btn {
                padding: 12px 16px;
                font-size: 14px;
            }
        }
        
        /* Large phones / phablets */
        @media (min-width: 376px) and (max-width: 480px) {
            .options-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* Touch improvements */
        @media (hover: none) and (pointer: coarse) {
            .option-card {
                min-height: 60px;
                padding: 18px 15px;
            }
            
            .btn {
                min-height: 48px;
            }
        }
        
        /* Safe area for iPhone X+ */
        @supports (padding: env(safe-area-inset-bottom)) {
            .buttons-row {
                padding-bottom: calc(12px + env(safe-area-inset-bottom));
            }
            
            .quiz-container {
                padding-bottom: calc(100px + env(safe-area-inset-bottom));
            }
        }
    </style>`;

const folders = ['quiz', 'quiz-a', 'quiz-b', 'quiz-c', 'quiz-a-uk', 'quiz-b-uk', 'quiz-c-uk'];

folders.forEach(folder => {
    const file = `${folder}/index.html`;
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove old mobile styles
    content = content.replace(/@media \(max-width: 640px\) \{[\s\S]*?\n        \}/g, '');
    
    // Add before closing </style>
    content = content.replace('    </style>', mobileCSS);
    
    fs.writeFileSync(file, content);
    console.log(`✅ ${folder}`);
});

console.log('\n✅ Mobile optimization complete!');
