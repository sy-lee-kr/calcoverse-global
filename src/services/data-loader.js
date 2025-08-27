/**
 * DataLoader Module
 * Auto-generated from app.js modularization
 * Path: src/services/data-loader.js
 */

import fetch from 'node-fetch';
import { Logger } from '../utils/logger.js';

app.use(express.json());
app.use(express.static('public'));

// 메인 페이지
app.get('/', (req, res) => {
  res.json({
    message: '🧮 Math Shorts Global System',
    status: 'running',
    version: '1.0.0',
    time: new Date().toISOString(),
    features: [
      '✅ AI Problem Generation',
      '✅ Multi-language Support', 
      '✅ Voice Integration',
      '✅ Global Community',
      '✅ Weekend Exam System'
    ],
    endpoints: {
      problems: '/api/test/problem',
      weekly: '/api/generate/week',
      admin: '/admin'
    }
  });
});

// 관리자 대시보드
app.get('/admin', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Math Shorts Admin</title>
        <style>
          body { font-family: Arial; padding: 20px; background: #f5f5f5; }
          .header { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .card { background: white; padding: 20px; border-radius: 10px; margin: 10px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .button { background: #26de81; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
          .button:hover { background: #20bf6b; }
          .status { color: #26de81; font-weight: bold; }
          .result { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; font-family: monospace; max-height: 400px; overflow-y: auto; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧮 Math Shorts 관리자 대시보드</h1>
          <p>글로벌 수학 교육 자동화 시스템</p>
        </div>
        
        <div class="card">
          <h2>🚀 시스템 상태</h2>
          <p>서버 상태: <span class="status">정상 가동 중</span></p>
          <p>AI 문제 생성기: <span class="status">연결됨</span></p>
          <p>음성 시스템: <span class="status">5개 언어 지원</span></p>
          <p>승인 시스템: <span class="status">대기 중</span></p>
          <p>현재 시간: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
        
        <div class="card">
          <h2>🎯 기능 테스트</h2>
              const response = await fetch('/api/test/problem');
              const data = await response.json();
              showResult('단일 문제 생성 결과', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function testWeek() {
            showLoading();
            try {
              const response = await fetch('/api/generate/week');
              const data = await response.json();
              showResult('일주일 문제 생성 결과', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function testVoice() {
            showLoading();
            try {
              const response = await fetch('/api/voice/all');
              const data = await response.json();
              showResult('다국어 음성 생성 결과', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function testApproval() {
            showLoading();
            try {
              const response = await fetch('/api/submit-for-approval');
              const data = await response.json();
              showResult('승인 요청 결과', data);
              
              if (data.success && data.approvalUrl) {
                setTimeout(() => {
                  if (confirm('승인 페이지를 새 창에서 열까요?')) {
                    window.open(data.approvalUrl, '_blank');
                  }
                }, 2000);
              }
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          async function viewStats() {
            showLoading();
            try {
              const response = await fetch('/api/stats');
              const data = await response.json();
              showResult('시스템 상태', data);
            } catch (error) {
              showResult('오류', {error: error.message});
            }
          }
          
          function showLoading() {
            const result = document.getElementById('result');
            result.style.display = 'block';


// Exports
export { DataLoader };
export default DataLoader;

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataLoader;
}
