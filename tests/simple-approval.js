const express = require('express');
const app = express();
const PORT = 3001;

app.get('/approve/:approvalId', (req, res) => {
  const approvalId = req.params.approvalId;
  const action = req.query.action;
  
  console.log('승인 요청 접수:', approvalId, action);
  
  if (action === 'approve') {
    res.send('<h1>✅ 승인 완료!</h1><p>YouTube 업로드를 시작합니다!</p>');
    console.log('✅ 선생님이 승인하셨습니다!');
  } else {
    res.send(\
      <h1>🎬 MathVerse 승인</h1>
      <p>승인 ID: \</p>
      <p>생성된 문제: 지민이가 피자를 3개 주문했습니다...</p>
      <a href="?action=approve" style="background:green;color:white;padding:10px;text-decoration:none;">✅ 승인</a>
      <a href="?action=reject" style="background:red;color:white;padding:10px;text-decoration:none;margin-left:10px;">❌ 거부</a>
    \);
  }
});

app.listen(PORT, () => {
  console.log(\서버 시작됨: http://localhost:\\);
  console.log(\승인 링크: http://localhost:\/approve/approval_1755850313860\);
});
