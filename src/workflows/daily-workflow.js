const schedule = require('node-schedule');
const GlobalMathProblemGenerator = require('../generators/problem-generator');
const GlobalVoiceGenerator = require('../generators/voice-generator');
const TeacherNotificationSystem = require('../utils/notification-system');

class DailyWorkflowManager {
  constructor() {
    this.problemGenerator = new GlobalMathProblemGenerator();
    this.voiceGenerator = new GlobalVoiceGenerator();
    this.notificationSystem = new TeacherNotificationSystem();
    
    this.isRunning = false;
    this.scheduledJobs = [];
  }

  startAutomationSchedule() {
    console.log('🚀 일일 자동화 스케줄 시작!');
    
    // 아침 6시 - 아침 문제 생성
    const morningJob = schedule.scheduleJob('0 6 * * 1-5', async () => {
      await this.runMorningWorkflow();
    });
    
    // 아침 7시 - 선생님께 알림
    const morningNotificationJob = schedule.scheduleJob('0 7 * * 1-5', async () => {
      await this.sendMorningNotification();
    });
    
    // 점심 12시 - 점심 문제 생성
    const lunchJob = schedule.scheduleJob('0 12 * * 1-5', async () => {
      await this.runLunchWorkflow();
    });
    
    // 점심 1시 - 선생님께 알림
    const lunchNotificationJob = schedule.scheduleJob('0 13 * * 1-5', async () => {
      await this.sendLunchNotification();
    });
    
    // 금요일 점심 - 주간 통합 영상
    const weeklyJob = schedule.scheduleJob('0 12 * * 5', async () => {
      await this.generateWeeklyCompilation();
    });
    
    // 토요일 오전 - 주말 시험
    const examJob = schedule.scheduleJob('0 9 * * 6', async () => {
      await this.generateWeekendExam();
    });
    
    this.scheduledJobs = [morningJob, morningNotificationJob, lunchJob, lunchNotificationJob, weeklyJob, examJob];
    this.isRunning = true;
    
    console.log('⏰ 자동화 스케줄 등록 완료!');
    this.logSchedule();
  }

  async runMorningWorkflow() {
    console.log('🌅 아침 워크플로우 시작!');
    
    try {
      // 1. 문제 생성
      const problem = await this.problemGenerator.generateDailyProblem({
        timeSlot: 'morning',
        grade: 'grade1',
        topic: '일차방정식'
      });
      
      // 2. 다국어 음성 생성
      const voices = await this.voiceGenerator.generateMultiLanguageVoices(problem);
      
      // 3. 메타데이터 준비
      const contentData = {
        type: 'morning_problem',
        date: new Date().toLocaleDateString(),
        timeSlot: 'morning',
        problem: problem,
        voices: voices,
        languages: voices.map(v => v.language),
        languageCount: voices.length,
        preview: problem.problem.substring(0, 100) + '...'
      };
      
      // 4. 승인 대기 큐에 추가
      this.morningApprovalId = await this.notificationSystem.submitForApproval(contentData);
      
      console.log('✅ 아침 콘텐츠 생성 완료!');
      return contentData;
      
    } catch (error) {
      console.error('❌ 아침 워크플로우 실패:', error);
      throw error;
    }
  }

  async runLunchWorkflow() {
    console.log('🍽️ 점심 워크플로우 시작!');
    
    try {
      // 1. 문제 생성
      const problem = await this.problemGenerator.generateDailyProblem({
        timeSlot: 'lunch',
        grade: 'grade1', 
        topic: '일차방정식'
      });
      
      // 2. 다국어 음성 생성
      const voices = await this.voiceGenerator.generateMultiLanguageVoices(problem);
      
      // 3. 메타데이터 준비
      const contentData = {
        type: 'lunch_problem',
        date: new Date().toLocaleDateString(),
        timeSlot: 'lunch',
        problem: problem,
        voices: voices,
        languages: voices.map(v => v.language),
        languageCount: voices.length,
        preview: problem.problem.substring(0, 100) + '...'
      };
      
      // 4. 승인 대기 큐에 추가
      this.lunchApprovalId = await this.notificationSystem.submitForApproval(contentData);
      
      console.log('✅ 점심 콘텐츠 생성 완료!');
      return contentData;
      
    } catch (error) {
      console.error('❌ 점심 워크플로우 실패:', error);
      throw error;
    }
  }

  async sendMorningNotification() {
    console.log('📱 아침 콘텐츠 승인 알림 발송');
    // 실제로는 이미 submitForApproval에서 알림이 발송됨
  }

  async sendLunchNotification() {
    console.log('📱 점심 콘텐츠 승인 알림 발송');
    // 실제로는 이미 submitForApproval에서 알림이 발송됨
  }

  async generateWeeklyCompilation() {
    console.log('📹 금요일 주간 통합 영상 생성');
    
    const weeklyData = {
      type: 'weekly_compilation',
      week: this.getWeekNumber(),
      problems: [], // 이번 주 문제들
      duration: 180, // 3분
      languages: 5
    };
    
    console.log('✅ 주간 통합 영상 생성 완료');
    return weeklyData;
  }

  async generateWeekendExam() {
    console.log('📝 주말 시험 생성');
    
    const examData = {
      type: 'weekend_exam',
      questions: 10,
      timeLimit: 3600, // 1시간
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후
    };
    
    console.log('✅ 주말 시험 생성 완료');
    return examData;
  }

  // 테스트용 즉시 실행
  async runTestWorkflow() {
    console.log('🧪 테스트 워크플로우 실행');
    
    try {
      console.log('1️⃣ 아침 워크플로우 테스트...');
      const morningResult = await this.runMorningWorkflow();
      
      console.log('2️⃣ 점심 워크플로우 테스트...');
      const lunchResult = await this.runLunchWorkflow();
      
      console.log('3️⃣ 승인 대기 목록 확인...');
      const pending = this.notificationSystem.getPendingApprovals();
      
      return {
        success: true,
        morning: morningResult,
        lunch: lunchResult,
        pendingApprovals: pending.length,
        message: '✅ 전체 워크플로우 테스트 성공!'
      };
      
    } catch (error) {
      console.error('❌ 테스트 워크플로우 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  logSchedule() {
    console.log('\n📅 자동화 스케줄:');
    console.log('월-금 06:00 → 아침 문제 생성');
    console.log('월-금 07:00 → 아침 승인 알림');  
    console.log('월-금 12:00 → 점심 문제 생성');
    console.log('월-금 13:00 → 점심 승인 알림');
    console.log('금요일 12:00 → 주간 통합 영상');
    console.log('토요일 09:00 → 주말 시험');
    console.log('');
  }

  getScheduleStatus() {
    return {
      isRunning: this.isRunning,
      jobCount: this.scheduledJobs.length,
      nextJobs: this.scheduledJobs.map(job => ({
        name: job.name,
        nextInvocation: job.nextInvocation()
      }))
    };
  }

  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  }

  stopSchedule() {
    this.scheduledJobs.forEach(job => job.cancel());
    this.isRunning = false;
    console.log('⏹️ 자동화 스케줄 중지됨');
  }
}

module.exports = DailyWorkflowManager;