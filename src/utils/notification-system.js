const nodemailer = require('nodemailer');

class TeacherNotificationSystem {
  constructor() {
    this.approvalQueue = new Map(); // 승인 대기 중인 콘텐츠들
    this.setupEmailTransporter();
  }

  setupEmailTransporter() {
    // 이메일 설정 (실제로는 Gmail 앱 비밀번호 사용)
    this.emailTransporter = null;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'test@gmail.com') {
      this.emailTransporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('✅ 이메일 알림 시스템 초기화 완료');
    } else {
      console.log('⚠️ 이메일 시스템: 테스트 모드');
    }
  }

  async submitForApproval(contentData) {
    const approvalId = `approval_${Date.now()}`;
    
    // 승인 대기 큐에 추가
    this.approvalQueue.set(approvalId, {
      id: approvalId,
      content: contentData,
      status: 'pending',
      submittedAt: new Date(),
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2시간 후 자동 승인
    });

    // 선생님께 알림 발송
    await this.sendTeacherNotification(approvalId, contentData);

    return approvalId;
  }

  async sendTeacherNotification(approvalId, contentData) {
    console.log(`📱 선생님께 승인 요청 발송: ${approvalId}`);

    // 카카오톡 시뮬레이션
    this.sendKakaoNotification(approvalId, contentData);

    // 이메일 발송
    if (this.emailTransporter) {
      await this.sendEmailNotification(approvalId, contentData);
    } else {
      this.simulateEmailNotification(approvalId, contentData);
    }

    // 시스템 알림
    this.logNotification(approvalId, contentData);
  }

  sendKakaoNotification(approvalId, contentData) {
    console.log('📱 [카카오톡 알림 시뮬레이션]');
    console.log(`┌─ Math Shorts 승인 요청 ─┐`);
    console.log(`│ 📅 날짜: ${contentData.date || new Date().toLocaleDateString()}`);
    console.log(`│ ⏰ 시간: ${contentData.timeSlot || 'morning'}`);
    console.log(`│ 🌍 언어: ${contentData.languages || '5개 언어'}`);
    console.log(`│ 📹 영상: ${contentData.videoCount || '5개'}`);
    console.log(`│`);
    console.log(`│ 🔗 승인하기: localhost:3000/approve/${approvalId}`);
    console.log(`└─────────────────────────┘`);
  }

  async sendEmailNotification(approvalId, contentData) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // 선생님 이메일
      subject: '📚 Math Shorts 콘텐츠 승인 요청',
      html: this.generateEmailHTML(approvalId, contentData)
    };

    try {
      await this.emailTransporter.sendMail(mailOptions);
      console.log('✅ 이메일 알림 발송 완료');
    } catch (error) {
      console.log('❌ 이메일 발송 실패:', error.message);
    }
  }

  simulateEmailNotification(approvalId, contentData) {
    console.log('📧 [이메일 알림 시뮬레이션]');
    console.log('받는 사람: 선생님');
    console.log('제목: 📚 Math Shorts 콘텐츠 승인 요청');
    console.log(`내용: ${contentData.summary || '새로운 수학 문제가 생성되었습니다.'}`);
    console.log(`승인 링크: http://localhost:3000/approve/${approvalId}`);
  }

  generateEmailHTML(approvalId, contentData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #26de81; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; }
        .reject { background: #e74c3c; }
        .info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 Math Shorts 승인 요청</h1>
    </div>
    <div class="content">
        <h2>새로운 콘텐츠가 생성되었습니다</h2>
        
        <div class="info">
            <p><strong>날짜:</strong> ${contentData.date || new Date().toLocaleDateString()}</p>
            <p><strong>시간대:</strong> ${contentData.timeSlot || 'morning'}</p>
            <p><strong>문제 유형:</strong> ${contentData.topic || '일차방정식'}</p>
            <p><strong>언어 수:</strong> ${contentData.languageCount || '5개'}</p>
        </div>

        <h3>미리보기</h3>
        <p>${contentData.preview || '지민이가 피자를 3개 주문했습니다...'}</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/approve/${approvalId}?action=approve" class="button">✅ 승인하기</a>
            <a href="http://localhost:3000/approve/${approvalId}?action=reject" class="button reject">❌ 수정 요청</a>
        </div>

        <p style="font-size: 0.9em; color: #666;">
            승인하지 않으면 2시간 후 자동으로 승인됩니다.
        </p>
    </div>
</body>
</html>`;
  }

  logNotification(approvalId, contentData) {
    console.log('📝 [시스템 알림 로그]');
    console.log(`승인 ID: ${approvalId}`);
    console.log(`콘텐츠: ${JSON.stringify(contentData, null, 2)}`);
    console.log(`대기 중인 승인: ${this.approvalQueue.size}개`);
  }

  // 승인 처리
  async processApproval(approvalId, action, feedback = null) {
    const approval = this.approvalQueue.get(approvalId);
    
    if (!approval) {
      throw new Error('승인 요청을 찾을 수 없습니다.');
    }

    approval.status = action;
    approval.processedAt = new Date();
    approval.feedback = feedback;

    console.log(`🎯 승인 처리: ${approvalId} - ${action}`);

    if (action === 'approved') {
      await this.deployContent(approval.content);
      console.log('✅ 콘텐츠 자동 배포 시작');
    } else if (action === 'rejected') {
      await this.handleRejection(approval.content, feedback);
      console.log('🔄 콘텐츠 수정 요청 처리');
    }

    // 승인 완료 후 큐에서 제거
    this.approvalQueue.delete(approvalId);

    return approval;
  }

  async deployContent(content) {
    console.log('🚀 콘텐츠 자동 배포 시작...');
    console.log('📤 YouTube 업로드 시뮬레이션');
    console.log('🌍 글로벌 배포 시뮬레이션');
    console.log('📊 성과 모니터링 시작');
    
    // 실제로는 여기서 YouTube API, AWS 배포 등 실행
    return {
      deployed: true,
      timestamp: new Date(),
      platforms: ['YouTube', 'Website', 'API'],
      languages: content.languages || 5
    };
  }

  async handleRejection(content, feedback) {
    console.log('🔄 콘텐츠 수정 요청 처리...');
    console.log(`피드백: ${feedback || '수정이 필요합니다.'}`);
    
    // 실제로는 여기서 AI에게 피드백을 주고 재생성 요청
    return {
      status: 'regeneration_requested',
      feedback: feedback,
      timestamp: new Date()
    };
  }

  // 대기 중인 승인 목록
  getPendingApprovals() {
    const pending = Array.from(this.approvalQueue.values())
      .filter(approval => approval.status === 'pending');
    
    return pending;
  }

  // 자동 승인 (시간 초과)
  async processAutoApprovals() {
    const now = new Date();
    const autoApprovals = Array.from(this.approvalQueue.values())
      .filter(approval => 
        approval.status === 'pending' && 
        approval.deadline <= now
      );

    for (const approval of autoApprovals) {
      console.log(`⏰ 자동 승인: ${approval.id}`);
      await this.processApproval(approval.id, 'approved', '시간 초과로 자동 승인');
    }

    return autoApprovals.length;
  }
}

module.exports = TeacherNotificationSystem;