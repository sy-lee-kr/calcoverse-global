const YouTubeUploader = require('./src/utils/youtube-uploader');
const fs = require('fs');

async function uploadVideo() {
  try {
    console.log('YouTube 업로드 시작...');
    
    const uploader = new YouTubeUploader();
    await uploader.initialize();
    
    const videoData = {
      filePath: './calcoverse-shorts.mp4',
      title: 'Calcoverse - 중학생 10명 중 7명이 틀리는 정수 계산!',
      description: '정수의 덧셈과 뺄셈 문제입니다.\n15초 후 정답이 공개됩니다!\n\n#중학수학 #정수계산 #Calcoverse',
      tags: ['중학수학', '정수계산', '수학교육', 'Calcoverse'],
      language: 'ko'
    };
    
    const result = await uploader.uploadShorts(videoData);
    
    if (result.success) {
      console.log('업로드 성공!');
      console.log('비디오 URL:', result.url);
    } else {
      console.log('업로드 실패:', result.error);
    }
    
  } catch (error) {
    console.error('오류:', error.message);
  }
}

uploadVideo();
