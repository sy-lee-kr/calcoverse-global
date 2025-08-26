const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class YouTubeAuth {
  constructor() {
    this.credentialsPath = path.join(__dirname, '../../credentials/credentials.json');
    this.tokenPath = path.join(__dirname, '../../credentials/token.json');
    this.oauth2Client = null;
  }

  async initialize() {
    try {
      // credentials.json 파일 확인
      if (!fs.existsSync(this.credentialsPath)) {
        throw new Error('credentials.json 파일이 없습니다. Google Cloud Console에서 다운로드하세요.');
      }

      const credentials = JSON.parse(fs.readFileSync(this.credentialsPath));
      const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

      this.oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0] || 'http://localhost:3000/oauth/callback'
      );

      // 저장된 토큰이 있는지 확인
      if (fs.existsSync(this.tokenPath)) {
        const token = JSON.parse(fs.readFileSync(this.tokenPath));
        this.oauth2Client.setCredentials(token);
        console.log('✅ 기존 토큰으로 인증 완료');
        return this.oauth2Client;
      }

      // 새 토큰 발급 필요
      console.log('🔑 새로운 인증이 필요합니다.');
      return await this.getNewToken();

    } catch (error) {
      console.error('❌ YouTube 인증 초기화 실패:', error.message);
      throw error;
    }
  }

  async getNewToken() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube'
      ]
    });

    console.log('🌐 브라우저에서 다음 URL을 열어 인증하세요:');
    console.log(authUrl);
    console.log('\n인증 코드를 복사해서 입력하세요:');

    // 실제 운영에서는 웹 서버로 처리
    return new Promise((resolve, reject) => {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('인증 코드: ', async (code) => {
        rl.close();
        try {
          const { tokens } = await this.oauth2Client.getToken(code);
          this.oauth2Client.setCredentials(tokens);

          // 토큰 저장
          fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
          console.log('✅ 토큰 저장 완료:', this.tokenPath);
          
          resolve(this.oauth2Client);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getAuthClient() {
    return this.oauth2Client;
  }
}

module.exports = YouTubeAuth;

// 직접 실행 시 테스트
if (require.main === module) {
  console.log('🔑 YouTube OAuth 인증 테스트');
  const auth = new YouTubeAuth();
  auth.initialize()
    .then(() => console.log('✅ 인증 성공!'))
    .catch(err => console.error('❌ 인증 실패:', err.message));
}
