const Anthropic = require('@anthropic-ai/sdk');

class GlobalMathProblemGenerator {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'test-key',
    });
    
    this.topics = {
      grade1: ['일차방정식', '연립방정식', '부등식'],
      grade2: ['이차방정식', '이차함수', '확률'],
      grade3: ['삼각비', '원의성질', '통계']
    };
    
    this.regions = ['asia', 'europe', 'americas'];
    this.timeSlots = ['morning', 'lunch'];
  }

  async generateDailyProblem(config = {}) {
    const {
      grade = 'grade1',
      topic = '일차방정식', 
      timeSlot = 'morning',
      region = 'asia'
    } = config;

    console.log(`🎯 문제 생성 중: ${grade} ${topic} (${timeSlot}, ${region})`);

    // Claude API 호출 (실제 키가 있으면)
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'test-key') {
      try {
        return await this.generateWithClaude(grade, topic, timeSlot, region);
      } catch (error) {
        console.log('⚠️ Claude API 호출 실패, 기본 문제 사용:', error.message);
      }
    }

    // 기본 문제 (API 키가 없을 때)
    return this.generateBasicProblem(grade, topic, timeSlot, region);
  }

  async generateWithClaude(grade, topic, timeSlot, region) {
    const prompt = `${grade} ${topic} 문제를 생성해주세요.

조건:
- 시간대: ${timeSlot} (${timeSlot === 'morning' ? '활기찬 아침용' : '점심시간용'})
- 지역: ${region} 
- 유튜브 쇼츠용 (15초)
- 실생활 연관
- 중학생 수준

JSON 형식으로 응답:
{
  "problem": "문제 내용",
  "equation": "핵심 수식", 
  "solution": {
    "steps": ["풀이단계1", "풀이단계2", "풀이단계3"],
    "answer": "최종답",
    "explanation": "간단한 설명"
  },
  "metadata": {
    "difficulty": "basic|intermediate|advanced",
    "timeEstimate": 60,
    "tags": ["태그1", "태그2"]
  }
}`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    return JSON.parse(response.content[0].text);
  }

  generateBasicProblem(grade, topic, timeSlot, region) {
    const problems = {
      '일차방정식': {
        problem: '지민이가 피자를 3개 주문했습니다. 배송비 5원을 포함해서 총 20원을 지불했다면, 피자 한 개의 가격은?',
        equation: '3x + 5 = 20',
        solution: {
          steps: [
            '3x + 5 = 20',
            '3x = 20 - 5', 
            '3x = 15',
            'x = 5'
          ],
          answer: 'x = 5원',
          explanation: '피자 한 개의 가격은 5원입니다.'
        }
      },
      '이차방정식': {
        problem: '직사각형의 가로가 x미터, 세로가 (x+2)미터일 때, 넓이가 15제곱미터라면 가로의 길이는?',
        equation: 'x(x + 2) = 15',
        solution: {
          steps: [
            'x(x + 2) = 15',
            'x² + 2x = 15',
            'x² + 2x - 15 = 0',
            '(x + 5)(x - 3) = 0',
            'x = 3 (양수 해)'
          ],
          answer: 'x = 3미터',
          explanation: '가로의 길이는 3미터입니다.'
        }
      }
    };

    const baseProblem = problems[topic] || problems['일차방정식'];
    
    return {
      ...baseProblem,
      metadata: {
        difficulty: 'basic',
        timeEstimate: 45,
        tags: [grade, topic, timeSlot, region],
        generated: new Date().toISOString(),
        source: 'basic_template'
      }
    };
  }

  async generateWeeklyProblems() {
    const problems = [];
    
    for (let day = 0; day < 5; day++) {
      const morningProblem = await this.generateDailyProblem({
        grade: 'grade1',
        topic: '일차방정식',
        timeSlot: 'morning',
        region: 'asia'
      });

      const lunchProblem = await this.generateDailyProblem({
        grade: 'grade1', 
        topic: '일차방정식',
        timeSlot: 'lunch',
        region: 'asia'
      });

      problems.push({
        day: ['월', '화', '수', '목', '금'][day],
        morning: morningProblem,
        lunch: lunchProblem
      });
    }

    return problems;
  }
}

module.exports = GlobalMathProblemGenerator;