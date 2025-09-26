// Supabase Integration for Денежный Водопад
// This file handles all database interactions with proper error handling

// Supabase Configuration
const SUPABASE_URL = 'https://rntranckosfsnaakjrqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJhbmNrb3Nmc25hYWtqcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTUyNTIsImV4cCI6MjA3Mzg3MTI1Mn0.Nme48al5xSVPlD4l40z6ZPwTkSL0uC3JQ300IZu7WBA';

// Initialize Supabase Client
let supabaseClient;

// Initialize function
function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        const { createClient } = window.supabase;
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized successfully');
        return true;
    } else {
        console.error('❌ Supabase library not loaded');
        return false;
    }
}

// Submit Quiz Lead Function
async function submitQuizLead(formData) {
    try {
        if (!supabaseClient) {
            if (!initSupabase()) {
                throw new Error('Failed to initialize Supabase');
            }
        }

        // Prepare data for submission
        const leadData = {
            name: formData.name || 'Не указано',
            email: formData.email || null,
            phone: formData.phone || null,
            age: formData.age || null,
            quiz_type: formData.quiz_type || 'main',
            quiz_answers: formData.quiz_answers || {},
            main_block: formData.main_block || null,
            utm_source: getUTMParameter('utm_source'),
            utm_medium: getUTMParameter('utm_medium'),
            utm_campaign: getUTMParameter('utm_campaign')
        };

        // Call the database function
        const { data, error } = await supabaseClient
            .rpc('submit_quiz_lead', leadData);

        if (error) {
            console.error('Database error:', error);
            // Fallback to direct insert if function fails
            return await directInsertLead(leadData);
        }

        // Track conversion events
        trackConversion('QuizComplete', leadData);
        
        return {
            success: true,
            data: data,
            message: data.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.'
        };

    } catch (error) {
        console.error('Error submitting quiz lead:', error);
        // Try fallback method
        return await fallbackSubmission(formData);
    }
}

// Direct insert fallback
async function directInsertLead(leadData) {
    try {
        // Insert into quiz_leads table
        const { data: quizLead, error: quizError } = await supabaseClient
            .from('quiz_leads')
            .insert([leadData])
            .select()
            .single();

        if (quizError) throw quizError;

        // Also insert into CRM leads
        const crmData = {
            ...leadData,
            source: leadData.utm_source || 'quiz',
            stage: 'new',
            status: 'active'
        };

        const { data: crmLead, error: crmError } = await supabaseClient
            .from('crm_leads')
            .insert([crmData])
            .select()
            .single();

        return {
            success: true,
            data: { quiz_lead: quizLead, crm_lead: crmLead },
            message: 'Спасибо! Мы свяжемся с вами в ближайшее время.'
        };

    } catch (error) {
        console.error('Direct insert error:', error);
        throw error;
    }
}

// Fallback submission using fetch API
async function fallbackSubmission(formData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/quiz_leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                age: formData.age,
                quiz_type: formData.quiz_type,
                quiz_answers: formData.quiz_answers,
                main_block: formData.main_block,
                utm_source: getUTMParameter('utm_source'),
                utm_medium: getUTMParameter('utm_medium'),
                utm_campaign: getUTMParameter('utm_campaign')
            })
        });

        if (response.ok) {
            return {
                success: true,
                message: 'Спасибо! Мы свяжемся с вами в ближайшее время.'
            };
        } else {
            throw new Error('Fallback submission failed');
        }
    } catch (error) {
        console.error('Fallback submission error:', error);
        // Last resort - save to localStorage
        saveToLocalStorage(formData);
        return {
            success: true,
            message: 'Спасибо! Мы обработаем вашу заявку.'
        };
    }
}

