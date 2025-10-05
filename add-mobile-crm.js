// ДОДАТИ МОБІЛЬНІ СТИЛІ ДЛЯ CRM
const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, 'crm', 'index.html');
let content = fs.readFileSync(crmPath, 'utf8');

// Знаходимо останню закриваючу дужку style
const lastStyleIndex = content.lastIndexOf('</style>');

const mobileStyles = `

        /* ========== MOBILE OPTIMIZATION ========== */
        
        /* Hamburger Menu Button */
        .mobile-menu-btn {
            display: none;
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 1000;
            background: var(--gradient-primary);
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .mobile-menu-btn span {
            display: block;
            width: 20px;
            height: 2px;
            background: white;
            margin: 4px auto;
            transition: 0.3s;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            
            /* Sidebar mobile */
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                width: 260px;
            }
            
            .sidebar.mobile-open {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
                padding: 70px 15px 20px;
            }
            
            /* Overlay за сайдбаром */
            .mobile-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 99;
            }
            
            .mobile-overlay.active {
                display: block;
            }
            
            /* Dashboard stats */
            .stats-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .stat-card {
                padding: 16px;
            }
            
            /* Kanban board */
            .kanban-board {
                grid-template-columns: 1fr;
                gap: 15px;
                padding: 10px;
            }
            
            .kanban-column {
                min-width: 100%;
                max-height: none;
            }
            
            /* Lead cards */
            .lead-card {
                padding: 12px;
                margin-bottom: 10px;
            }
            
            .lead-name {
                font-size: 15px;
            }
            
            .lead-info {
                font-size: 13px;
            }
            
            .lead-actions {
                flex-wrap: wrap;
                gap: 6px;
            }
            
            .action-btn {
                padding: 6px 10px;
                font-size: 12px;
                flex: 1 1 auto;
                min-width: 80px;
            }
            
            /* Header */
            .header {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
                padding: 15px;
            }
            
            .header h1 {
                font-size: 22px;
            }
            
            /* Buttons */
            .btn {
                width: 100%;
                justify-content: center;
            }
            
            /* Modal */
            .modal-content {
                width: 95%;
                max-width: none;
                padding: 20px 15px;
                max-height: 90vh;
                overflow-y: auto;
                margin: 20px auto;
            }
            
            .form-row {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .form-group input,
            .form-group select {
                font-size: 16px; /* Запобігає зуму на iOS */
            }
            
            /* Tabs */
            .tabs {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
            }
            
            .tabs::-webkit-scrollbar {
                display: none;
            }
            
            .tab {
                min-width: 100px;
                padding: 10px 15px;
                font-size: 14px;
                white-space: nowrap;
            }
            
            /* Quiz leads list */
            #quiz-leads-list,
            #archive-leads-list {
                padding: 15px;
            }
            
            .quiz-lead-card,
            .archive-lead-card {
                padding: 15px;
                margin-bottom: 12px;
            }
        }
        
        @media (max-width: 480px) {
            .main-content {
                padding: 65px 10px 15px;
            }
            
            .header h1 {
                font-size: 20px;
            }
            
            .stat-value {
                font-size: 28px;
            }
            
            .stat-label {
                font-size: 12px;
            }
            
            .lead-card {
                padding: 10px;
            }
            
            .action-btn {
                padding: 8px;
                font-size: 11px;
                min-width: 70px;
            }
            
            .modal-content {
                width: 100%;
                border-radius: 0;
                max-height: 100vh;
            }
            
            .tab {
                min-width: 80px;
                padding: 8px 12px;
                font-size: 13px;
            }
        }
    `;

const before = content.substring(0, lastStyleIndex);
const after = content.substring(lastStyleIndex);

content = before + mobileStyles + '\n    ' + after;

fs.writeFileSync(crmPath, content);
console.log('✅ Додано мобільні стилі для CRM');
