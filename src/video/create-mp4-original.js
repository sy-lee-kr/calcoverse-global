[위의 개선된 코드 전체 복사]
console.log("🎥 고화질 MP4 비디오 생성 시스템!");
console.log("================================");

const { spawn } = require("child_process");
const fs = require("fs");

// ChatGPT 제안 기반 화질 최적화 설정
const qualityProfiles = {
  // 기존 기본 설정 (흐림)
  basic: [
    "-loop", "1",
    "-i", "calcoverse-frame.png",
    "-t", "30",
    "-pix_fmt", "yuv420p",
    "-y"
  ],
  
  // 개선된 고화질 (YouTube Shorts 최적화)
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
  ],
  
  // 수학 문제용 초선명 (텍스트/도표 최적화)
  ultraSharp: [
    "-loop", "1", 
    "-i", "calcoverse-frame.png",
    "-t", "30",
    "-r", "30",
    "-vf", "scale=1080:1920:flags=lanczos,setsar=1,format=yuv444p",
    "-c:v", "libx264",
    "-preset", "slow", 
    "-crf", "14",
    "-tune", "stillimage",
    "-color_primaries", "bt709",
    "-colorspace", "bt709", 
    "-color_trc", "bt709",
    "-y"
  ]
};

async function createMP4Video(qualityMode = "highQuality") {
  try {
    console.log(`🖼️ calcoverse-frame.png 파일 확인 중...`);
    
    if (!fs.existsSync("calcoverse-frame.png")) {
      console.log("❌ calcoverse-frame.png 파일이 없습니다.");
      console.log("💡 먼저 스크린샷을 생성하세요.");
      return;
    }

    console.log("✅ 스크린샷 파일 존재 확인");
    
    // 품질 모드 선택
    const ffmpegArgs = qualityProfiles[qualityMode];
    const outputFile = `calcoverse-shorts-${qualityMode}.mp4`;
    ffmpegArgs[ffmpegArgs.length - 1] = outputFile; // 마지막 -y를 파일명으로 교체
    ffmpegArgs.push("-y"); // -y를 다시 추가

    console.log(`🎬 품질 모드: ${qualityMode}`);
    console.log("화질 개선 설정:");
    
    switch(qualityMode) {
      case "highQuality":
        console.log("  ✅ CRF 16 (기본 23→16, 대폭 선명화)");
        console.log("  ✅ Lanczos 스케일링 (가장 선명한 보간)");
        console.log("  ✅ stillimage 튜닝 (정지 이미지 최적화)");
        console.log("  ✅ faststart (스트리밍 최적화)");
        break;
      case "ultraSharp":
        console.log("  🔥 CRF 14 (초고화질)");
        console.log("  🔥 yuv444p (텍스트 번짐 방지)"); 
        console.log("  🔥 BT.709 색공간 명시 (정확한 색재현)");
        console.log("  🔥 수학 문제용 텍스트 최적화");
        break;
      default:
        console.log("  📱 YouTube Shorts 호환 설정");
    }

    console.log("⏱️ 30초 고화질 비디오 생성 중...");
    console.log("💡 FFmpeg 명령어:", "ffmpeg " + ffmpegArgs.join(" "));

    // FFmpeg 설치 확인 및 실행
    return new Promise((resolve, reject) => {
      console.log("🔍 FFmpeg 설치 확인 중...");
      
      const versionCheck = spawn("ffmpeg", ["-version"]);
      
      versionCheck.on("error", (error) => {
        console.log("⚠️ FFmpeg가 설치되지 않았습니다.");
        console.log("💡 설치 방법:");
        console.log("   Windows: choco install ffmpeg");
        console.log("   Mac: brew install ffmpeg"); 
        console.log("   Linux: apt install ffmpeg");
        console.log("   또는: https://ffmpeg.org/download.html");
        reject(new Error("FFmpeg not installed"));
      });

      versionCheck.on("close", (code) => {
        if (code === 0) {
          console.log("✅ FFmpeg 설치 확인됨!");
          console.log("🎬 고화질 MP4 변환 시작...");
          
          // 실제 비디오 생성
          const convert = spawn("ffmpeg", ffmpegArgs);
          
          convert.stderr.on('data', (data) => {
            // FFmpeg 진행상황 표시 (너무 많으면 생략)
            const output = data.toString();
            if (output.includes('frame=') || output.includes('time=')) {
              process.stdout.write('.');
            }
          });
          
          convert.on("close", (code) => {
            console.log(""); // 줄바꿈
            if (code === 0) {
              console.log("🎉 고화질 MP4 생성 완료!");
              console.log(`📁 파일: ${outputFile}`);
              console.log("⏱️ 길이: 30초");
              console.log("📏 해상도: 1080x1920 (YouTube Shorts)");
              console.log("🎯 품질: 대폭 개선됨 (297회 넘어서기 준비!)");
              
              // 파일 크기 확인
              if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                const fileSizeMB = (stats.size / (1024*1024)).toFixed(2);
                console.log(`💾 파일 크기: ${fileSizeMB}MB`);
                
                if (stats.size > 50 * 1024 * 1024) { // 50MB 이상
                  console.log("⚠️ 파일이 큽니다. YouTube 업로드에는 문제없음");
                }
              }
              
              resolve(outputFile);
            } else {
              console.log("❌ MP4 변환 실패");
              console.log("💡 PNG 파일이 손상되었거나 FFmpeg 오류");
              reject(new Error("Video conversion failed"));
            }
          });
          
          convert.on("error", (error) => {
            console.log("❌ FFmpeg 실행 오류:", error.message);
            reject(error);
          });
          
        } else {
          reject(new Error("FFmpeg version check failed"));
        }
      });
    });
    
  } catch (error) {
    console.error("❌ MP4 생성 실패:", error.message);
    throw error;
  }
}

// 품질 비교 테스트 함수
async function qualityComparison() {
  console.log("🔬 품질 비교 테스트 시작!");
  console.log("========================");
  
  try {
    // 1. 고화질 버전 (YouTube Shorts 최적화)
    console.log("1️⃣ 고화질 버전 생성...");
    await createMP4Video("highQuality");
    console.log("");
    
    // 2. 초선명 버전 (수학 문제 최적화)  
    console.log("2️⃣ 초선명 버전 생성...");
    await createMP4Video("ultraSharp");
    console.log("");
    
    console.log("🎉 품질 비교 테스트 완료!");
    console.log("📊 생성된 파일들:");
    console.log("  - calcoverse-shorts-highQuality.mp4 (297회 넘어서기용)");
    console.log("  - calcoverse-shorts-ultraSharp.mp4 (최고화질 테스트용)");
    console.log("");
    console.log("🚀 다음 단계:");
    console.log("1. 두 버전 화질 육안 비교");
    console.log("2. 더 선명한 버전으로 YouTube 업로드");
    console.log("3. 조회수 297회 vs 새 버전 성과 비교");
    
  } catch (error) {
    console.error("❌ 품질 비교 테스트 실패:", error.message);
  }
}

// 실행부
console.log("🎯 실행 옵션:");
console.log("1. createMP4Video('highQuality') - 297회 넘어서기용");  
console.log("2. createMP4Video('ultraSharp') - 최고화질 테스트");
console.log("3. qualityComparison() - 품질 비교 테스트");
console.log("");

// 기본 실행: 고화질 모드
createMP4Video("highQuality")
  .then((outputFile) => {
    console.log(`✅ 기본 실행 완료: ${outputFile}`);
  })
  .catch((error) => {
    console.error("❌ 기본 실행 실패:", error.message);
  });