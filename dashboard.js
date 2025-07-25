// Campaign Performance Data
const campaignData = [
    { target: '칸아카데미', spend: 299931, conversions: 41, cpa: 7315, cvr: 17.1, rank: 1 },
    { target: '쿠몬', spend: 299937, conversions: 38, cpa: 7893, cvr: 15.8, rank: 2 },
    { target: 'SAT', spend: 299973, conversions: 34, cpa: 8823, cvr: 12.0, rank: 3 },
    { target: 'AP', spend: 299965, conversions: 29, cpa: 10344, cvr: 14.1, rank: 4 },
    { target: 'ACT', spend: 299983, conversions: 28, cpa: 10714, cvr: 15.1, rank: 5 },
    { target: 'IB', spend: 299991, conversions: 19, cpa: 15789, cvr: 9.4, rank: 6 },
    { target: 'GPA', spend: 299823, conversions: 18, cpa: 16657, cvr: 8.0, rank: 7 }
];

// CPA Chart
const cpaCtx = document.getElementById('cpaChart').getContext('2d');
new Chart(cpaCtx, {
    type: 'bar',
    data: {
        labels: campaignData.map(d => d.target),
        datasets: [{
            label: 'CPA (원)',
            data: campaignData.map(d => d.cpa),
            backgroundColor: campaignData.map(d => {
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

// Conversion Share Pie Chart
const conversionCtx = document.getElementById('conversionChart').getContext('2d');
new Chart(conversionCtx, {
    type: 'doughnut',
    data: {
        labels: campaignData.map(d => d.target),
        datasets: [{
            data: campaignData.map(d => d.conversions),
            backgroundColor: [
                '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
                '#EF4444', '#EC4899', '#6B7280'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.raw / total) * 100).toFixed(1);
                        return context.label + ': ' + context.raw + '명 (' + percentage + '%)';
                    }
                }
            }
        }
    }
});

// Populate Performance Table
const tableBody = document.getElementById('performanceTable');
campaignData.forEach(campaign => {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50';
    
    let statusBadge = '';
    if (campaign.cpa <= 8000) {
        statusBadge = '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">🟢 고효율</span>';
    } else if (campaign.cpa <= 12000) {
        statusBadge = '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">🟡 보통</span>';
    } else {
        statusBadge = '<span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">🔴 개선필요</span>';
    }
    
    row.innerHTML = `
        <td class="py-3 px-4">${campaign.rank}위</td>
        <td class="py-3 px-4 font-medium">${campaign.target}</td>
        <td class="py-3 px-4 text-right">₩${campaign.spend.toLocaleString()}</td>
        <td class="py-3 px-4 text-right">${campaign.conversions}명</td>
        <td class="py-3 px-4 text-right font-semibold">₩${campaign.cpa.toLocaleString()}</td>
        <td class="py-3 px-4 text-right">${campaign.cvr}%</td>
        <td class="py-3 px-4 text-center">${statusBadge}</td>
    `;
    
    tableBody.appendChild(row);
});

// Add animation to KPI cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card-shadow');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});