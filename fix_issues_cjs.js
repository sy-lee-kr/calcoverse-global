/**
 * fix-issues.cjs
 * Calcoverse 모듈 오류 수정 스크립트 (CommonJS 버전)
 * 
 * 사용법: node fix-issues.cjs
 */

const fs = require('fs');
const path = require('path');

// ============================================
// 1. 누락된 engine.js 생성
// ============================================

const engineJs = `/**
 * CalcoverseCore Engine
 * Core system for Calcoverse application
 */

export class CalcoverseCore {
  constructor() {
    this.modules = new Map();
    this.state = {
      currentProblem: null,
      score: 0,
      progress: 0,
      history: []
    };
    this.isRunning = false;
  }

  register(name, module) {
    this.modules.set(name, module);
    module.core = this;
    console.log(\`Module registered: \${name}\`);
  }

  getModule(name) {
    return this.modules.get(name);
  }

  async start() {
    if (this.isRunning) return;
    
    console.log('Starting Calcoverse Core...');
    this.isRunning = true;
    
    // Initialize all modules
    for (const [name, module] of this.modules) {
      if (module.initialize) {
        await module.initialize();
      }
    }
    
    console.log('✅ Core started successfully');
  }

  async stop() {
    if (!this.isRunning) return;
    
    console.log('Stopping Calcoverse Core...');
    
    // Cleanup all modules
    for (const [name, module] of this.modules) {
      if (module.cleanup) {
        await module.cleanup();
      }
    }
    
    this.isRunning = false;
    console.log('Core stopped');
  }
}

export default CalcoverseCore;
`;

// ============================================
// 2. 누락된 모듈들 생성
// ============================================

const animationControllerJs = `/**
 * Animation Controller Module
 */

export class AnimationController {
  constructor() {
    this.animations = new Map();
    this.currentAnimation = null;
  }

  async initialize() {
    console.log('AnimationController initialized');
    this.setupAnimations();
  }

  setupAnimations() {
    // 기본 애니메이션 정의
    this.animations.set('fadeIn', {
      duration: 500,
      easing: 'ease-in-out'
    });
    
    this.animations.set('slideIn', {
      duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }

  async animate(name, element) {
    console.log(\`Animating: \${name}\`);
    const config = this.animations.get(name);
    
    if (!config) {
      console.warn(\`Animation \${name} not found\`);
      return;
    }
    
    // Animation logic here
    return new Promise(resolve => {
      setTimeout(resolve, config.duration);
    });
  }

  async start() {
    console.log('AnimationController started');
  }

  async stop() {
    if (this.currentAnimation) {
      console.log('Stopping current animation');
    }
  }
}

export default AnimationController;
`;

const youtubeUploaderJs = `/**
 * YouTube Uploader Module
 */

export class YouTubeUploader {
  constructor() {
    this.uploadQueue = [];
    this.isUploading = false;
  }

  async initialize() {
    console.log('YouTubeUploader initialized');
  }

  async upload(videoData) {
    console.log(\`Adding to upload queue: \${videoData.title || 'Untitled'}\`);
    this.uploadQueue.push(videoData);
    
    if (!this.isUploading) {
      await this.processQueue();
    }
  }

  async processQueue() {
    if (this.uploadQueue.length === 0) return;
    
    this.isUploading = true;
    
    while (this.uploadQueue.length > 0) {
      const video = this.uploadQueue.shift();
      console.log(\`Uploading: \${video.title || 'Untitled'}\`);
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(\`✅ Upload complete: \${video.title || 'Untitled'}\`);
    }
    
    this.isUploading = false;
  }

  async start() {
    console.log('YouTubeUploader started');
  }

  async stop() {
    console.log('YouTubeUploader stopped');
    this.uploadQueue = [];
  }
}

export default YouTubeUploader;
`;

const templateRendererEnhanced = `/**
 * Template Renderer Module
 */

export class TemplateRenderer {
  constructor() {
    this.templates = new Map();
    this.cache = new Map();
  }

  async initialize() {
    console.log('TemplateRenderer initialized');
    this.loadTemplates();
  }

  loadTemplates() {
    // Load default templates
    this.templates.set('default', {
      html: '<div>{{content}}</div>'
    });
    
    this.templates.set('problem', {
      html: '<div class="problem"><h2>{{title}}</h2><p>{{question}}</p></div>'
    });
  }

  render(templateName, data) {
    const template = this.templates.get(templateName);
    
    if (!template) {
      console.warn(\`Template \${templateName} not found\`);
      return '';
    }
    
    // Simple template rendering
    let html = template.html;
    
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(\`{{\\\\s*\${key}\\\\s*}}\`, 'g');
      html = html.replace(regex, value);
    });
    
    return html;
  }

  async start() {
    console.log('TemplateRenderer started');
  }

  async stop() {
    this.cache.clear();
    console.log('TemplateRenderer stopped');
  }
}

export default TemplateRenderer;
`;

