/**
 * ProblemManager Module
 * Auto-generated from app.js modularization
 * Path: src/core/problem-manager.js
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/logger.js';

          <button class="button" onclick="testProblem()">📝 단일 문제 생성</button>
          <button class="button" onclick="testWeek()">📅 일주일 문제 생성</button>
          <button class="button" onclick="testVoice()">🎤 음성 생성 테스트</button>
          <button class="button" onclick="testApproval()">📱 승인 요청 테스트</button>
          <button class="button" onclick="viewStats()">📊 시스템 상태</button>
          <div id="result" class="result" style="display:none;"></div>
        </div>
        
        <div class="card">
          <h2>📈 오늘의 진행상황</h2>
          <p>✅ 서버 시작 완료</p>
          <p>✅ AI 문제 생성기 작동</p>
          <p>✅ 다국어 음성 시스템 준비</p>
          <p>✅ 승인 알림 시스템 준비</p>
          <p>🔄 영상 제작 파이프라인 구축 중</p>
        </div>
        
        <script>
          async function testProblem() {
            showLoading();
            try {
            <div id="preview-ko" class="problem-card">
              <h3>📝 문제 내용</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                지민이가 피자를 3개 주문했습니다. 배송비로 5원이 추가로 들어서 총 20원을 지불했다면, 피자 한 개의 가격은 얼마인가요?
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 풀이 과정</h4>
                <div class="step">1단계: 3x + 5 = 20</div>
                <div class="step">2단계: 3x = 20 - 5</div>
                <div class="step">3단계: 3x = 15</div>
                <div class="step">정답: x = 5원</div>
              </div>

              <div class="voice-info">
                <strong>🎤 음성 스크립트:</strong> "안녕하세요! 오늘의 수학 문제를 함께 풀어보겠습니다. 문제를 읽어드릴게요..."
              </div>
            </div>

            <!-- 영어 버전 -->
            <div id="preview-en" class="problem-card hidden">
              <h3>📝 Problem Content</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                Jimin ordered 3 pizzas. Including 5 won for delivery, he paid 20 won total. What is the price of one pizza?
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 Solution Steps</h4>
                <div class="step">Step 1: 3x + 5 = 20</div>
                <div class="step">Step 2: 3x = 20 - 5</div>
                <div class="step">Step 3: 3x = 15</div>
                <div class="step">Answer: x = 5 won</div>
              </div>

              <div class="voice-info">
                <strong>🎤 Voice Script:</strong> "Hello! Let's solve today's math problem together. Here is the problem..."
              </div>
            </div>

            <!-- 중국어 버전 -->
            <div id="preview-zh" class="problem-card hidden">
              <h3>📝 题目内容</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                智民订了3个比萨。包括5元配送费，总共支付了20元。一个比萨的价格是多少？
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 解题步骤</h4>
                <div class="step">第1步: 3x + 5 = 20</div>
                <div class="step">第2步: 3x = 20 - 5</div>
                <div class="step">第3步: 3x = 15</div>
                <div class="step">答案: x = 5元</div>
              </div>

              <div class="voice-info">
                <strong>🎤 语音脚本:</strong> "你好！让我们一起解决今天的数学问题..."
              </div>
            </div>

            <!-- 일본어 버전 -->
            <div id="preview-ja" class="problem-card hidden">
              <h3>📝 問題内容</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                ジミンがピザを3個注文しました。配送料5円を含めて、合計20円を支払いました。ピザ1個の価格はいくらですか？
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 解答手順</h4>
                <div class="step">ステップ1: 3x + 5 = 20</div>
                <div class="step">ステップ2: 3x = 20 - 5</div>
                <div class="step">ステップ3: 3x = 15</div>
                <div class="step">答え: x = 5円</div>
              </div>

              <div class="voice-info">
                <strong>🎤 音声スクリプト:</strong> "こんにちは！今日の数学問題を一緒に解いてみましょう..."
              </div>
            </div>

            <!-- 스페인어 버전 -->
            <div id="preview-es" class="problem-card hidden">
              <h3>📝 Contenido del Problema</h3>
              <p style="font-size: 1.1em; line-height: 1.6;">
                Jimin pidió 3 pizzas. Incluyendo 5 euros de entrega, pagó 20 euros en total. ¿Cuál es el precio de una pizza?
              </p>
              
              <div class="equation">3x + 5 = 20</div>
              
              <div class="solution-steps">
                <h4>📚 Pasos de Solución</h4>
                <div class="step">Paso 1: 3x + 5 = 20</div>
                <div class="step">Paso 2: 3x = 20 - 5</div>
                <div class="step">Paso 3: 3x = 15</div>
                <div class="step">Respuesta: x = 5 euros</div>
              </div>

              <div class="voice-info">
                <strong>🎤 Guión de Voz:</strong> "¡Hola! Resolvamos juntos el problema de matemáticas de hoy..."
              </div>
            </div>
          </div>

          <div class="approval-section">
            <h2>✅ 승인 결정</h2>
            <p>위 콘텐츠를 검토하셨나요? 승인하시겠습니까?</p>
            
            <div style="margin: 30px 0;">
              <a href="/approve/${approvalId}?action=approve" class="approve-btn">✅ 승인하기</a>
              <a href="/approve/${approvalId}?action=reject" class="approve-btn reject-btn">❌ 수정 요청</a>
            </div>

            <p style="font-size: 0.9em; color: #666;">
              ⏰ 승인하지 않으면 2시간 후 자동으로 승인됩니다.<br>
              승인 ID: ${approvalId}
            </p>
          </div>

          <script>
            function showLanguage(lang) {
              // 모든 탭 비활성화
              document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
              });
              
              // 모든 미리보기 숨기기
              document.querySelectorAll('[id^="preview-"]').forEach(preview => {
                preview.classList.add('hidden');
              });
              
              // 선택된 탭 활성화
              event.target.classList.add('active');
              
              // 선택된 미리보기 표시
              document.getElementById('preview-' + lang).classList.remove('hidden');
            }
          </script>
        </body>
      </html>
    `);
  }
});

// 대기 중인 승인 목록
app.get('/api/pending-approvals', (req, res) => {
  const pending = notificationSystem.getPendingApprovals();
  
  res.json({
    success: true,
    count: pending.length,
    data: pending
  });
});

// 전체 워크플로우 테스트
app.get('/api/test/full-workflow', async (req, res) => {
  try {


// Exports
export { ProblemManager };
export default ProblemManager;

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProblemManager;
}
