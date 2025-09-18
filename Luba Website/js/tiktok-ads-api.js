// TikTok Ads API Integration
const TIKTOK_ADS_CONFIG = {
    accessToken: '', // Вставьте ваш Access Token
    advertiserId: '', // Вставьте Advertiser ID
    appId: '', // Вставьте App ID
    apiUrl: 'https://business-api.tiktok.com/open_api/v1.3'
};

// Получение статистики кампаний
async function getTikTokCampaigns() {
    const url = `${TIKTOK_ADS_CONFIG.apiUrl}/campaign/get/`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Access-Token': TIKTOK_ADS_CONFIG.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            advertiser_id: TIKTOK_ADS_CONFIG.advertiserId,
            page: 1,
            page_size: 100
        })
    });
    
    return response.json();
}

// Получение статистики по дням
async function getTikTokStats(startDate, endDate) {
    const url = `${TIKTOK_ADS_CONFIG.apiUrl}/report/integrated/get/`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Access-Token': TIKTOK_ADS_CONFIG.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            advertiser_id: TIKTOK_ADS_CONFIG.advertiserId,
            report_type: 'BASIC',
            dimensions: ['campaign_id', 'stat_time_day'],
            metrics: [
                'spend',
                'impressions', 
                'clicks',
                'conversions',
                'cost_per_conversion',
                'ctr',
                'cpm',
                'cpc'
            ],
            data_level: 'AUCTION_CAMPAIGN',
            start_date: startDate,
            end_date: endDate,
            page: 1,
            page_size: 1000
        })
    });
    
    const data = await response.json();
    return data;
}

// Анализ эффективности
async function analyzeTikTokPerformance() {
    try {
        // Получаем данные за последние 30 дней
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const stats = await getTikTokStats(startDate, endDate);
        
        if (stats.code === 0 && stats.data) {
            const report = {
                totalSpend: 0,
                totalImpressions: 0,
                totalClicks: 0,
                totalConversions: 0,
                campaigns: []
            };
            
            // Обрабатываем данные
            stats.data.list.forEach(item => {
                report.totalSpend += parseFloat(item.metrics.spend || 0);
                report.totalImpressions += parseInt(item.metrics.impressions || 0);
                report.totalClicks += parseInt(item.metrics.clicks || 0);
                report.totalConversions += parseInt(item.metrics.conversions || 0);
                
                report.campaigns.push({
                    campaignId: item.dimensions.campaign_id,
                    date: item.dimensions.stat_time_day,
                    spend: item.metrics.spend,
                    ctr: item.metrics.ctr,
                    cpc: item.metrics.cpc,
                    conversions: item.metrics.conversions,
                    costPerConversion: item.metrics.cost_per_conversion
                });
            });
            
            // Рассчитываем средние показатели
            report.avgCTR = (report.totalClicks / report.totalImpressions * 100).toFixed(2);
            report.avgCPC = (report.totalSpend / report.totalClicks).toFixed(2);
            report.avgCostPerConversion = (report.totalSpend / report.totalConversions).toFixed(2);
            report.ROAS = ((report.totalConversions * 2000) / report.totalSpend).toFixed(2); // Assuming €2000 per sale
            
            console.log('📊 TikTok Ads Analysis:', report);
            return report;
        }
    } catch (error) {
        console.error('Error fetching TikTok data:', error);
    }
}

// Экспорт для использования в CRM
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getTikTokCampaigns,
        getTikTokStats,
        analyzeTikTokPerformance
    };
}