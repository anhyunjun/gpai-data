// AI Conversation Simulation
const conversations = [
    {
        speaker: 'Claude',
        role: 'Data Analyst',
        message: '보고합니다. 3월 분석 결과, 칸아카데미 캠페인이 CPA 7,315원으로 가장 효율적이었고, GPA 캠페인이 16,657원으로 가장 비효율적이었습니다.',
        delay: 1000
    },
    {
        speaker: 'Claude',
        role: 'Data Analyst',
        message: '모든 캠페인에 동일한 30만원이 투입되었음에도 전환수는 칸아카데미 41명, GPA 18명으로 2.3배 차이가 발생했습니다.',
        delay: 2500
    },
    {
        speaker: 'Gemini 2.5 Pro',
        role: 'AI Strategist',
        message: '매우 명확한 패턴이 보이네요. 이유를 분석해보면, 기초학습플랫폼은 명확한 학습 목표를 가진 사용자를 타겟팅하여 높은 전환율을 보였습니다.',
        delay: 4000
    },
    {
        speaker: 'Gemini 2.5 Pro',
        role: 'AI Strategist',
        message: '핵심 가설: 1) 구체적인 학습 니즈가 있는 타겟일수록 전환율이 높다, 2) 현재 균등 예산 배분은 비효율적이다',
        delay: 5500
    },
    {
        speaker: 'Claude',
        role: 'Data Analyst',
        message: '추가로 보고드립니다. 노출 대비 전환 효율성에서도 칸아카데미는 1천 노출당 4.8건, GPA는 0.7건으로 6.9배 차이를 보였습니다.',
        delay: 7000
    },
    {
        speaker: 'Gemini 2.5 Pro',
        role: 'AI Strategist',
        message: '완벽합니다. 이 데이터를 바탕으로 4주 단계별 성장 전략을 제안합니다. Week 1에 Quick Win으로 즉시 예산 재배분을 실행하면 35명의 추가 전환이 가능합니다.',
        delay: 8500
    }
];

// Add messages to chat container
function displayConversations() {
    const chatContainer = document.getElementById('chatContainer');
    
    conversations.forEach((conv, index) => {
        setTimeout(() => {
            const messageDiv = document.createElement('div');
            const isGemini = conv.speaker.includes('Gemini');
            
            messageDiv.className = `flex ${isGemini ? 'justify-end' : 'justify-start'} animate-fade-in`;
            messageDiv.innerHTML = `
                <div class="chat-bubble ${isGemini ? 'bg-purple-100' : 'bg-blue-100'} rounded-lg p-4">
                    <div class="flex items-center mb-1">
                        <span class="font-semibold ${isGemini ? 'text-purple-800' : 'text-blue-800'}">
                            ${conv.speaker}
                        </span>
                        <span class="text-xs text-gray-500 ml-2">${conv.role}</span>
                    </div>
                    <p class="text-gray-700">${conv.message}</p>
                </div>
            `;
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, conv.delay);
    });
}

// Animate numbers
function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = Math.floor(start + range * progress);
        element.textContent = value.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Start conversation simulation
    displayConversations();
    
    // Add fade-in animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    // Animate timeline items
    const timelineItems = document.querySelectorAll('.relative.flex.items-start');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
        }, 1000 + (index * 300));
    });
});