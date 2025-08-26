console.log("🎥 비디오 생성 테스트");
console.log("====================");

async function createVideoFromProblem() {
  try {
    console.log("1️⃣ HTML 템플릿 생성 중...");
    
    const problemHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            margin: 0; 
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: Arial, sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
        }
        .title { font-size: 48px; margin-bottom: 30px; }
        .problem { font-size: 36px; margin-bottom: 40px; line-height: 1.5; }
        .equation { font-size: 42px; color: #26de81; margin: 20px 0; }
        .answer { font-size: 38px; color: #ffd700; }
    </style>
</head>
<body>
    <div class="title">🧮 MathVerse</div>
    <div class="problem">지민이가 피자를 3개 주문했습니다.<br>배송비 5원을 포함해서 총 20원을 지불했다면,<br>피자 한 개의 가격은?</div>
    <div class="equation">3x + 5 = 20</div>
    <div class="answer">정답: x = 5원</div>
</body>
</html>
    `;
    
    const fs = require("fs");
    fs.writeFileSync("problem-template.html", problemHTML);
    
    console.log("✅ HTML 파일 생성 완료: problem-template.html");
    console.log("🌐 브라우저에서 확인: file://" + __dirname + "/problem-template.html");
    
    console.log("\n2️⃣ 비디오 변환 준비...");
    console.log("💡 Puppeteer를 사용해서 HTML → MP4 변환 가능");
    console.log("📦 필요한 패키지: puppeteer, ffmpeg");
    
    console.log("\n🎯 다음 단계:");
    console.log("1. HTML 템플릿 확인");
    console.log("2. 음성 파일과 합성");
    console.log("3. MP4 영상 생성");
    console.log("4. YouTube 업로드");
    
  } catch (error) {
    console.error("❌ 비디오 생성 실패:", error.message);
  }
}

createVideoFromProblem();
