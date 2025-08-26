console.log("🎵 음성 + 비디오 합성");
console.log("====================");

const { spawn } = require("child_process");
const fs = require("fs");

async function createVideoWithAudio() {
  try {
    console.log("🎬 MP4 비디오 생성 중...");
    
    // 1단계: 이미지를 30초 비디오로 변환
    const videoArgs = [
      "-loop", "1",
      "-i", "calcoverse-frame.png",
      "-t", "30",
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-s", "1080x1920",
      "-r", "30",
      "-y",
      "calcoverse-video.mp4"
    ];
    
    console.log("📹 FFmpeg 명령어:", "ffmpeg " + videoArgs.join(" "));
    
    const videoProcess = spawn("ffmpeg", videoArgs);
    
    videoProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ MP4 비디오 생성 완료!");
        console.log("📁 파일: calcoverse-video.mp4");
        console.log("⏱️ 길이: 30초");
        console.log("📏 해상도: 1080x1920 (YouTube Shorts)");
        console.log("🎞️ 프레임률: 30fps");
        
        console.log("\n🎵 음성 파일이 있다면 합성 가능:");
        console.log("ffmpeg -i calcoverse-video.mp4 -i audio.mp3 -c:v copy -c:a aac calcoverse-final.mp4");
        
        // 파일 크기 확인
        if (fs.existsSync("calcoverse-video.mp4")) {
          const stats = fs.statSync("calcoverse-video.mp4");
          const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          console.log("💾 파일 크기:", fileSizeMB + "MB");
        }
        
      } else {
        console.log("❌ 비디오 생성 실패. 코드:", code);
      }
    });
    
    videoProcess.stderr.on("data", (data) => {
      // FFmpeg 진행 상황 표시
      const output = data.toString();
      if (output.includes("time=")) {
        const timeMatch = output.match(/time=(\d+:\d+:\d+\.\d+)/);
        if (timeMatch) {
          process.stdout.write("⏱️ 진행: " + timeMatch[1] + "        \\r");
        }
      }
    });
    
  } catch (error) {
    console.error("❌ 비디오 생성 실패:", error.message);
  }
}

createVideoWithAudio();
