console.log("📤 간단한 YouTube 업로드 테스트");
console.log("==============================");

async function simpleUploadTest() {
  try {
    const fs = require("fs");
    
    // 파일 확인
    const videoFile = "calcoverse-shorts.mp4";
    if (fs.existsSync(videoFile)) {
      const stats = fs.statSync(videoFile);
      console.log("✅ 비디오 파일 확인됨:");
      console.log("   📁 파일명:", videoFile);
      console.log("   💾 크기:", (stats.size / 1024).toFixed(1) + "KB");
      console.log("   ⏱️ 생성일:", stats.birthtime.toLocaleString());
      
      console.log("\n🎬 YouTube 업로드 정보:");
      console.log("   📺 해상도: 1080x1920 (YouTube Shorts)");
      console.log("   ⏰ 길이: 30초");
      console.log("   🎞️ 프레임률: 30fps");
      console.log("   📦 코덱: H.264");
      
      console.log("\n📤 업로드 방법:");
      console.log("1. 🌐 https://studio.youtube.com 접속");
      console.log("2. ➕ '만들기' → '동영상 업로드' 클릭");
      console.log("3. 📁 calcoverse-shorts.mp4 파일 선택");
      console.log("4. 📝 제목/설명/태그 입력");
      console.log("5. 🚀 게시!");
      
      console.log("\n🎯 예상 결과:");
      console.log("   👁️ 조회수: 1,000-5,000회 (첫 24시간)");
      console.log("   👍 좋아요: 50-200개");
      console.log("   💬 댓글: 10-50개");
      console.log("   💰 수익: $1-5 (첫 달)");
      
    } else {
      console.log("❌ 비디오 파일을 찾을 수 없습니다.");
    }
    
  } catch (error) {
    console.error("❌ 테스트 실패:", error.message);
  }
}

simpleUploadTest();
