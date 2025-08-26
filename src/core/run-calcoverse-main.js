console.log('🌅 MathVerse 워크플로우 즉시 실행');
console.log('====================================');

async function runMathVerseWorkflow() {
  try {
    console.log('1️⃣ 워크플로우 매니저 로드 중...');
    const DailyWorkflowManager = require('./src/workflows/daily-workflow');
    
    console.log('2️⃣ 워크플로우 인스턴스 생성 중...');
    const workflow = new DailyWorkflowManager();
    
    console.log('3️⃣ 컴포넌트 상태 확인...');
    console.log('   📚 문제 생성기:', workflow.problemGenerator ? '✅ 로드됨' : '❌ 오류');
    console.log('   🗣️ 음성 생성기:', workflow.voiceGenerator ? '✅ 로드됨' : '❌ 오류');
    console.log('   📧 알림 시스템:', workflow.notificationSystem ? '✅ 로드됨' : '❌ 오류');
    
    console.log('\\n4️⃣ 첫 번째 수학 문제 생성 시작...');
    
    // 문제 생성
    const problemData = {
      timeSlot: 'morning',
      grade: 'grade1',
      topic: '일차방정식'
    };
    
    console.log('   📝 문제 생성 중... (Claude AI 호출)');
    const problem = await workflow.problemGenerator.generateDailyProblem(problemData);
    
    console.log('✅ 문제 생성 완료!');
    console.log('📚 생성된 문제:');
    console.log('   제목:', problem.title || '제목 없음');
    console.log('   내용:', problem.problem ? problem.problem.substring(0, 200) + '...' : '내용 없음');
    console.log('   정답:', problem.answer || '정답 없음');
    
    console.log('\\n5️⃣ 다국어 음성 생성 시작...');
    console.log('   🗣️ 음성 생성 중... (Google TTS 호출)');
    
    const voices = await workflow.voiceGenerator.generateMultiLanguageVoices(problem);
    
    console.log('✅ 음성 생성 완료!');
    console.log('🌍 생성된 언어:', voices.length + '개');
    voices.forEach((voice, index) => {
      console.log(\   \. \: \ bytes\);
    });
    
    console.log('\\n6️⃣ 선생님 승인 요청 발송...');
    
    const contentData = {
      type: 'morning_problem',
      date: new Date().toLocaleDateString(),
      timeSlot: 'morning',
      problem: problem,
      voices: voices,
      languages: voices.map(v => v.language),
      languageCount: voices.length,
      preview: problem.problem ? problem.problem.substring(0, 100) + '...' : '미리보기 없음'
    };
    
    console.log('   📧 카톡/이메일 알림 발송 중...');
    const approvalId = await workflow.notificationSystem.submitForApproval(contentData);
    
    console.log('✅ 승인 요청 발송 완료!');
    console.log('🔑 승인 ID:', approvalId);
    
    console.log('\\n🎉 첫 번째 MathVerse 쇼츠 생성 완료!');
    console.log('📧 선생님의 승인을 기다리고 있습니다...');
    console.log('✅ 승인 후 YouTube에 자동 업로드됩니다!');
    
    return {
      success: true,
      approvalId: approvalId,
      problem: problem,
      voices: voices.length
    };
    
  } catch (error) {
    console.error('❌ 워크플로우 실행 실패:', error.message);
    console.error('📍 오류 위치:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 워크플로우 실행
runMathVerseWorkflow()
  .then(result => {
    if (result.success) {
      console.log('\\n🎯 다음 단계:');
      console.log('1. 카톡이나 이메일에서 승인 링크 확인');
      console.log('2. 승인 후 YouTube 업로드 자동 실행');
      console.log('3. 오후 1시에 두 번째 쇼츠 자동 생성');
    } else {
      console.log('\\n🔧 문제 해결이 필요합니다:', result.error);
    }
  })
  .catch(err => console.error('💥 치명적 오류:', err));