// Track landing page analytics
async function trackPageVisit() {
    try {
        if (!supabaseClient) initSupabase();

        const visitData = {
            page_url: window.location.href,
            visitor_id: getVisitorId(),
            ip_address: null, // Will be captured server-side
            user_agent: navigator.userAgent,
            referrer: document.referrer,
            utm_source: getUTMParameter('utm_source'),
            utm_medium: getUTMParameter('utm_medium'),
            utm_campaign: getUTMParameter('utm_campaign'),
            utm_term: getUTMParameter('utm_term'),
            utm_content: getUTMParameter('utm_content')
        };

        const { data, error } = await supabaseClient
            .rpc('track_landing_visit', visitData);

        if (!error && data) {
            sessionStorage.setItem('analytics_id', data.id);
        }
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

// Update analytics on quiz interaction
async function updateAnalytics(event, data = {}) {
    try {
        const analyticsId = sessionStorage.getItem('analytics_id');
        if (!analyticsId || !supabaseClient) return;

        const updates = {};
        
        switch(event) {
            case 'quiz_start':
                updates.quiz_started = true;
                break;
            case 'quiz_complete':
                updates.quiz_completed = true;
                break;
            case 'conversion':
                updates.conversion = true;
                break;
        }

        if (data.timeOnPage) {
            updates.time_on_page = data.timeOnPage;
        }

        await supabaseClient
            .from('landing_analytics')
            .update(updates)
            .eq('id', analyticsId);

    } catch (error) {
        console.error('Analytics update error:', error);
    }
}

// Schedule consultation
async function scheduleConsultation(formData) {
    try {
        if (!supabaseClient) initSupabase();

        const { data, error } = await supabaseClient
            .rpc('schedule_consultation', {
                p_name: formData.name,
                p_email: formData.email,
                p_phone: formData.phone,
                p_scheduled_at: formData.scheduled_at,
                p_type: formData.type || 'free'
            });

        if (error) throw error;

        trackConversion('ConsultationScheduled', formData);
        
        return {
            success: true,
            data: data,
            message: data.message || 'Консультация успешно запланирована!'
        };

    } catch (error) {
        console.error('Consultation scheduling error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Get active packages for display
async function getActivePackages() {
    try {
        if (!supabaseClient) initSupabase();

        const { data, error } = await supabaseClient
            .rpc('get_active_packages');

        if (error) throw error;

        return data.packages || [];

    } catch (error) {
        console.error('Error fetching packages:', error);
        // Return default packages if database fails
        return getDefaultPackages();
    }
}

// Default packages fallback
function getDefaultPackages() {
    return [
        {
            name: 'Денежная Трансформация',
            description: 'Базовый пакет для трансформации денежного мышления',
            price: 2000,
            currency: 'EUR',
            sessions_count: 8,
            duration_weeks: 8,
            features: {
                features: [
                    '8 индивидуальных сессий',
                    'Проработка денежных блоков',
                    'Домашние задания',
                    'Поддержка в WhatsApp',
                    'Бонусные материалы'
                ]
            }
        },
        {
            name: 'Дело Жизни + Деньги',
            description: 'Расширенный пакет с поиском предназначения',
            price: 2500,
            currency: 'EUR',
            sessions_count: 10,
            duration_weeks: 10,
            features: {
                features: [
                    '10 индивидуальных сессий',
                    'Поиск предназначения',
                    'Монетизация талантов',
                    'Проработка денежных блоков',
                    'Поддержка в WhatsApp 24/7',
                    'Персональный план развития'
                ]
            }
        }
    ];
}

// Utility Functions

// Get or create visitor ID
function getVisitorId() {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
        visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
}

// Get UTM parameter
function getUTMParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || sessionStorage.getItem(param) || null;
}

// Save UTM parameters to session
function saveUTMParameters() {
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const urlParams = new URLSearchParams(window.location.search);
    
    utmParams.forEach(param => {
        const value = urlParams.get(param);
        if (value) {
            sessionStorage.setItem(param, value);
        }
    });
}

// Save to localStorage as last resort
function saveToLocalStorage(data) {
    try {
        const leads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
        leads.push({
            ...data,
            timestamp: new Date().toISOString(),
            synced: false
        });
        localStorage.setItem('pending_leads', JSON.stringify(leads));
    } catch (error) {
        console.error('LocalStorage save error:', error);
    }
}

// Sync pending leads when connection restored
async function syncPendingLeads() {
    try {
        const leads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
        const unsynced = leads.filter(lead => !lead.synced);
        
        if (unsynced.length === 0) return;
        
        if (!supabaseClient) initSupabase();
        
        for (const lead of unsynced) {
            try {
                await submitQuizLead(lead);
                lead.synced = true;
            } catch (error) {
                console.error('Failed to sync lead:', error);
            }
        }
        
        localStorage.setItem('pending_leads', JSON.stringify(leads));
    } catch (error) {
        console.error('Sync error:', error);
    }
}

// Track conversion events
function trackConversion(eventName, data = {}) {
    try {
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, data);
        }
        
        // TikTok Pixel
        if (typeof ttq !== 'undefined') {
            ttq.track(eventName, data);
        }
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'Conversion',
                'event_label': data.source || 'Website',
                'value': data.value || 0
            });
        }
    } catch (error) {
        console.error('Tracking error:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Save UTM parameters
    saveUTMParameters();
    
    // Track page visit
    trackPageVisit();
    
    // Try to sync pending leads
    syncPendingLeads();
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
        updateAnalytics('time_update', { timeOnPage });
    });
});

// Export functions for use in other scripts
window.SupabaseIntegration = {
    submitQuizLead,
    scheduleConsultation,
    getActivePackages,
    trackPageVisit,
    updateAnalytics,
    trackConversion
};
