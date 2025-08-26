const express = require('express');
const app = express();
const PORT = 3000;

app.get('/approve/:approvalId', (req, res) => {
  const { approvalId } = req.params;
  const action = req.query.action || 'view';
  
  if (action === 'approve') {
    res.send(\
      <h1>✅ 승인 완료!</h1>
      <p>승인 ID: \</p>
      <p>🚀 YouTube 업로드가 시작됩니다...</p>
      <script>
        setTimeout(() => {
          alert('YouTube 업로드 시작!');
          window.close();
        }, 2000);
      </script>
    \);
    
    console.log('✅ 선생님이 승인하셨습니다! ID:', approvalId);
    console.log('🎬 YouTube 업로드를 시작합니다...');
    
  } else {
    res.send(\
      <h1>🎬 MathVerse 승인 페이지</h1>
      <h2>생성된 콘텐츠 확인</h2>
      <p><strong>문제:</strong> 지민이가 피자를 3개 주문했습니다...</p>
      <p><strong>언어:</strong> 5개 (한국어, English, 中文, 日本語, Español)</p>
      <p><strong>승인 ID:</strong> \</p>
      
      <div style="margin: 20px 0;">
        <a href="/approve/\?action=approve" 
           style="background: #26de81; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin-right: 10px;">
           ✅ 승인하기
        </a>
        <a href="/approve/\?action=reject" 
           style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px;">
           ❌ 수정 요청
        </a>
      </div>
    \);
  }
});

app.get('/', (req, res) => {
  res.send('<h1>🎬 MathVerse 승인 시스템</h1><p>승인 링크를 통해 접속하세요.</p>');
});

app.listen(PORT, () => {
  console.log(\🌐 승인 서버 시작: http://localhost:\\);
  console.log(\🔗 승인 링크: http://localhost:\/approve/approval_1755850313860\);
});
