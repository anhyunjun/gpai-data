// File upload functionality
let uploadedData = null;
let charts = {};

// DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const dataPreview = document.getElementById('dataPreview');
const analysisResults = document.getElementById('analysisResults');

// File upload handlers
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Handle file upload
function handleFile(file) {
    if (!file.name.endsWith('.csv')) {
        alert('CSV 파일만 업로드 가능합니다.');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
    }
    
    // Show file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = `${(file.size / 1024).toFixed(2)} KB`;
    fileInfo.classList.remove('hidden');
    
    // Parse CSV
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            uploadedData = results.data;
            showDataPreview(results);
        },
        error: function(error) {
            alert('파일 읽기 오류: ' + error.message);
        }
    });
}

// Show data preview
function showDataPreview(results) {
    const data = results.data.filter(row => Object.values(row).some(val => val)); // Remove empty rows
    
    // Update stats
    document.getElementById('totalRows').textContent = data.length;
    document.getElementById('totalCols').textContent = Object.keys(data[0] || {}).length;
    
    // Try to find date columns and show date range
    const dateColumns = ['date', '날짜', '보고 시작', '보고 종료'];
    let dates = [];
    
    for (const col of dateColumns) {
        if (data[0] && data[0][col]) {
            dates = data.map(row => row[col]).filter(Boolean);
            break;
        }
    }
    
    if (dates.length > 0) {
        document.getElementById('startDate').textContent = dates[0];
        document.getElementById('endDate').textContent = dates[dates.length - 1];
    }
    
    // Show table preview (first 5 rows)
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    // Clear existing content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Add headers
    if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
            const th = document.createElement('th');
            th.className = 'text-left py-3 px-4 font-medium text-gray-700';
            th.textContent = key;
            tableHeader.appendChild(th);
        });
        
        // Add rows (max 5)
        data.slice(0, 5).forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'border-b hover:bg-gray-50';
            
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.className = 'py-3 px-4 text-sm';
                td.textContent = value || '-';
                tr.appendChild(td);
            });
            
            tableBody.appendChild(tr);
        });
    }
    
    dataPreview.classList.remove('hidden');
}

// Remove file
document.getElementById('removeFile').addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    dataPreview.classList.add('hidden');
    uploadedData = null;
});

// Cancel analysis
document.getElementById('cancelAnalysis').addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    dataPreview.classList.add('hidden');
    uploadedData = null;
});

// Start analysis
document.getElementById('startAnalysis').addEventListener('click', () => {
    if (!uploadedData) return;
    
    analyzeData(uploadedData);
    dataPreview.classList.add('hidden');
    analysisResults.classList.remove('hidden');
});

// Analyze uploaded data
function analyzeData(data) {
    // Calculate basic metrics
    let totalSpend = 0;
    let totalConversions = 0;
    let totalClicks = 0;
    let totalImpressions = 0;
    
    // Campaign performance data
    const campaignData = {};
    
    // Process each row
    data.forEach(row => {
        // Try different column names
        const spend = parseFloat(row['지출'] || row['지출 금액 (KRW)'] || row['spend'] || 0);
        const conversions = parseFloat(row['전환'] || row['결과'] || row['conversions'] || 0);
        const clicks = parseFloat(row['클릭'] || row['클릭(전체)'] || row['clicks'] || 0);
        const impressions = parseFloat(row['노출'] || row['impressions'] || 0);
        const campaign = row['캠페인 이름'] || row['campaign_name'] || row['캠페인'] || 'Unknown';
        
        totalSpend += spend || 0;
        totalConversions += conversions || 0;
        totalClicks += clicks || 0;
        totalImpressions += impressions || 0;
        
        // Aggregate by campaign
        if (!campaignData[campaign]) {
            campaignData[campaign] = {
                spend: 0,
                conversions: 0,
                clicks: 0,
                impressions: 0
            };
        }
        
        campaignData[campaign].spend += spend || 0;
        campaignData[campaign].conversions += conversions || 0;
        campaignData[campaign].clicks += clicks || 0;
        campaignData[campaign].impressions += impressions || 0;
    });
    
    // Calculate metrics
    const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;
    const avgCVR = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    
    // Update UI
    document.getElementById('totalSpend').textContent = `₩${totalSpend.toLocaleString()}`;
    document.getElementById('totalConversions').textContent = totalConversions.toLocaleString();
    document.getElementById('avgCPA').textContent = `₩${Math.round(avgCPA).toLocaleString()}`;
    document.getElementById('avgCVR').textContent = `${avgCVR.toFixed(1)}%`;
    
    // Create charts
    createCampaignChart(campaignData);
    createDailyChart(data);
}

// Create campaign performance chart
function createCampaignChart(campaignData) {
    const ctx = document.getElementById('campaignChart').getContext('2d');
    
    // Prepare data
    const campaigns = Object.keys(campaignData);
    const cpas = campaigns.map(campaign => {
        const data = campaignData[campaign];
        return data.conversions > 0 ? data.spend / data.conversions : 0;
    });
    
    // Sort by CPA
    const sortedData = campaigns.map((campaign, i) => ({
        campaign,
        cpa: cpas[i]
    })).sort((a, b) => a.cpa - b.cpa);
    
    // Destroy existing chart
    if (charts.campaign) {
        charts.campaign.destroy();
    }
    
    charts.campaign = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(d => d.campaign.substring(0, 20) + '...'),
            datasets: [{
                label: 'CPA (원)',
                data: sortedData.map(d => d.cpa),
                backgroundColor: sortedData.map(d => {
                    if (d.cpa <= 8000) return 'rgba(34, 197, 94, 0.8)';
                    if (d.cpa <= 12000) return 'rgba(251, 191, 36, 0.8)';
                    return 'rgba(239, 68, 68, 0.8)';
                }),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₩' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Create daily trend chart
function createDailyChart(data) {
    const ctx = document.getElementById('dailyChart').getContext('2d');
    
    // Group by date
    const dailyData = {};
    
    data.forEach(row => {
        const date = row['날짜'] || row['date'] || row['보고 시작'] || 'Unknown';
        const conversions = parseFloat(row['전환'] || row['결과'] || row['conversions'] || 0);
        
        if (!dailyData[date]) {
            dailyData[date] = 0;
        }
        dailyData[date] += conversions;
    });
    
    const dates = Object.keys(dailyData).sort();
    const conversions = dates.map(date => dailyData[date]);
    
    // Destroy existing chart
    if (charts.daily) {
        charts.daily.destroy();
    }
    
    charts.daily = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '일별 전환수',
                data: conversions,
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// New upload
document.getElementById('newUpload').addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    analysisResults.classList.add('hidden');
    uploadedData = null;
    
    // Destroy charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
});

// Save analysis
document.getElementById('saveAnalysis').addEventListener('click', () => {
    const analysisData = {
        date: new Date().toISOString(),
        totalSpend: document.getElementById('totalSpend').textContent,
        totalConversions: document.getElementById('totalConversions').textContent,
        avgCPA: document.getElementById('avgCPA').textContent,
        avgCVR: document.getElementById('avgCVR').textContent,
        rawData: uploadedData
    };
    
    // Save to localStorage
    const savedAnalyses = JSON.parse(localStorage.getItem('gpaiAnalyses') || '[]');
    savedAnalyses.push(analysisData);
    localStorage.setItem('gpaiAnalyses', JSON.stringify(savedAnalyses));
    
    alert('분석 결과가 저장되었습니다!');
});