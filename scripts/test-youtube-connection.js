const { google } = require('googleapis');
const fs = require('fs');

async function testYouTubeConnection() {
  try {
    console.log('🔌 YouTube API 연결 테스트 시작...');
    
    // 토큰 파일 확인
    const tokenPath = './credentials/token.json';
    if (!fs.existsSync(tokenPath)) {
      throw new Error('token.json 파일이 없습니다.');
    }
    
    // credentials 확인
    const credentialsPath = './credentials/credentials.json';
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const { client_secret, client_id } = credentials.web || credentials.installed;
    
    // OAuth 클라이언트 설정
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
    
    // 토큰 로드
    const tokens = JSON.parse(fs.readFileSync(tokenPath));
    oauth2Client.setCredentials(tokens);
    
    // YouTube API 클라이언트 생성
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    
    // 간단한 API 호출 테스트 (채널 정보 가져오기)
    console.log('📡 YouTube API 호출 테스트...');
    const response = await youtube.channels.list({
      part: ['snippet'],
      mine: true
    });
    
    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      console.log('✅ YouTube API 연결 성공!');
      console.log('📺 채널명:', channel.snippet.title);
      console.log('🔗 채널 ID:', channel.id);
      console.log('👥 구독자수 확인 가능');
      
      console.log('\\n🚀 업로드 준비 완료!');
      return true;
      
    } else {
      console.log('⚠️  채널 정보를 가져올 수 없습니다.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ 연결 테스트 실패:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      console.log('💡 토큰이 만료되었습니다. 재인증이 필요합니다.');
    } else if (error.message.includes('insufficient authentication')) {
      console.log('💡 인증 범위가 부족합니다. OAuth 설정을 확인하세요.');
    }
    
    return false;
  }
}

testYouTubeConnection();
