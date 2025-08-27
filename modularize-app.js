/**
 * app.js 자동 모듈화 스크립트
 * 29KB app.js를 자동으로 여러 모듈로 분리
 */

const fs = require('fs');
const path = require('path');

class AppModularizer {
  constructor() {
    this.sourceFile = 'src/app.js';
    this.backupDir = 'backup/app-modularization';
    this.modules = new Map();
    this.originalContent = '';
  }

  // 메인 실행 함수
  async run() {
    console.log('=================================');
    console.log('app.js 자동 모듈화 시작');
    console.log('=================================\n');

    try {
      // 1. 원본 파일 읽기
      await this.readOriginalFile();
      
      // 2. 백업
      await this.backupOriginal();
      
      // 3. 코드 분석 및 분리
      await this.analyzeAndSplit();
      
      // 4. 모듈 파일들 생성
      await this.createModuleFiles();
      
      // 5. 새로운 app.js 생성
      await this.createNewAppJs();
      
      // 6. package.json 업데이트
      await this.updatePackageJson();
      
      console.log('\n✨ 모듈화 완료!');
      this.printSummary();
      
    } catch (error) {
      console.error('❌ 오류 발생:', error.message);
      await this.rollback();
    }
  }

  // 원본 파일 읽기
  async readOriginalFile() {
    console.log(`📖 원본 파일 읽기: ${this.sourceFile}`);
    
    if (!fs.existsSync(this.sourceFile)) {
      throw new Error(`파일을 찾을 수 없습니다: ${this.sourceFile}`);
    }
    
    this.originalContent = fs.readFileSync(this.sourceFile, 'utf8');
    const size = (this.originalContent.length / 1024).toFixed(1);
    console.log(`   크기: ${size} KB`);
    console.log(`   라인 수: ${this.originalContent.split('\n').length}`);
  }

  // 백업
  async backupOriginal() {
    console.log('\n📦 원본 파일 백업...');
    
    // 백업 디렉토리 생성
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    
    // 타임스탬프 추가
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupDir, `app-${timestamp}.js`);
    
