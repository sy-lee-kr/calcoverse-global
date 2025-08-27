/**
 * problem-manager.js 오류 수정 스크립트
 * HTML 코드가 섞여있는 문제 해결
 */

const fs = require('fs');
const path = require('path');

// 올바른 problem-manager.js 내용
const correctProblemManagerJs = `/**
 * Problem Manager Module
 * Auto-generated from app.js modularization
 * Path: src/core/problem-manager.js
 */

import { Logger } from '../utils/logger.js';

export class ProblemManager {
  constructor() {
    this.problems = [];
    this.currentIndex = 0;
    this.categories = new Map();
    this.logger = new Logger('ProblemManager');
  }

  async initialize() {
    this.logger.info('Initializing ProblemManager...');
    await this.loadProblems();
    this.logger.info('ProblemManager initialized');
  }

  async loadProblems() {
    try {
      // DataLoader에서 문제 데이터 가져오기
      const dataLoader = this.core?.getModule('dataLoader');
      if (dataLoader) {
        const data = await dataLoader.getData();
        if (data && data.problems) {
          this.problems = data.problems;
          this.organizeProblemsByCategory();
        }
      } else {
        // 기본 문제 데이터 사용
        this.problems = this.getDefaultProblems();
      }
      
      this.logger.info(\`Loaded \${this.problems.length} problems\`);
    } catch (error) {
      this.logger.error('Failed to load problems:', error);
      this.problems = this.getDefaultProblems();
    }
  }

  getDefaultProblems() {
    return [
      {
        id: 'integer-001',
        category: '정수와 유리수',
        title: '정수의 덧셈',
        question: '다음을 계산하시오: (-3) + 5',
        answer: '2',
        difficulty: 1
      },
      {
        id: 'integer-002',
        category: '정수와 유리수',
        title: '정수의 뺄셈',
        question: '다음을 계산하시오: 7 - (-2)',
        answer: '9',
        difficulty: 1
      },
      {
        id: 'integer-003',
        category: '정수와 유리수',
        title: '정수의 곱셈',
        question: '다음을 계산하시오: (-4) × 3',
        answer: '-12',
        difficulty: 2
      }
    ];
  }

  organizeProblemsByCategory() {
    this.categories.clear();
    
    this.problems.forEach(problem => {
      const category = problem.category || 'Uncategorized';
      
      if (!this.categories.has(category)) {
        this.categories.set(category, []);
      }
      
      this.categories.get(category).push(problem);
    });
    
    this.logger.info(\`Organized into \${this.categories.size} categories\`);
  }

  getNextProblem() {
    if (this.problems.length === 0) {
      this.logger.warn('No problems available');
      return null;
    }
    
    if (this.currentIndex >= this.problems.length) {
      this.currentIndex = 0;
    }
    
    const problem = this.problems[this.currentIndex];
    this.currentIndex++;
    
    this.logger.info(\`Getting problem: \${problem.id}\`);
    return problem;
  }

  getPreviousProblem() {
    if (this.problems.length === 0) {
      this.logger.warn('No problems available');
      return null;
    }
    
    this.currentIndex--;
    
    if (this.currentIndex < 0) {
      this.currentIndex = this.problems.length - 1;
    }
    
    const problem = this.problems[this.currentIndex];
    this.logger.info(\`Getting problem: \${problem.id}\`);
    return problem;
  }

  getProblemById(id) {
    const problem = this.problems.find(p => p.id === id);
    
    if (!problem) {
      this.logger.warn(\`Problem not found: \${id}\`);
    }
    
    return problem;
  }

  getProblemsByCategory(category) {
    return this.categories.get(category) || [];
  }

  getAllCategories() {
    return Array.from(this.categories.keys());
  }

  validateAnswer(problemId, userAnswer) {
    const problem = this.getProblemById(problemId);
    
    if (!problem) {
      this.logger.error(\`Cannot validate answer for unknown problem: \${problemId}\`);
      return false;
    }
    
    const isCorrect = problem.answer === userAnswer;
    
    this.logger.info(\`Answer validation for \${problemId}: \${isCorrect ? 'Correct' : 'Incorrect'}\`);
    
    // 이벤트 발생 (core가 있는 경우)
    if (this.core) {
      this.core.emit('answerSubmitted', {
        problemId,
        userAnswer,
        isCorrect,
        correctAnswer: problem.answer
      });
    }
    
    return isCorrect;
  }

  getStatistics() {
    return {
      totalProblems: this.problems.length,
      totalCategories: this.categories.size,
      currentIndex: this.currentIndex,
      categoriesBreakdown: Array.from(this.categories.entries()).map(([name, problems]) => ({
        name,
        count: problems.length
      }))
    };
  }

  async start() {
    this.logger.info('ProblemManager started');
    if (this.problems.length === 0) {
      await this.loadProblems();
    }
  }

  async stop() {
    this.logger.info('ProblemManager stopped');
    this.currentIndex = 0;
  }
}

// Exports
export default ProblemManager;

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProblemManager;
}`;

// 실행 함수
async function fixProblemManager() {
  console.log('=================================');
  console.log('Problem Manager 오류 수정');
  console.log('=================================\n');
  
  try {
    const problemManagerPath = path.join('src', 'core', 'problem-manager.js');
    
    // 백업
    if (fs.existsSync(problemManagerPath)) {
      const backupPath = problemManagerPath + '.backup-' + Date.now();
      fs.copyFileSync(problemManagerPath, backupPath);
      console.log('✅ 기존 파일 백업 완료:', backupPath);
    }
    
    // 새 파일 작성
    fs.writeFileSync(problemManagerPath, correctProblemManagerJs, 'utf8');
    console.log('✅ problem-manager.js 수정 완료\n');
    
    console.log('다음 명령어를 실행하세요:\n');
    console.log('1. 앱 실행:');
    console.log('   npm start\n');
    
    console.log('2. HTML 파일 확인:');
    console.log('   start problem-integer-003-question.html\n');
    
    console.log('3. 모든 변경사항 커밋:');
    console.log('   git add .');
    console.log('   git commit -m "fix: problem-manager.js HTML 코드 제거"');
    console.log('   git push --set-upstream origin main\n');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

// 실행
if (require.main === module) {
  fixProblemManager();
}

module.exports = { fixProblemManager };