console.log("🎬 고급 애니메이션 비디오 템플릿 생성");
console.log("====================================");

const advancedHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            margin: 0; 
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: "Segoe UI", Arial, sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            overflow: hidden;
        }
        
        .logo { 
            font-size: 60px; 
            margin-bottom: 40px; 
            animation: fadeInDown 1s ease-out;
        }
        
        .problem { 
            font-size: 36px; 
            margin-bottom: 50px; 
            line-height: 1.4;
            animation: fadeInUp 1.5s ease-out;
        }
        
        .equation { 
            font-size: 48px; 
            color: #26de81; 
            margin: 30px 0;
            font-weight: bold;
            animation: pulse 2s infinite;
        }
        
        .answer { 
            font-size: 42px; 
            color: #ffd700;
            font-weight: bold;
            animation: bounceIn 2.5s ease-out;
        }
        
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.1); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        
        .hashtags {
            position: absolute;
            bottom: 40px;
            font-size: 24px;
            color: rgba(255,255,255,0.8);
            animation: fadeIn 3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="logo">🧮 MathVerse</div>
    <div class="problem">
        지민이가 피자를 3개 주문했습니다.<br>
        배송비 5원을 포함해서 총 20원을 지불했다면,<br>
        피자 한 개의 가격은?
    </div>
    <div class="equation">3x + 5 = 20</div>
    <div class="answer">정답: x = 5원</div>
    <div class="hashtags">#Shorts #수학 #교육 #MathVerse</div>
</body>
</html>
`;

const fs = require("fs");
fs.writeFileSync("advanced-template.html", advancedHTML);

console.log("✅ 고급 애니메이션 템플릿 생성 완료!");
console.log("📁 파일: advanced-template.html");
console.log("🌐 브라우저에서 확인: file://" + __dirname + "/advanced-template.html");

console.log("\n🎬 템플릿 특징:");
console.log("   ✨ 페이드인 애니메이션");
console.log("   💫 펄스 효과 (방정식)");
console.log("   🎯 바운스 효과 (정답)");
console.log("   🏷️ 해시태그 포함");
console.log("   📱 YouTube Shorts 최적화");
