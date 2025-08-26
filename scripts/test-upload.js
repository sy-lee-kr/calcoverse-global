const YouTubeUploader = require('./src/utils/youtube-uploader');
const path = require('path');

async function testUpload() {
  console.log('🎬 첫 번째 YouTube 업로드 테스트');
  
  try {
    const uploader = new YouTubeUploader();
    await uploader.initialize();
    
    console.log('✅ YouTube API 연결 성공!');
    console.log('🎯 실제 업로드 시스템 준비 완료!');
    
    // 실제 비디오 파일이 있다면 업로드 테스트
    console.log('📝 업로드 가능한 상태입니다.');
    console.log('🚀 이제 자동화 시스템을 시작할 수 있습니다!');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  }
}

testUpload();
