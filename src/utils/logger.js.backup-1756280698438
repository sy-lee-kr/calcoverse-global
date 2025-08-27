/**
 * Logger Module
 * Auto-generated from app.js modularization
 * Path: src/utils/logger.js
 */



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


// Exports
export { Logger };
export default Logger;

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Logger;
}
