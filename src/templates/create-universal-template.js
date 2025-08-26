console.log("🎬 범용 브랜드 템플릿 생성기");
console.log("===========================");

const fs = require("fs");

// 브랜드 설정 불러오기
const brand = JSON.parse(fs.readFileSync("brand-config.json", "utf8"));

function createBrandTemplate(problemData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            margin: 0; 
            padding: 40px;
            background: radial-gradient(circle at center, ${brand.colors.primary} 0%, ${brand.colors.secondary} 40%, #0f3460 100%);
            color: white;
            font-family: "Segoe UI", Arial, sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .galaxy {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            opacity: 0.6;
        }
        
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: sparkle 3s infinite;
        }
        
        @keyframes sparkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        .logo { 
            font-size: 54px; 
            margin-bottom: 30px; 
            font-weight: bold;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.7);
            z-index: 10;
            position: relative;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .problem { 
            font-size: 36px; 
            margin-bottom: 40px; 
            line-height: 1.4;
            text-shadow: 2px 2px 5px rgba(0,0,0,0.6);
            z-index: 10;
            position: relative;
        }
        
        .equation { 
            font-size: 48px; 
            color: ${brand.colors.accent}; 
            margin: 30px 0;
            font-weight: bold;
            text-shadow: 3px 3px 8px rgba(255,215,0,0.5);
            z-index: 10;
            position: relative;
        }
        
        .answer { 
            font-size: 42px; 
            color: ${brand.colors.answer};
            font-weight: bold;
            text-shadow: 3px 3px 8px rgba(0,255,136,0.5);
            z-index: 10;
            position: relative;
        }
        
        .slogan {
            position: absolute;
            bottom: 60px;
            font-size: 22px;
            color: rgba(255,255,255,0.9);
            font-weight: bold;
            z-index: 10;
        }
    </style>
</head>
<body>
    <div class="galaxy">
        <div class="star" style="top: 15%; left: 20%; width: 3px; height: 3px;"></div>
        <div class="star" style="top: 25%; left: 70%; width: 2px; height: 2px;"></div>
        <div class="star" style="top: 45%; left: 10%; width: 4px; height: 4px;"></div>
        <div class="star" style="top: 60%; left: 80%; width: 2px; height: 2px;"></div>
        <div class="star" style="top: 75%; left: 30%; width: 3px; height: 3px;"></div>
        <div class="star" style="top: 35%; left: 50%; width: 2px; height: 2px;"></div>
    </div>
    
    <div class="logo">${brand.logo} ${brand.name}</div>
    <div class="problem">${problemData.problem}</div>
    <div class="equation">${problemData.equation}</div>
    <div class="answer">${problemData.answer}</div>
    <div class="slogan">${brand.slogan}</div>
</body>
</html>
`;

  return html;
}

// 테스트용 문제 데이터
const sampleProblem = {
  problem: "지민이가 피자를 3개 주문했습니다.<br>배송비 5원을 포함해서 총 20원을 지불했다면,<br>피자 한 개의 가격은?",
  equation: "3x + 5 = 20", 
  answer: "정답: x = 5원"
};

// 새 템플릿 생성
const newTemplate = createBrandTemplate(sampleProblem);
fs.writeFileSync("universal-template.html", newTemplate);

console.log("✅ 범용 브랜드 템플릿 생성 완료!");
console.log("📁 파일: universal-template.html");
console.log("🎯 이제 브랜드명 변경 시 brand-config.json만 수정하면 됩니다!");
