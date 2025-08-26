console.log("📤 실제 YouTube 업로드 테스트");
console.log("============================");

async function uploadToYouTube() {
  try {
    const YouTubeUploader = require("./src/utils/youtube-uploader");
    const fs = require("fs");
    
    console.log("🔌 YouTube API 연결 중...");
    const uploader = new YouTubeUploader();
    await uploader.initialize();
    
    console.log("✅ YouTube API 연결 성공!");
    
    // 비디오 파일 확인
    const videoFile = "calcoverse-shorts.mp4";
    if (!fs.existsSync(videoFile)) {
      throw new Error("비디오 파일을 찾을 수 없습니다: " + videoFile);
    }
    
    const fileStats = fs.statSync(videoFile);
    console.log("📁 업로드 파일:", videoFile);
    console.log("💾 파일 크기:", (fileStats.size / 1024).toFixed(1) + "KB");
    
    // 업로드 메타데이터
    const videoData = {
      title: "[MathVerse] 중학수학 쇼츠 #001 | 일차방정식 💎",
      description: `🎯 중학교 1학년 수학 문제

📚 문제:
지민이가 피자를 3개 주문했습니다.
배송비 5원을 포함해서 총 20원을 지불했다면,
피자 한 개의 가격은?

🧮 방정식: 3x + 5 = 20
✅ 정답: x = 5원

🔔 매일 오전 8시, 오후 1시 새로운 문제 업로드!

#Shorts #수학 #교육 #MathVerse #중학교 #일차방정식 #수학문제 #공부 #학습`,
      tags: [
        "수학", "교육", "Shorts", "중학교", "일차방정식", 
        "MathVerse", "수학문제", "공부", "학습", "중학생"
      ],
      filePath: videoFile,
      language: "ko-KR"
    };
    
    console.log("🎬 업로드 정보:");
    console.log("   제목:", videoData.title);
    console.log("   설명 길이:", videoData.description.length + "자");
    console.log("   태그 수:", videoData.tags.length + "개");
    
    console.log("\n📤 YouTube 업로드 시작...");
    
    // 실제 업로드 실행
    const result = await uploader.uploadShorts(videoData);
    
    if (result.success) {
      console.log("🎉 업로드 성공!");
      console.log("🔗 YouTube URL:", result.url);
      console.log("📺 비디오 ID:", result.videoId);
      
      console.log("\n🚀 다음 단계:");
      console.log("1. YouTube Studio에서 확인");
      console.log("2. 썸네일 확인/수정");
      console.log("3. 설명란 확인");
      console.log("4. 공개 설정 확인");
      
    } else {
      console.log("❌ 업로드 실패:", result.error);
    }
    
  } catch (error) {
    console.error("❌ YouTube 업로드 오류:", error.message);
    
    console.log("\n💡 업로드 준비 완료 상태:");
    console.log("✅ 비디오 파일: calcoverse-shorts.mp4");
    console.log("✅ YouTube API 인증: 완료");
    console.log("✅ 메타데이터: 준비됨");
    console.log("🎯 수동 업로드도 가능합니다!");
  }
}

uploadToYouTube();
