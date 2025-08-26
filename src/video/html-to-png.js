const puppeteer = require('puppeteer');

async function htmlToPng(htmlFile, outputPng) {
  try {
    console.log(`${htmlFile}을 ${outputPng}로 변환 중...`);
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // YouTube Shorts 크기로 설정
    await page.setViewport({ width: 1080, height: 1920 });
    
    // HTML 파일 로드
    const htmlPath = `file://${process.cwd()}/${htmlFile}`;
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    
    // 스크린샷 생성
    await page.screenshot({
      path: outputPng,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1080, height: 1920 }
    });
    
    await browser.close();
    console.log(`스크린샷 저장 완료: ${outputPng}`);
    
  } catch (error) {
    console.error('오류:', error.message);
  }
}

// 두 HTML 파일 모두 변환
async function convertBoth() {
  await htmlToPng('problem-integer-003-question.html', 'calcoverse-integer-003-question.png');
  await htmlToPng('problem-integer-003-answer.html', 'calcoverse-integer-003-answer.png');
}

convertBoth();
