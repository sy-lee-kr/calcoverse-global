const YouTubeUploader = require('./src/utils/youtube-uploader');

async function uploadImprovedVideo() {
  try {
    const uploader = new YouTubeUploader();
    await uploader.initialize();
    
    const videoData = {
      filePath: './assets/videos/calcoverse-integer-004-final.mp4',
      title: '99%가 순서를 헷갈리는 정수 계산! 당신은 맞출 수 있나요?',
      description: `정수의 곱셈과 나눗셈 순서 문제입니다.
15초 동안 직접 풀어보세요!

문제: (-3) × 4 ÷ (-2) = ?

당신은 맞췄나요? 댓글로 알려주세요!
더 어려운 문제가 궁금하다면 구독해주세요!

#수학쇼츠 #중학생문제 #정수계산 #틀리기쉬운문제 #중학수학 #정수곱셈나눗셈 #Shorts #MathProblem #Calcoverse`,
      tags: ['수학쇼츠', '중학생문제', '정수계산', '틀리기쉬운문제', '중학수학', '정수곱셈나눗셈', 'Shorts', 'MathProblem', 'Calcoverse'],
      language: 'ko'
    };
    
    const result = await uploader.uploadShorts(videoData);
    
    if (result.success) {
      console.log('개선된 영상 업로드 성공!');
      console.log('비디오 URL:', result.url);
    } else {
      console.log('업로드 실패:', result.error);
    }
    
  } catch (error) {
    console.error('오류:', error.message);
  }
}

uploadImprovedVideo();
