const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 문제 생성기 import
const GlobalMathProblemGenerator = require('./generators/problem-generator');
const problemGenerator = new GlobalMathProblemGenerator();

// 음성 생성기 import 추가
const GlobalVoiceGenerator = require('./generators/voice-generator');
const voiceGenerator = new GlobalVoiceGenerator();

// 알림 시스템 import 추가
const TeacherNotificationSystem = require('./utils/notification-system');
const notificationSystem = new TeacherNotificationSystem();

// 워크플로우 매니저 import
const DailyWorkflowManager = require('./workflows/daily-workflow');
const workflowManager = new DailyWorkflowManager();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 메인 페이지
app.get('/', (req, res) => {
  res.json({
    message: '🧮 Math Shorts Global System',
    status: 'running',
    version: '1.0.0',
    time: new Date().toISOString(),
    features: [
      '✅ AI Problem Generation',
      '✅ Multi-language Support', 
      '✅ Voice Integration',
      '✅ Global Community',
      '✅ Weekend Exam System'
    ],
    endpoints: {
      problems: '/api/test/problem',
      weekly: '/api/generate/week',
      admin: '/admin'
    }
  });
});

// 관리자 대시보드
app.get('/admin', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Math Shorts Admin</title>
        <style>
          body { font-family: Arial; padding: 20px; background: #f5f5f5; }
          .header { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .card { background: white; padding: 20px; border-radius: 10px; margin: 10px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { background: #26de81; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
          .button:hover { background: #20bf6b; }
          .status { color: #26de81; font-weight: bold; }
          .result { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; font-family: monospace; max-height: 400px; overflow-y: auto; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧮 Math Shorts 관리자 대시보드</h1>
          <p>글로벌 수학 교육 자동화 시스템</p>
        </div>
        
        <div class="card">
          <h2>🚀 시스템 상태</h2>
          <p>서버 상태: <span class="status">정상 가동 중</span></p>
          <p>AI 문제 생성기: <span class="status">연결됨</span></p>
          <p>음성 시스템: <span class="status">5개 언어 지원</span></p>
          <p>승인 시스템: <span class="status">대기 중</span></p>
          <p>현재 시간: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
        
        <div class="card">
          <h2>🎯 기능 테스트</h2>
          <button class="button" onclick="testProblem()">📝 단일 문제 생성</button>
          <button class="button" onclick="testWeek()">📅 일주일 문제 생성</button>
          <button class="button" onclick="testVoice()">🎤 음성 생성 테스트</button>
          <button class="button" onclick="testApproval()">📱 승인 요청 테스트</button>
          <button class="button" onclick="viewStats()">📊 시스템 상태</button>
          <div id="result" class="result" style="display:none;"></div>
        </div>
        
        <div class="card">
          <h2>📈 오늘의 진행상황</h2>
          <p>✅ 서버 시작 완료</p>
          <p>✅ AI 문제 생성기 작동</p>
          <p>✅ 다국어 음성 시스템 준비</p>
          <p>✅ 승인 알림 시스템 준비</p>
          <p>🔄 영상 제작 파이프라인 구축 중</p>
        </div>
        
        <script>
          async function testProblem() {
            showLoading();
            try {
              const response = await fetch('/api/test/problem');
              const data = await response.json();
              showResult('단일 문제 생성 결과', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function testWeek() {
            showLoading();
            try {
              const response = await fetch('/api/generate/week');
              const data = await response.json();
              showResult('일주일 문제 생성 결과', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function testVoice() {
            showLoading();
            try {
              const response = await fetch('/api/voice/all');
              const data = await response.json();
              showResult('다국어 음성 생성 결과', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function testApproval() {
            showLoading();
            try {
              const response = await fetch('/api/submit-for-approval');
              const data = await response.json();
              showResult('승인 요청 결과', data);
              
              if (data.success && data.approvalUrl) {
                setTimeout(() => {
                  if (confirm('승인 페이지를 새 창에서 열까요?')) {
                    window.open(data.approvalUrl, '_blank');
                  }
                }, 2000);
              }
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function viewStats() {
            showLoading();
            try {
              const response = await fetch('/api/stats');
              const data = await response.json();
              showResult('시스템 상태', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          function showLoading() {
            const result = document.getElementById('result');
            result.style.display = 'block';
            result.innerHTML = '⏳ 처리 중...';
          }
          
          function showResult(title, data) {
            const result = document.getElementById('result');
            result.style.display = 'block';
            result.innerHTML = '<h4>' + title + '</h4><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          }
        </script>
      </body>
    </html>
  `);
});

// API 라우트들
app.get('/api/test/problem', async (req, res) => {
  try {
    console.log('🎯 단일 문제 생성 요청...');
    const problem = await problemGenerator.generateDailyProblem({
      grade: 'grade1',
      topic: '일차방정식', 
      timeSlot: 'morning',
      region: 'asia'
    });
    
    console.log('✅ 문제 생성 완료!');
    res.json({
      success: true,
      message: '✅ AI 문제 생성 성공!',
      data: problem
    });
  } catch (error) {
    console.error('❌ 문제 생성 실패:', error);
    res.json({
      success: false,
      message: '❌ 문제 생성 실패',
      error: error.message
    });
  }
});

// 음성 생성 API (수정된 버전)
app.get('/api/voice/korean', async (req, res) => {
  try {
    console.log('🎤 한국어 음성 생성 요청...');
    
    const sampleProblem = {
      problem: '지민이가 피자를 3개 주문했습니다. 배송비 5원을 포함해서 총 20원을 지불했다면, 피자 한 개의 가격은?',
      solution: {
        steps: ['3x + 5 = 20', '3x = 15', 'x = 5'],
        answer: 'x = 5원'
      }
    };
    
    const voiceResult = await voiceGenerator.generateVoiceForProblem(sampleProblem, 'ko');
    
    res.json({
      success: true,
      message: '✅ 한국어 음성 생성 완료!',
      data: voiceResult
    });
  } catch (error) {
    console.error('❌ 음성 생성 실패:', error);
    res.json({
      success: false,
      message: '❌ 음성 생성 실패',
      error: error.message
    });
  }
});

app.get('/api/voice/english', async (req, res) => {
  try {
    console.log('🎤 영어 음성 생성 요청...');
    
    const sampleProblem = {
      problem: '지민이가 피자를 3개 주문했습니다. 배송비 5원을 포함해서 총 20원을 지불했다면, 피자 한 개의 가격은?',
      solution: {
        steps: ['3x + 5 = 20', '3x = 15', 'x = 5'],
        answer: 'x = 5원'
      }
    };
    
    const voiceResult = await voiceGenerator.generateVoiceForProblem(sampleProblem, 'en');
    
    res.json({
      success: true,
      message: '✅ 영어 음성 생성 완료!',
      data: voiceResult
    });
  } catch (error) {
    console.error('❌ 음성 생성 실패:', error);
    res.json({
      success: false,
      message: '❌ 음성 생성 실패',
      error: error.message
    });
  }
});

app.get('/api/voice/all', async (req, res) => {
  try {
    console.log('🌍 다국어 음성 생성 시작...');
    
    const sampleProblem = {
      problem: '지민이가 피자를 3개 주문했습니다. 배송비 5원을 포함해서 총 20원을 지불했다면, 피자 한 개의 가격은?',
      solution: {
        steps: ['3x + 5 = 20', '3x = 15', 'x = 5'],
        answer: 'x = 5원'
      }
    };
    
    const results = await voiceGenerator.generateMultiLanguageVoices(sampleProblem);
    
    res.json({
      success: true,
      message: '✅ 다국어 음성 생성 완료!',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('❌ 다국어 음성 생성 실패:', error);
    res.json({
      success: false,
      message: '❌ 다국어 음성 생성 실패',
      error: error.message
    });
  }
});

// 승인 시스템 API
// 승인 시스템 API (GET 방식으로 수정)
app.get('/api/submit-for-approval', async (req, res) => {
  try {
    const contentData = {
      date: new Date().toLocaleDateString(),
      timeSlot: 'morning',
      topic: '일차방정식',
      languages: ['ko', 'en', 'zh', 'ja', 'es'],
      languageCount: 5,
      videoCount: 5,
      summary: '지민이가 피자를 3개 주문했습니다...',
      preview: '새로운 창의적인 수학 문제가 생성되었습니다.'
    };

    console.log('📝 승인 요청 제출...');
    const approvalId = await notificationSystem.submitForApproval(contentData);

    res.json({
      success: true,
      message: '✅ 선생님께 승인 요청을 발송했습니다!',
      approvalId: approvalId,
      approvalUrl: `http://localhost:3000/approve/${approvalId}`,
      instructions: '위 approvalUrl을 브라우저에서 열어보세요!'
    });
  } catch (error) {
    console.error('❌ 승인 요청 실패:', error);
    res.json({
      success: false,
      message: '❌ 승인 요청 실패',
      error: error.message
    });
  }
});

// 승인 처리 페이지
// 승인 처리 페이지 (문제 미리보기 포함)
app.get('/approve/:approvalId', async (req, res) => {
  const { approvalId } = req.params;
  const { action } = req.query;

  if (action) {
    // 승인/거부 처리
    try {
      const result = await notificationSystem.processApproval(approvalId, action === 'approve' ? 'approved' : 'rejected');
      
      res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
              .success { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
              .button { background: #26de81; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 10px; }
            </style>
          </head>
          <body>
            <div class="success">
              <h1>${action === 'approve' ? '✅ 승인 완료!' : '❌ 수정 요청'}</h1>
              <p>${action === 'approve' ? '콘텐츠가 자동으로 배포됩니다.' : '수정 요청이 접수되었습니다.'}</p>
              <a href="/admin" class="button">관리자 대시보드로 돌아가기</a>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      res.send(`<h1>❌ 오류: ${error.message}</h1>`);
    }
  } else {
    // 승인 페이지 표시 (문제 미리보기 포함)
    res.send(`
      <html>
        <head>
          <title>Math Shorts 콘텐츠 승인</title>
          <style>
            body { 
              font-family: Arial; 
              max-width: 1000px; 
              margin: 20px auto; 
              padding: 20px; 
              background: #f5f5f5;
            }
            .header {
              background: linear-gradient(45deg, #667eea, #764ba2);
              color: white;
              padding: 30px;
              border-radius: 15px;
              text-align: center;
              margin-bottom: 30px;
            }
            .preview-section {
              background: white;
              padding: 30px;
              border-radius: 15px;
              margin-bottom: 20px;
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .problem-card {
              background: #f8f9fa;
              border: 2px solid #e9ecef;
              border-radius: 12px;
              padding: 25px;
              margin: 20px 0;
              transition: all 0.3s ease;
            }
            .problem-card:hover {
              border-color: #667eea;
              box-shadow: 0 5px 15px rgba(102,126,234,0.1);
            }
            .equation {
              background: #667eea;
              color: white;
              padding: 20px;
              border-radius: 10px;
              font-size: 1.5em;
              text-align: center;
              margin: 15px 0;
              font-weight: bold;
            }
            .solution-steps {
              background: #e8f5e8;
              padding: 20px;
              border-radius: 10px;
              margin: 15px 0;
            }
            .step {
              padding: 8px 0;
              border-bottom: 1px solid #ddd;
            }
            .step:last-child {
              border-bottom: none;
              font-weight: bold;
              color: #26de81;
            }
            .language-tabs {
              display: flex;
              gap: 10px;
              margin-bottom: 20px;
              flex-wrap: wrap;
            }
            .tab {
              padding: 10px 20px;
              background: #e9ecef;
              border: none;
              border-radius: 20px;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .tab.active {
              background: #667eea;
              color: white;
            }
            .tab:hover {
              background: #dee2e6;
            }
            .tab.active:hover {
              background: #5a6fd8;
            }
            .voice-info {
              background: #fff3cd;
              padding: 15px;
              border-radius: 8px;
              margin: 10px 0;
              border-left: 4px solid #ffc107;
            }
            .approval-section {
              background: white;
              padding: 30px;
              border-radius: 15px;
              text-align: center;
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .approve-btn {
              background: linear-gradient(45deg, #26de81, #20bf6b);
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 25px;
              margin: 15px;
              display: inline-block;
              font-weight: bold;
              transition: transform 0.3s ease;
            }
            .approve-btn:hover {
              transform: translateY(-2px);
            }
            .reject-btn {
              background: linear-gradient(45deg, #e74c3c, #c0392b);
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            .info-card {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
            }
            .info-number {
              font-size: 2em;
              font-weight: bold;
              color: #667eea;
            }
            .hidden {
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📚 Math Shorts 콘텐츠 승인</h1>
            <p>생성된 수학 문제를 검토하고 승인해주세요</p>
          </div>
          
          <div class="preview-section">
            <h2>📋 승인 요청 정보</h2>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-number">5</div>
                <div>언어 버전</div>
              </div>
              <div class="info-card">
                <div class="info-number">15초</div>
                <div>예상 길이</div>
              </div>
              <div class="info-card">
                <div class="info-number">2</div>
                <div>시간대</div>
              </div>
              <div class="info-card">
                <div class="info-number">중1</div>
                <div>대상 학년</div>
              </div>
            </div>
          </div>

          <div class="preview-section">
            <h2>🎯 문제 미리보기</h2>
            
            <div class="language-tabs">
              <button class="tab active" onclick="showLanguage('ko')">🇰🇷 한국어</button>
              <button class="tab" onclick="showLanguage('en')">🇺🇸 English</button>
              <button class="tab" onclick="showLanguage('zh')">🇨🇳 中文</button>
              <button class="tab" onclick="showLanguage('ja')">🇯🇵 日本語</button>
              <button class="tab" onclick="showLanguage('es')">🇪🇸 Español</button>
            </div>

            <!-- 한국어 버전 -->
            <div id="preview-ko" class="problem-card">
              <h3>📝 문제 내용</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                지민이가 피자를 3개 주문했습니다. 배송비로 5원이 추가로 들어서 총 20원을 지불했다면, 피자 한 개의 가격은 얼마인가요?
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 풀이 과정</h4>
                <div class="step">1단계: 3x + 5 = 20</div>
                <div class="step">2단계: 3x = 20 - 5</div>
                <div class="step">3단계: 3x = 15</div>
                <div class="step">정답: x = 5원</div>
              </div>

              <div class="voice-info">
                <strong>🎤 음성 스크립트:</strong> "안녕하세요! 오늘의 수학 문제를 함께 풀어보겠습니다. 문제를 읽어드릴게요..."
              </div>
            </div>

            <!-- 영어 버전 -->
            <div id="preview-en" class="problem-card hidden">
              <h3>📝 Problem Content</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                Jimin ordered 3 pizzas. Including 5 won for delivery, he paid 20 won total. What is the price of one pizza?
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 Solution Steps</h4>
                <div class="step">Step 1: 3x + 5 = 20</div>
                <div class="step">Step 2: 3x = 20 - 5</div>
                <div class="step">Step 3: 3x = 15</div>
                <div class="step">Answer: x = 5 won</div>
              </div>

              <div class="voice-info">
                <strong>🎤 Voice Script:</strong> "Hello! Let's solve today's math problem together. Here is the problem..."
              </div>
            </div>

            <!-- 중국어 버전 -->
            <div id="preview-zh" class="problem-card hidden">
              <h3>📝 题目内容</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                智民订了3个比萨。包括5元配送费，总共支付了20元。一个比萨的价格是多少？
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 解题步骤</h4>
                <div class="step">第1步: 3x + 5 = 20</div>
                <div class="step">第2步: 3x = 20 - 5</div>
                <div class="step">第3步: 3x = 15</div>
                <div class="step">答案: x = 5元</div>
              </div>

              <div class="voice-info">
                <strong>🎤 语音脚本:</strong> "你好！让我们一起解决今天的数学问题..."
              </div>
            </div>

            <!-- 일본어 버전 -->
            <div id="preview-ja" class="problem-card hidden">
              <h3>📝 問題内容</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                ジミンがピザを3個注文しました。配送料5円を含めて、合計20円を支払いました。ピザ1個の価格はいくらですか？
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 解答手順</h4>
                <div class="step">ステップ1: 3x + 5 = 20</div>
                <div class="step">ステップ2: 3x = 20 - 5</div>
                <div class="step">ステップ3: 3x = 15</div>
                <div class="step">答え: x = 5円</div>
              </div>

              <div class="voice-info">
                <strong>🎤 音声スクリプト:</strong> "こんにちは！今日の数学問題を一緒に解いてみましょう..."
              </div>
            </div>

            <!-- 스페인어 버전 -->
            <div id="preview-es" class="problem-card hidden">
              <h3>📝 Contenido del Problema</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                Jimin pidió 3 pizzas. Incluyendo 5 euros de entrega, pagó 20 euros en total. ¿Cuál es el precio de una pizza?
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 Pasos de Solución</h4>
                <div class="step">Paso 1: 3x + 5 = 20</div>
                <div class="step">Paso 2: 3x = 20 - 5</div>
                <div class="step">Paso 3: 3x = 15</div>
                <div class="step">Respuesta: x = 5 euros</div>
              </div>

              <div class="voice-info">
                <strong>🎤 Guión de Voz:</strong> "¡Hola! Resolvamos juntos el problema de matemáticas de hoy..."
              </div>
            </div>
          </div>

          <div class="approval-section">
            <h2>✅ 승인 결정</h2>
            <p>위 콘텐츠를 검토하셨나요? 승인하시겠습니까?</p>
            
            <div style="margin: 30px 0;">
              <a href="/approve/${approvalId}?action=approve" class="approve-btn">✅ 승인하기</a>
              <a href="/approve/${approvalId}?action=reject" class="approve-btn reject-btn">❌ 수정 요청</a>
            </div>

            <p style="font-size: 0.9em; color: #666;">
              ⏰ 승인하지 않으면 2시간 후 자동으로 승인됩니다.<br>
              승인 ID: ${approvalId}
            </p>
          </div>

          <script>
            function showLanguage(lang) {
              // 모든 탭 비활성화
              document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
              });
              
              // 모든 미리보기 숨기기
              document.querySelectorAll('[id^="preview-"]').forEach(preview => {
                preview.classList.add('hidden');
              });
              
              // 선택된 탭 활성화
              event.target.classList.add('active');
              
              // 선택된 미리보기 표시
              document.getElementById('preview-' + lang).classList.remove('hidden');
            }
          </script>
        </body>
      </html>
    `);
  }
});

// 대기 중인 승인 목록
app.get('/api/pending-approvals', (req, res) => {
  const pending = notificationSystem.getPendingApprovals();
  
  res.json({
    success: true,
    count: pending.length,
    data: pending
  });
});

// 전체 워크플로우 테스트
app.get('/api/test/full-workflow', async (req, res) => {
  try {
    console.log('🧪 전체 워크플로우 테스트 시작...');
    const result = await workflowManager.runTestWorkflow();
    
    res.json({
      success: true,
      message: '🎉 전체 시스템 통합 테스트 완료!',
      data: result,
      nextSteps: [
        '✅ 문제 생성 시스템 작동',
        '✅ 음성 생성 시스템 작동', 
        '✅ 승인 시스템 작동',
        '🚀 실제 스케줄링 준비 완료'
      ]
    });
  } catch (error) {
    console.error('❌ 전체 워크플로우 테스트 실패:', error);
    res.json({
      success: false,
      message: '❌ 워크플로우 테스트 실패',
      error: error.message
    });
  }
});

// 자동화 스케줄 시작
app.get('/api/schedule/start', (req, res) => {
  try {
    workflowManager.startAutomationSchedule();
    
    res.json({
      success: true,
      message: '🚀 자동화 스케줄 시작됨!',
      schedule: workflowManager.getScheduleStatus()
    });
  } catch (error) {
    res.json({
      success: false,
      message: '❌ 스케줄 시작 실패',
      error: error.message
    });
  }
});

// 스케줄 상태 확인
app.get('/api/schedule/status', (req, res) => {
  const status = workflowManager.getScheduleStatus();
  
  res.json({
    success: true,
    data: status
  });
});



app.get('/api/generate/week', async (req, res) => {
  try {
    console.log('📅 일주일 문제 생성 시작...');
    const weekProblems = await problemGenerator.generateWeeklyProblems();
    
    console.log('✅ 일주일 문제 생성 완료!');
    res.json({
      success: true,
      message: '✅ 일주일 문제 생성 완료!',
      count: weekProblems.length,
      data: weekProblems
    });
  } catch (error) {
    console.error('❌ 주간 문제 생성 실패:', error);
    res.json({
      success: false,
      message: '❌ 주간 문제 생성 실패',
      error: error.message
    });
  }
});

app.get('/api/stats', (req, res) => {
  res.json({
    system: 'Math Shorts Global',
    status: '🟢 Development',
    uptime: Math.floor(process.uptime()) + '초',
    memory: {
      used: Math.round(process.memoryUsage().used / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB'
    },
    features: {
      problemGenerator: '✅ 연결됨',
      aiConnection: process.env.ANTHROPIC_API_KEY !== 'test-key' ? '✅ 실제 API' : '⚠️ 테스트 모드',
      voiceSystem: '⏳ 준비 중',
      videoSystem: '⏳ 준비 중'
    },
    timestamp: new Date().toLocaleString('ko-KR')
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log('🚀 Math Shorts Server 시작!');
  console.log(`📱 관리자 대시보드: http://localhost:${PORT}/admin`);
  console.log(`🔗 API 테스트: http://localhost:${PORT}/api/test/problem`);
  console.log(`📅 주간 생성: http://localhost:${PORT}/api/generate/week`);
  console.log(`⚡ 서버 준비 완료!`);
});

module.exports = app;