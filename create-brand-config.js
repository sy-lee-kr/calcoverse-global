console.log("🔧 브랜드 설정 중앙화");
console.log("=====================");

// 브랜드 설정 (한 곳에서 모든 브랜드 정보 관리)
const BRAND_CONFIG = {
  name: "Calcuverse",
  fullName: "Calcuverse Global",
  slogan: "계산의 우주로 떠나는 여행!",
  englishSlogan: "Journey to the Universe of Calculations!",
  logo: "🌌",
  domain: "calcuverse.com",
  youtube: "@Calcuverse",
  colors: {
    primary: "#1a1a2e",
    secondary: "#16213e", 
    accent: "#ffd700",
    answer: "#00ff88"
  }
};

console.log("✅ 브랜드 설정 완료:");
console.log("   이름:", BRAND_CONFIG.name);
console.log("   슬로건:", BRAND_CONFIG.slogan);
console.log("   로고:", BRAND_CONFIG.logo);

console.log("\n🎯 이제 모든 코드에서 이 설정을 사용!");
console.log("   예: `${BRAND_CONFIG.logo} ${BRAND_CONFIG.name}`");

// 브랜드 설정을 파일로 저장
const fs = require("fs");
fs.writeFileSync("brand-config.json", JSON.stringify(BRAND_CONFIG, null, 2));

console.log("\n💾 brand-config.json 파일로 저장 완료!");
console.log("이제 다른 모든 코드에서 이 파일을 불러와서 사용하면 됩니다.");
