    // Export to CSV for Facebook/TikTok Lookalike
    function exportToCSV() {
        const csvHeaders = ['email', 'phone', 'fn', 'value', 'currency'];
        const csvRows = leads
            .filter(lead => lead.email) // Only leads with email
            .map(lead => [
                lead.email,
                lead.phone || '',
                lead.name || '',
                lead.amount || '2000',
                'EUR'
            ]);
        
        let csvContent = csvHeaders.join(',') + '\n';
        csvRows.forEach(row => {
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lookalike_audience_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        alert(`Экспортировано ${csvRows.length} контактов для Lookalike аудитории`);
    }