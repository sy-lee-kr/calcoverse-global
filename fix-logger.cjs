/**
 * fix-logger.cjs
 * logger.js 문법 오류 수정
 */

const fs = require('fs');
const path = require('path');

// 올바른 logger.js 내용
const correctLoggerJs = `/**
 * Logger Module
 * Simple logging utility for Calcoverse
 */

export class Logger {
  constructor(name = 'App') {
    this.name = name;
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    this.currentLevel = this.levels.INFO;
  }

  setLevel(level) {
    if (typeof level === 'string' && this.levels[level.toUpperCase()]) {
      this.currentLevel = this.levels[level.toUpperCase()];
    }
  }

  log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = \`[\${timestamp}] [\${this.name}] [\${level}]\`;
    
    switch(level) {
      case 'ERROR':
        console.error(prefix, message, ...args);
        break;
      case 'WARN':
        console.warn(prefix, message, ...args);
        break;
      case 'INFO':
        console.info(prefix, message, ...args);
        break;
      case 'DEBUG':
        console.debug(prefix, message, ...args);
        break;
      default:
        console.log(prefix, message, ...args);
    }
  }

  error(message, ...args) {
    if (this.currentLevel >= this.levels.ERROR) {
      this.log('ERROR', message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.currentLevel >= this.levels.WARN) {
      this.log('WARN', message, ...args);
    }
  }

  info(message, ...args) {
    if (this.currentLevel >= this.levels.INFO) {
      this.log('INFO', message, ...args);
    }
  }

  debug(message, ...args) {
    if (this.currentLevel >= this.levels.DEBUG) {
      this.log('DEBUG', message, ...args);
    }
  }

  success(message, ...args) {
    // Special method for success messages
    const timestamp = new Date().toISOString();
    const prefix = \`[\${timestamp}] [\${this.name}] [SUCCESS]\`;
    console.log(prefix, '✅', message, ...args);
  }

  // Utility methods
  group(label) {
    console.group(label);
  }

  groupEnd() {
    console.groupEnd();
  }

  table(data) {
    console.table(data);
  }

  time(label) {
    console.time(label);
  }

  timeEnd(label) {
    console.timeEnd(label);
  }

  clear() {
    if (typeof console.clear === 'function') {
      console.clear();
    }
  }

  // Format helpers
  formatError(error) {
    if (error instanceof Error) {
      return \`\${error.name}: \${error.message}\\nStack: \${error.stack}\`;
    }
    return String(error);
  }

  formatObject(obj) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return String(obj);
    }
  }
}

// Singleton logger instance
let defaultLogger = null;

export function getLogger(name) {
  if (!defaultLogger) {
    defaultLogger = new Logger(name || 'App');
  }
  if (name && name !== defaultLogger.name) {
    return new Logger(name);
  }
  return defaultLogger;
}

// Console override (optional - for debugging)
export function overrideConsole() {
  const logger = getLogger('Console');
  
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
  };
  
  console.log = (...args) => logger.info(...args);
  console.error = (...args) => logger.error(...args);
  console.warn = (...args) => logger.warn(...args);
  console.info = (...args) => logger.info(...args);
  console.debug = (...args) => logger.debug(...args);
  
  return originalConsole;
}

// Export default
export default Logger;

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Logger, getLogger, overrideConsole };
}`;

// 실행 함수
async function fixLogger() {
  console.log('=================================');
  console.log('Logger.js 문법 오류 수정');
  console.log('=================================\n');
  
  try {
    const loggerPath = path.join('src', 'utils', 'logger.js');
    
    // 백업
    if (fs.existsSync(loggerPath)) {
      const backupPath = loggerPath + '.backup-' + Date.now();
      fs.copyFileSync(loggerPath, backupPath);
      console.log('✅ 기존 파일 백업 완료:', backupPath);
    }
    
    // 새 파일 작성
    fs.writeFileSync(loggerPath, correctLoggerJs, 'utf8');
    console.log('✅ logger.js 수정 완료\n');
    
    // 모든 모듈 파일 확인
    console.log('📋 모든 모듈 파일 상태 확인:\n');
    
    const moduleFiles = [
      'src/app.js',
      'src/core/engine.js',
      'src/core/problem-manager.js',
      'src/modules/animation-controller.js',
      'src/modules/youtube-uploader.js',
      'src/modules/template-renderer.js',
      'src/services/data-loader.js',
      'src/utils/logger.js'
    ];
    
    moduleFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const size = (stats.size / 1024).toFixed(1);
        console.log(`  ✅ ${file} (${size} KB)`);
      } else {
        console.log(`  ❌ ${file} - 파일 없음`);
      }
    });
    
    console.log('\n다음 명령어를 실행하세요:\n');
    console.log('1. 앱 실행:');
    console.log('   npm start\n');
    
    console.log('2. 성공하면 Git 커밋:');
    console.log('   git add .');
    console.log('   git commit -m "fix: 모든 모듈 오류 수정 완료"');
    console.log('   git push --set-upstream origin main\n');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

// 실행
if (require.main === module) {
  fixLogger();
}

module.exports = { fixLogger };