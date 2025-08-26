console.log("🎥 고화질 MP4 비디오 생성 시스템!");
console.log("================================");

const { spawn } = require("child_process");
const fs = require("fs");

const qualityProfiles = {
  basic: [
    "-loop", "1",
    "-i", "calcoverse-frame.png",
    "-t", "30",
    "-pix_fmt", "yuv420p",
    "-y"
  ],
  
  highQuality: [
    "-loop", "1",
    "-i", "calcoverse-frame.png",
    "-t", "30",
    "-r", "30",
    "-vf", "scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "16",
    "-tune", "stillimage",
    "-movflags", "+faststart",
    "-y"
  ]
};

async function createMP4Video(qualityMode = "highQuality") {
  try {
    console.log("🖼️ calcoverse-frame.png 파일 확인 중...");
    
    if (!fs.existsSync("calcoverse-frame.png")) {
      console.log("❌ calcoverse-frame.png 파일이 없습니다.");
      return;
    }

    console.log("✅ 스크린샷 파일 존재 확인");
    
    const ffmpegArgs = [...qualityProfiles[qualityMode]];
    const outputFile = `calcoverse-shorts-${qualityMode}.mp4`;
    ffmpegArgs[ffmpegArgs.length - 1] = outputFile;

    console.log(`🎬 품질 모드: ${qualityMode}`);
    console.log("화질 개선 설정:");
    console.log("  ✅ CRF 16 (기본 23→16, 대폭 선명화)");
    console.log("  ✅ Lanczos 스케일링 (가장 선명한 보간)");
    console.log("  ✅ stillimage 튜닝 (정지 이미지 최적화)");

    console.log("⏱️ 30초 고화질 비디오 생성 중...");
    console.log("💡 FFmpeg 명령어:", "ffmpeg " + ffmpegArgs.join(" "));

    return new Promise((resolve, reject) => {
      const convert = spawn("ffmpeg", ffmpegArgs);
      
      convert.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes('frame=') || output.includes('time=')) {
          process.stdout.write('.');
        }
      });
      
      convert.on("close", (code) => {
        console.log("");
        if (code === 0) {
          console.log("🎉 고화질 MP4 생성 완료!");
          console.log(`📁 파일: ${outputFile}`);
          
          if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            const fileSizeMB = (stats.size / (1024*1024)).toFixed(2);
            console.log(`💾 파일 크기: ${fileSizeMB}MB`);
          }
          
          resolve(outputFile);
        } else {
          reject(new Error("Video conversion failed"));
        }
      });
    });
    
  } catch (error) {
    console.error("❌ MP4 생성 실패:", error.message);
    throw error;
  }
}

createMP4Video("highQuality")
  .then((outputFile) => {
    console.log(`✅ 고화질 비디오 완성: ${outputFile}`);
  })
  .catch((error) => {
    console.error("❌ 실행 실패:", error.message);
  });