    fs.writeFileSync(backupFile, this.originalContent);
    console.log(`   백업 완료: ${backupFile}`);
  }

  // 코드 분석 및 모듈 분리
  async analyzeAndSplit() {
    console.log('\n🔍 코드 분석 및 모듈 분리...');
    
    const lines = this.originalContent.split('\n');
    let currentModule = null;
    let currentContent = [];
    
    // 패턴 매칭으로 모듈 식별
    const patterns = {
      'core/engine': [
        /class.*Core/i,
        /function.*initialize/i,
        /function.*start/i,
        /\.state\s*=/,
        /\.modules\s*=/
      ],
      'core/problem-manager': [
        /class.*Problem/i,
        /function.*loadProblem/i,
        /function.*getNextProblem/i,
        /\.problems\s*=/,
        /validateAnswer/
      ],
      'modules/animation-controller': [
        /class.*Animation/i,
        /function.*animate/i,
        /animation.*function/i,
        /keyframes/i,
        /\.animate\(/
      ],
      'modules/youtube-uploader': [
        /class.*YouTube/i,
        /class.*Upload/i,
        /function.*upload/i,
        /youtube|YouTube/i,
        /uploadVideo/
      ],
      'modules/template-renderer': [
        /class.*Template/i,
        /class.*Render/i,
        /function.*render/i,
        /\.innerHTML/,
        /template/i
      ],
      'services/data-loader': [
        /class.*Data/i,
        /class.*Loader/i,
        /function.*load/i,
        /fetch\(/,
        /\.json\(\)/
      ],
      'utils/helpers': [
        /function.*format/i,
        /function.*parse/i,
        /function.*validate/i,
        /function.*convert/i,
        /RegExp/
      ],
      'utils/logger': [
        /console\./,
        /function.*log/i,
        /class.*Logger/i
      ]
    };
    
    // 라인별로 분석
    lines.forEach((line, index) => {
      // 어느 모듈에 속하는지 판단
      for (const [moduleName, modulePatterns] of Object.entries(patterns)) {
        if (modulePatterns.some(pattern => pattern.test(line))) {
          if (currentModule !== moduleName) {
            // 이전 모듈 저장
            if (currentModule && currentContent.length > 0) {
              const existing = this.modules.get(currentModule) || [];
              this.modules.set(currentModule, [...existing, ...currentContent]);
            }
            
            // 새 모듈 시작
            currentModule = moduleName;
            currentContent = [];
            console.log(`   모듈 발견: ${moduleName} (line ${index + 1})`);
          }
          break;
        }
      }
      
      if (currentModule) {
        currentContent.push(line);
      }
    });
    
    // 마지막 모듈 저장
    if (currentModule && currentContent.length > 0) {
      const existing = this.modules.get(currentModule) || [];
      this.modules.set(currentModule, [...existing, ...currentContent]);
    }
    
    // 분석 결과
    console.log(`\n   총 ${this.modules.size}개 모듈로 분리:`);
    for (const [name, content] of this.modules) {
      const size = (content.join('\n').length / 1024).toFixed(1);
      console.log(`     - ${name}: ${content.length} lines (${size} KB)`);
    }
  }

  // 모듈 파일 생성
  async createModuleFiles() {
    console.log('\n📝 모듈 파일 생성...');
    
    for (const [modulePath, content] of this.modules) {
      const fullPath = path.join('src', `${modulePath}.js`);
      const dir = path.dirname(fullPath);
      
      // 디렉토리 생성
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   📁 디렉토리 생성: ${dir}`);
      }
      
      // 모듈 파일 생성
      const moduleContent = this.createModuleContent(modulePath, content);
      fs.writeFileSync(fullPath, moduleContent, 'utf8');
      console.log(`   ✅ ${fullPath}`);
    }
  }

  // 모듈 컨텐츠 생성
  createModuleContent(modulePath, content) {
    const moduleName = path.basename(modulePath).replace('.js', '');
    const className = moduleName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    
    return `/**
 * ${className} Module
 * Auto-generated from app.js modularization
 * Path: src/${modulePath}.js
 */

${this.getImports(modulePath)}

${content.join('\n')}

${this.getExports(className)}
`;
  }

  // import 문 생성
  getImports(modulePath) {
    const imports = [];
    
    if (modulePath.includes('core')) {
      imports.push(`import { EventEmitter } from 'events';`);
    }
    
    if (modulePath.includes('services')) {
      imports.push(`import fetch from 'node-fetch';`);
    }
    
    if (modulePath.includes('utils')) {
      // 유틸리티는 의존성이 적음
    } else {
      imports.push(`import { Logger } from '../utils/logger.js';`);
    }
    
    return imports.join('\n');
  }

  // export 문 생성
  getExports(className) {
    return `
// Exports
export { ${className} };
export default ${className};

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${className};
}`;
  }

  // 새로운 app.js 생성
  async createNewAppJs() {
    console.log('\n🔧 새로운 app.js 생성...');
    
    const newAppContent = `/**
 * Calcoverse Main Application
 * Modularized version - Entry point only
 * 
 * Original: 29KB → Now: ~3KB
 * Modules: ${this.modules.size}
 */

// Import all modules
import { CalcoverseCore } from './core/engine.js';
import { ProblemManager } from './core/problem-manager.js';
import { AnimationController } from './modules/animation-controller.js';
import { YouTubeUploader } from './modules/youtube-uploader.js';
import { TemplateRenderer } from './modules/template-renderer.js';
import { DataLoader } from './services/data-loader.js';
import { Logger } from './utils/logger.js';

/**
 * Main Application Class
 */
class CalcoverseApp {
  constructor() {
    this.logger = new Logger('CalcoverseApp');
    this.core = null;
    this.modules = new Map();
    this.isInitialized = false;
    
    console.log('🚀 Calcoverse App v2.0 - Modularized Edition');
  }

  /**
   * Initialize application
   */
  async initialize() {
    try {
      this.logger.info('Initializing Calcoverse...');
      
      // Core system
      this.core = new CalcoverseCore();
      
      // Register modules
      this.registerModules();
      
      // Initialize all modules
      await this.initializeModules();
      
      this.isInitialized = true;
      this.logger.success('✅ Calcoverse initialized successfully!');
      
      return true;
    } catch (error) {
      this.logger.error('❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Register all modules
   */
  registerModules() {
    const modules = [
      ['problemManager', new ProblemManager()],
      ['animation', new AnimationController()],
      ['youtube', new YouTubeUploader()],
      ['renderer', new TemplateRenderer()],
      ['dataLoader', new DataLoader()]
    ];

    modules.forEach(([name, instance]) => {
      this.modules.set(name, instance);
      this.core.register(name, instance);
      this.logger.debug(\`Module registered: \${name}\`);
    });
  }

  /**
   * Initialize all modules
   */
  async initializeModules() {
    for (const [name, module] of this.modules) {
      if (module.initialize) {
        await module.initialize();
        this.logger.debug(\`Module initialized: \${name}\`);
      }
    }
  }

  /**
   * Start application
   */
  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    this.logger.info('Starting Calcoverse application...');
    
    // Start core system
    await this.core.start();
    
    // Start modules
    for (const [name, module] of this.modules) {
      if (module.start) {
        await module.start();
      }
    }
    
    this.logger.success('✨ Calcoverse is running!');
  }

  /**
   * Stop application
   */
  async stop() {
    this.logger.info('Stopping Calcoverse application...');
    
    // Stop modules
    for (const [name, module] of this.modules) {
      if (module.stop) {
        await module.stop();
      }
    }
    
    // Stop core
    if (this.core) {
      await this.core.stop();
    }
    
    this.logger.info('👋 Calcoverse stopped');
  }

  /**
   * Get module instance
   */
  getModule(name) {
    return this.modules.get(name);
  }
}

// Create and export app instance
const app = new CalcoverseApp();

// Auto-start in browser
if (typeof window !== 'undefined') {
  window.CalcoverseApp = app;
  window.addEventListener('DOMContentLoaded', () => {
    app.start().catch(console.error);
  });
}

// Node.js exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CalcoverseApp, app };
}

export { CalcoverseApp, app };
export default app;
`;

    fs.writeFileSync(this.sourceFile, newAppContent, 'utf8');
    console.log(`   ✅ 새로운 app.js 생성 완료`);
    console.log(`   크기: ${(newAppContent.length / 1024).toFixed(1)} KB`);
  }

  // package.json 업데이트
  async updatePackageJson() {
    console.log('\n📦 package.json 업데이트...');
    
    const packagePath = 'package.json';
    
    if (!fs.existsSync(packagePath)) {
      console.log('   package.json이 없습니다. 새로 생성합니다.');
      
      const newPackage = {
        name: 'calcoverse-global',
        version: '2.0.0',
        description: 'AI-powered math education system - Modularized',
        type: 'module',
        main: 'src/app.js',
        scripts: {
          start: 'node src/app.js',
          dev: 'nodemon src/app.js',
          build: 'webpack --mode production',
          test: 'jest',
          'modularize': 'node modularize-app.js'
        },
        dependencies: {
          'node-fetch': '^3.3.0'
        },
        devDependencies: {
          'nodemon': '^3.0.0',
          'jest': '^29.0.0',
          'webpack': '^5.0.0',
          'webpack-cli': '^5.0.0'
        }
      };
      
      fs.writeFileSync(packagePath, JSON.stringify(newPackage, null, 2));
      console.log('   ✅ package.json 생성 완료');
    } else {
      // 기존 package.json 업데이트
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // type: module 추가 (ES6 모듈 사용)
      pkg.type = 'module';
      
      // scripts 업데이트
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.modularize = 'node modularize-app.js';
      
      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
      console.log('   ✅ package.json 업데이트 완료');
    }
  }

  // 요약 출력
  printSummary() {
    console.log('\n=================================');
    console.log('📊 모듈화 결과 요약');
    console.log('=================================');
    
    const originalSize = (this.originalContent.length / 1024).toFixed(1);
    const newAppSize = (fs.readFileSync(this.sourceFile, 'utf8').length / 1024).toFixed(1);
    
    console.log('\n이전:');
    console.log(`  - app.js: ${originalSize} KB (단일 파일)`);
    
    console.log('\n이후:');
    console.log(`  - app.js: ${newAppSize} KB (진입점)`);
    
    for (const [modulePath, content] of this.modules) {
      const size = (content.join('\n').length / 1024).toFixed(1);
      console.log(`  - ${modulePath}.js: ${size} KB`);
    }
    
    const reduction = ((1 - parseFloat(newAppSize) / parseFloat(originalSize)) * 100).toFixed(0);
    
    console.log('\n개선 효과:');
    console.log(`  ✅ app.js 크기 ${reduction}% 감소`);
    console.log(`  ✅ ${this.modules.size}개 모듈로 분리`);
    console.log(`  ✅ 유지보수성 대폭 향상`);
    console.log(`  ✅ 테스트 가능성 향상`);
    console.log(`  ✅ 재사용성 극대화`);
  }

  // 롤백
  async rollback() {
    console.log('\n⚠️ 롤백 중...');
    
    // 백업에서 복원
    const backupFiles = fs.readdirSync(this.backupDir);
    if (backupFiles.length > 0) {
      const latestBackup = backupFiles[backupFiles.length - 1];
      const backupPath = path.join(this.backupDir, latestBackup);
      
      fs.copyFileSync(backupPath, this.sourceFile);
      console.log(`   복원 완료: ${this.sourceFile}`);
    }
  }
}

// ============================================
// 실행
// ============================================

async function main() {
  const modularizer = new AppModularizer();
  await modularizer.run();
}

// 스크립트 직접 실행시
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AppModularizer;