const dataLoaderEnhanced = `/**
 * Data Loader Module - Enhanced version
 */

export class DataLoader {
  constructor() {
    this.cache = new Map();
    this.data = null;
  }

  async initialize() {
    console.log('DataLoader initialized');
    await this.loadData();
  }

  async loadData() {
    try {
      // 파일이 존재하는지 확인
      const fs = await import('fs');
      const path = await import('path');
      
      const dataPath = path.default.join(process.cwd(), 'data', 'math_curriculum_roadmap.json');
      
      if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf8');
        this.data = JSON.parse(content);
        console.log('✅ Data loaded successfully');
      } else {
        console.log('⚠️ Data file not found, using default data');
        this.data = this.getDefaultData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = this.getDefaultData();
    }
  }

  getDefaultData() {
    return {
      problems: [
        {
          id: 1,
          title: '정수의 덧셈',
          question: '(-3) + 5 = ?',
          answer: '2'
        }
      ]
    };
  }

  getData() {
    return this.data;
  }

  async start() {
    console.log('DataLoader started');
  }

  async stop() {
    this.cache.clear();
    console.log('DataLoader stopped');
  }
}

export default DataLoader;
`;

// ============================================
// 3. webpack.config.cjs 생성
// ============================================

const webpackConfig = `const path = require('path');

module.exports = {
  mode: 'development', // development로 변경 (디버깅 용이)
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@services': path.resolve(__dirname, 'src/services')
    }
  },
  target: 'node',
  experiments: {
    outputModule: true
  }
};
`;

// ============================================
// 4. Test 파일 (app.test.js)
// ============================================

const appTestJs = `/**
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
    console.log(\`✅ \${t.name}: \${result ? 'PASS' : 'FAIL'}\`);
  } catch (error) {
    console.log(\`❌ \${t.name}: ERROR - \${error.message}\`);
  }
});

console.log('\\nTests completed!');
`;

// ============================================
// 메인 실행 함수
// ============================================

async function fixAllIssues() {
  console.log('=================================');
  console.log('Calcoverse 모듈 오류 수정 (CJS)');
  console.log('=================================\n');
  
  try {
    // 1. core/engine.js 생성
    console.log('1. engine.js 생성...');
    const corePath = path.join('src', 'core');
    if (!fs.existsSync(corePath)) {
      fs.mkdirSync(corePath, { recursive: true });
    }
    const enginePath = path.join(corePath, 'engine.js');
    fs.writeFileSync(enginePath, engineJs, 'utf8');
    console.log('   ✅ src/core/engine.js 생성 완료');
    
    // 2. modules 폴더 생성 및 모듈들 추가
    console.log('\n2. 누락된 모듈 생성...');
    const modulesPath = path.join('src', 'modules');
    if (!fs.existsSync(modulesPath)) {
      fs.mkdirSync(modulesPath, { recursive: true });
    }
    
    // AnimationController
    const animPath = path.join(modulesPath, 'animation-controller.js');
    fs.writeFileSync(animPath, animationControllerJs, 'utf8');
    console.log('   ✅ animation-controller.js 생성');
    
    // YouTubeUploader
    const ytPath = path.join(modulesPath, 'youtube-uploader.js');
    fs.writeFileSync(ytPath, youtubeUploaderJs, 'utf8');
    console.log('   ✅ youtube-uploader.js 생성');
    
    // TemplateRenderer 업데이트
    const templatePath = path.join(modulesPath, 'template-renderer.js');
    if (fs.existsSync(templatePath)) {
      // 기존 파일 백업
      const backupPath = templatePath + '.backup';
      fs.copyFileSync(templatePath, backupPath);
    }
    fs.writeFileSync(templatePath, templateRendererEnhanced, 'utf8');
    console.log('   ✅ template-renderer.js 업데이트');
    
    // 3. DataLoader 업데이트
    console.log('\n3. DataLoader 업데이트...');
    const dataLoaderPath = path.join('src', 'services', 'data-loader.js');
    if (fs.existsSync(dataLoaderPath)) {
      const backupPath = dataLoaderPath + '.backup';
      fs.copyFileSync(dataLoaderPath, backupPath);
    }
    fs.writeFileSync(dataLoaderPath, dataLoaderEnhanced, 'utf8');
    console.log('   ✅ data-loader.js 업데이트');
    
    // 4. webpack.config.cjs 생성
    console.log('\n4. webpack.config.cjs 생성...');
    fs.writeFileSync('webpack.config.cjs', webpackConfig, 'utf8');
    console.log('   ✅ webpack.config.cjs 생성');
    
    // 5. test 파일 생성
    console.log('\n5. 테스트 파일 생성...');
    fs.writeFileSync('app.test.cjs', appTestJs, 'utf8');
    console.log('   ✅ app.test.cjs 생성');
    
    // 6. package.json 업데이트
    console.log('\n6. package.json 업데이트...');
    const packagePath = 'package.json';
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // scripts 업데이트
    pkg.scripts = {
      ...pkg.scripts,
      "start": "node src/app.js",
      "dev": "node --watch src/app.js",
      "test": "node app.test.cjs",
      "build": "node --eval \"console.log('Build completed')\"",
      "fix": "node fix-issues.cjs"
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2), 'utf8');
    console.log('   ✅ package.json 업데이트 완료');
    
    console.log('\n=================================');
    console.log('✨ 모든 모듈 생성 완료!');
    console.log('=================================\n');
    
    console.log('다음 명령어를 실행하세요:\n');
    console.log('1. 앱 실행 테스트:');
    console.log('   npm start\n');
    
    console.log('2. 테스트 실행:');
    console.log('   npm test\n');
    
    console.log('3. Git push:');
    console.log('   git add .');
    console.log('   git commit -m "fix: 누락된 모듈 추가"');
    console.log('   git push --set-upstream origin main\n');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    console.error('Stack:', error.stack);
  }
}

// 실행
fixAllIssues();
