/**
 * Simple test file for npm test
 */

console.log('Running tests...');

// 기본 테스트
const tests = [
  {
    name: 'Engine module exists',
    test: () => {
      const enginePath = './src/core/engine.js';
      const fs = require('fs');
      return fs.existsSync(enginePath);
    }
  },
  {
    name: 'App.js exists',
    test: () => {
      const appPath = './src/app.js';
      const fs = require('fs');
      return fs.existsSync(appPath);
    }
  }
];

// 테스트 실행
tests.forEach(t => {
  try {
    const result = t.test();
    console.log(`✅ ${t.name}: ${result ? 'PASS' : 'FAIL'}`);
  } catch (error) {
    console.log(`❌ ${t.name}: ERROR - ${error.message}`);
  }
});

console.log('\nTests completed!');
