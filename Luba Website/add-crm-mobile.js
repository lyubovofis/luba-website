const fs = require('fs');

const crmMobileCSS = `
        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
            .container {
                padding: 15px;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }
            
            .kanban-board {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .kanban-column {
                min-height: auto;
                max-width: 100%;
            }
        }
        
        @media (max-width: 640px) {
            .header {
                flex-direction: column;
                gap: 15px;
                padding: 15px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .stat-card {
                padding: 16px;
            }
            
            .stat-value {
                font-size: 28px;
            }
            
            .lead-card {
                padding: 12px;
            }
            
            .lead-name {
                font-size: 15px;
            }
            
            .lead-actions {
                flex-wrap: wrap;
                gap: 6px;
            }
            
            .action-btn {
                padding: 6px 10px;
                font-size: 11px;
            }
            
            .modal {
                padding: 15px;
            }
            
            .modal-content {
                width: 95%;
                max-width: none;
                padding: 20px 15px;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .tabs {
                overflow-x: auto;
                flex-wrap: nowrap;
            }
            
            .tab {
                min-width: 80px;
                padding: 8px 12px;
                font-size: 13px;
            }
        }
        
        @media (max-width: 375px) {
            .header h1 {
                font-size: 20px;
            }
            
            .stat-value {
                font-size: 24px;
            }
            
            .stat-label {
                font-size: 11px;
            }
        }
        
        /* Touch improvements */
        @media (hover: none) and (pointer: coarse) {
            .action-btn,
            .btn {
                min-height: 44px;
                min-width: 44px;
            }
            
            .lead-card {
                min-height: 60px;
            }
            
            .tab {
                min-height: 44px;
            }
        }
        
        /* iPhone X+ safe area */
        @supports (padding: env(safe-area-inset-bottom)) {
            .container {
                padding-bottom: calc(20px + env(safe-area-inset-bottom));
            }
        }
    </style>`;

const file = 'crm/index.html';
let content = fs.readFileSync(file, 'utf8');

// Add before closing </style>
content = content.replace(/    <\/style>/g, crmMobileCSS);

fs.writeFileSync(file, content);
console.log('✅ CRM mobile optimization complete!');
