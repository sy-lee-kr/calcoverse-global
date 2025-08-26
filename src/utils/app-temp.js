# 메인 앱 로직 파일 생성 (js/app.js)
@"
// MathVerse 앱 메인 로직
class MathVerseApp {
    constructor() {
        this.currentProblem = null;
        this.currentCategory = 'algebra';
        this.solvedCount = 0;
        this.correctCount = 0;
        this.totalAttempts = 0;
        this.usedProblems = new Set();
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadStats();
        this.loadRandomProblem();
    }
    
    initializeElements() {
        // DOM 요소들을 가져와서 저장
        this.elements = {
            problemType: document.getElementById('problem-type'),
            difficulty: document.getElementById('difficulty'),
            problemText: document.getElementById('problem-text'),
            answerInput: document.getElementById('answer-input'),
            checkButton: document.getElementById('check-answer'),
            nextButton: document.getElementById('next-problem'),
            hintButton: document.getElementById('hint-button'),
            result: document.getElementById('result'),
            solvedCount: document.getElementById('solved-count'),
            accuracy: document.getElementById('accuracy'),
            categoryButtons: document.querySelectorAll('.category-btn')
        };
    }
    
    attachEventListeners() {
        // 정답 확인 버튼
        this.elements.checkButton.addEventListener('click', () => this.checkAnswer());
        
        // 다음 문제 버튼
        this.elements.nextButton.addEventListener('click', () => this.loadRandomProblem());
        
        // 힌트 버튼
        this.elements.hintButton.addEventListener('click', () => this.showHint());
        
        // 입력 필드에서 Enter 키
        this.elements.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        
        // 카테고리 버튼들
        this.elements.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeCategory(e.target.dataset.category);
            });
        });
    }
    
    loadRandomProblem() {
        const categoryProblems = mathProblems[this.currentCategory];
        if (!categoryProblems || categoryProblems.length === 0) {
            this.showError('해당 카테고리에 문제가 없습니다.');
            return;
        }
        
        // 아직 풀지 않은 문제 찾기
        const availableProblems = categoryProblems.filter(p => 
            !this.usedProblems.has(`${this.currentCategory}-${p.id}`)
        );
        
        // 모든 문제를 다 풀었다면 초기화
        if (availableProblems.length === 0) {
            this.usedProblems.clear();
            this.showMessage('모든 문제를 완료했습니다! 새로운 세트를 시작합니다.', 'success');
        }
        
        // 랜덤 문제 선택
        const problemsToUse = availableProblems.length > 0 ? availableProblems : categoryProblems;
        const randomIndex = Math.floor(Math.random() * problemsToUse.length);
        this.currentProblem = problemsToUse[randomIndex];
        
        // 사용한 문제로 표시
        this.usedProblems.add(`${this.currentCategory}-${this.currentProblem.id}`);
        
        this.displayProblem();
        this.resetUI();
    }
    
    displayProblem() {
        if (!this.currentProblem) return;
        
        // 문제 카테고리와 난이도 표시
        this.elements.problemType.textContent = this.getCategoryName(this.currentCategory);
        this.elements.difficulty.textContent = this.getDifficultyLevel();
        
        // 문제 텍스트 표시
        this.elements.problemText.innerHTML = this.formatProblemText(this.currentProblem.question);
        
        // 입력 필드 포커스
        this.elements.answerInput.focus();
    }
    
    formatProblemText(text) {
        // 수학 기호나 특수 문자를 HTML로 변환
        return text
            .replace(/x²/g, 'x<sup>2</sup>')
            .replace(/x³/g, 'x<sup>3</sup>')
            .replace(/≤/g, '≤')
            .replace(/≥/g, '≥')
            .replace(/π/g, 'π');
    }
    
    getCategoryName(category) {
        const names = {
            'algebra': '대수',
            'geometry': '기하',
            'functions': '함수',
            'statistics': '통계'
        };
        return names[category] || '일반';
    }
    
    getDifficultyLevel() {
        // 간단한 난이도 계산 (문제 길이 기반)
        if (!this.currentProblem) return '중급';
        
        const length = this.currentProblem.question.length;
        if (length < 30) return '초급';
        if (length < 60) return '중급';
        return '고급';
    }
    
    checkAnswer() {
        if (!this.currentProblem) return;
        
        const userAnswer = this.elements.answerInput.value.trim();
        if (userAnswer === '') {
            this.showMessage('답을 입력해주세요.', 'warning');
            return;
        }
        
        this.totalAttempts++;
        
        // 정답 확인 (대소문자 구분 없이, 공백 제거)
        const correctAnswer = this.currentProblem.answer.toLowerCase().replace(/\s/g, '');
        const inputAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
        
        if (inputAnswer === correctAnswer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
        
        this.updateStats();
    }
    
    handleCorrectAnswer() {
        this.correctCount++;
        this.solvedCount++;
        
        this.showResult('정답입니다! 🎉', 'correct');
        this.showSolution();
        
        // 버튼 상태 변경
        this.elements.checkButton.disabled = true;
        this.elements.nextButton.style.display = 'inline-block';
        
        // 축하 효과
        this.celebrateCorrectAnswer();
    }
    
    handleIncorrectAnswer() {
        const message = `틀렸습니다. 정답은 "${this.currentProblem.answer}"입니다.`;
        this.showResult(message, 'incorrect');
        this.showSolution();
        
        // 버튼 상태 변경
        this.elements.checkButton.disabled = true;
        this.elements.nextButton.style.display = 'inline-block';
    }
    
    showResult(message, type) {
        this.elements.result.textContent = message;
        this.elements.result.className = `result ${type}`;
        this.elements.result.classList.remove('hidden');
    }
    
    showSolution() {
        if (this.currentProblem.solution) {
            const solutionDiv = document.createElement('div');
            solutionDiv.className = 'solution';
            solutionDiv.innerHTML = `<strong>풀이:</strong> ${this.currentProblem.solution}`;
            solutionDiv.style.marginTop = '10px';
            solutionDiv.style.padding = '10px';
            solutionDiv.style.backgroundColor = '#e8f4fd';
            solutionDiv.style.borderRadius = '5px';
            solutionDiv.style.fontSize = '14px';
            
            this.elements.result.appendChild(solutionDiv);
        }
    }
    
    showHint() {
        if (!this.currentProblem || !this.currentProblem.hint) {
            this.showMessage('이 문제에는 힌트가 없습니다.', 'info');
            return;
        }
        
        this.showMessage(`💡 힌트: ${this.currentProblem.hint}`, 'hint');
    }
    
    showMessage(message, type = 'info') {
        // 임시 메시지 표시
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.padding = '15px 20px';
        messageDiv.style.borderRadius = '10px';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.animation = 'slideIn 0.3s ease';
        
        // 타입별 스타일
        const styles = {
            'success': { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
            'warning': { background: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
            'error': { background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
            'info': { background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' },
            'hint': { background: '#fff8e1', color: '#8a6914', border: '1px solid #ffecb3' }
        };
        
        Object.assign(messageDiv.style, styles[type] || styles.info);
        
        document.body.appendChild(messageDiv);
        
        // 3초 후 제거
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
    
    celebrateCorrectAnswer() {
        // 간단한 축하 애니메이션
        this.elements.problemText.style.transform = 'scale(1.02)';
        this.elements.problemText.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            this.elements.problemText.style.transform = 'scale(1)';
        }, 300);
    }
    
    changeCategory(category) {
        this.currentCategory = category;
        
        // 카테고리 버튼 활성화 표시
        this.elements.categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // 해당 카테고리의 사용한 문제 초기화
        this.usedProblems.clear();
        
        this.loadRandomProblem();
    }
    
    resetUI() {
        this.elements.answerInput.value = '';
        this.elements.answerInput.disabled = false;
        this.elements.checkButton.disabled = false;
        this.elements.result.classList.add('hidden');
        this.elements.nextButton.style.display = 'none';
        
        // 기존 solution div 제거
        const existingSolution = this.elements.result.querySelector('.solution');
        if (existingSolution) {
            existingSolution.remove();
        }
    }
    
    updateStats() {
        this.elements.solvedCount.textContent = this.solvedCount;
        
        const accuracy = this.totalAttempts > 0 
            ? Math.round((this.correctCount / this.totalAttempts) * 100) 
            : 0;
        this.elements.accuracy.textContent = `${accuracy}%`;
        
        this.saveStats();
    }
    
    saveStats() {
        const stats = {
            solvedCount: this.solvedCount,
            correctCount: this.correctCount,
            totalAttempts: this.totalAttempts,
            usedProblems: Array.from(this.usedProblems)
        };
        localStorage.setItem('calcoverse-stats', JSON.stringify(stats));
    }
    
    loadStats() {
        try {
            const saved = localStorage.getItem('calcoverse-stats');
            if (saved) {
                const stats = JSON.parse(saved);
                this.solvedCount = stats.solvedCount || 0;
                this.correctCount = stats.correctCount || 0;
                this.totalAttempts = stats.totalAttempts || 0;
                this.usedProblems = new Set(stats.usedProblems || []);
                this.updateStats();
            }
        } catch (error) {
            console.log('통계 로드 실패:', error);
        }
    }
    
    showError(message) {
        this.elements.problemText.innerHTML = `<p style="color: red;">오류: ${message}</p>`;
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .message {
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MathVerseApp();
});
"@ | Out-File -FilePath "js/app.js" -Encoding UTF8