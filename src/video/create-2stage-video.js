const { spawn } = require("child_process");
const fs = require("fs");

async function create2StageVideo() {
  const questionImage = "calcoverse-integer-003-question.png";
  const answerImage = "calcoverse-integer-003-answer.png";
  const outputFile = "calcoverse-integer-003-2stage.mp4";

  console.log("2단계 영상 생성 시작...");
  console.log("0-15초: 문제 화면");
  console.log("15-30초: 정답 화면");

  const ffmpegArgs = [
    "-loop", "1", "-i", questionImage, "-t", "15", "-r", "30",
    "-loop", "1", "-i", answerImage, "-t", "15", "-r", "30",
    "-filter_complex", "[0:v]scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p[v0];[1:v]scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p[v1];[v0][v1]concat=n=2:v=1:a=0[v]",
    "-map", "[v]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-tune", "stillimage", "-movflags", "+faststart",
    "-y", outputFile
  ];

  return new Promise((resolve, reject) => {
    const convert = spawn("ffmpeg", ffmpegArgs);
    
    convert.stderr.on('data', (data) => {
      process.stdout.write('.');
    });
    
    convert.on("close", (code) => {
      console.log("");
      if (code === 0) {
        console.log(`2단계 영상 생성 완료: ${outputFile}`);
        
        if (fs.existsSync(outputFile)) {
          const stats = fs.statSync(outputFile);
          const fileSizeMB = (stats.size / (1024*1024)).toFixed(2);
          console.log(`파일 크기: ${fileSizeMB}MB`);
          console.log("297회 조회수 넘어서기 준비 완료!");
        }
        
        resolve(outputFile);
      } else {
        reject(new Error("영상 생성 실패"));
      }
    });
  });
}

create2StageVideo()
  .then((file) => console.log(`성공: ${file}`))
  .catch((error) => console.error(`실패: ${error.message}`));
