console.log("🎥 실제 MP4 비디오 생성!");
console.log("=======================");

const { spawn } = require("child_process");
const fs = require("fs");

async function createMP4Video() {
  try {
    console.log("🖼️ calcoverse-frame.png 파일 확인 중...");
    
    if (fs.existsSync("calcoverse-frame.png")) {
      console.log("✅ 스크린샷 파일 존재 확인");
      
      console.log("🎬 FFmpeg로 MP4 변환 시작...");
      console.log("⏱️ 30초 비디오 생성 중...");
      
      // FFmpeg 명령어 (만약 설치되어 있다면)
      const ffmpegArgs = [
        "-loop", "1",
        "-i", "calcoverse-frame.png",
        "-t", "30",
        "-pix_fmt", "yuv420p",
        "-y", // 덮어쓰기
        "calcoverse-shorts.mp4"
      ];
      
      console.log("💡 FFmpeg 명령어:", "ffmpeg " + ffmpegArgs.join(" "));
      
      // FFmpeg 설치 여부 확인
      console.log("🔍 FFmpeg 설치 확인 중...");
      
      try {
        const ffmpeg = spawn("ffmpeg", ["-version"]);
        
        ffmpeg.on("error", (error) => {
          console.log("⚠️ FFmpeg가 설치되지 않았습니다.");
          console.log("💡 설치 방법:");
          console.log("   1. https://ffmpeg.org/download.html 에서 다운로드");
          console.log("   2. 또는 Chocolatey: choco install ffmpeg");
          console.log("   3. 또는 수동으로 PATH 설정");
          
          console.log("\n🎯 현재 상태:");
          console.log("✅ HTML 템플릿 생성 완료");
          console.log("✅ PNG 스크린샷 생성 완료");
          console.log("⏳ MP4 변환 대기 중 (FFmpeg 설치 후)");
          
          console.log("\n🚀 다음 단계:");
          console.log("1. FFmpeg 설치");
          console.log("2. MP4 비디오 생성");
          console.log("3. 음성 파일과 합성");
          console.log("4. 실제 YouTube 업로드");
        });
        
        ffmpeg.on("close", (code) => {
          if (code === 0) {
            console.log("✅ FFmpeg 설치 확인됨!");
            console.log("🎬 MP4 변환 시작...");
            
            // 실제 변환 실행
            const convert = spawn("ffmpeg", ffmpegArgs);
            
            convert.on("close", (code) => {
              if (code === 0) {
                console.log("✅ MP4 비디오 생성 완료!");
                console.log("📁 파일: calcoverse-shorts.mp4");
                console.log("⏱️ 길이: 30초");
                console.log("📏 해상도: 1080x1920 (YouTube Shorts)");
              } else {
                console.log("❌ MP4 변환 실패");
              }
            });
          }
        });
        
      } catch (spawnError) {
        console.log("⚠️ FFmpeg 실행 실패:", spawnError.message);
      }
      
    } else {
      console.log("❌ calcoverse-frame.png 파일이 없습니다.");
      console.log("💡 먼저 create-actual-video.js를 실행하세요.");
    }
    
  } catch (error) {
    console.error("❌ MP4 생성 실패:", error.message);
  }
}

createMP4Video();
