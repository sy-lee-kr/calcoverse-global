const puppeteer = require('puppeteer');

async function convertBoth() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1080, height: 1920 });
  
  // 문제 HTML 변환
  const questionPath = `file://${process.cwd()}/problem-integer-004-question-improved.html`;
  await page.goto(questionPath, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: 'calcoverse-integer-004-question.png',
    fullPage: false,
    clip: { x: 0, y: 0, width: 1080, height: 1920 }
  });
  
  // 정답 HTML 변환
  const answerPath = `file://${process.cwd()}/problem-integer-004-answer-improved.html`;
  await page.goto(answerPath, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: 'calcoverse-integer-004-answer.png',
    fullPage: false,
    clip: { x: 0, y: 0, width: 1080, height: 1920 }
  });
  
  await browser.close();
  console.log('PNG 파일 생성 완료');
}

convertBoth();
