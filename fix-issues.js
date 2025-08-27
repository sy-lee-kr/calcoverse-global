/**
 * Calcoverse 모듈 오류 수정 스크립트
 * 1. 누락된 engine.js 생성
 * 2. package.json 수정
 * 3. 빌드 설정 추가
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
// 2. 누락된 모듈 스텁(stub) 생성
// ============================================

const animationControllerJs = `/**
 * Animation Controller Module
 */

export class AnimationController {
  constructor() {
    this.animations = new Map();
  }

  async initialize() {
    console.log('AnimationController initialized');
  }

  async animate(name, element) {
    console.log(\`Animating: \${name}\`);
    // Animation logic here
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
  }

  async initialize() {
    console.log('YouTubeUploader initialized');
  }

  async upload(videoData) {
    console.log(\`Uploading: \${videoData.title}\`);
    // Upload logic here
  }
}

export default YouTubeUploader;
`;

const templateRendererJs = `/**
 * Template Renderer Module
 * (이미 생성되었지만 export 추가)
 */

import { Logger } from '../utils/logger.js';

export class TemplateRenderer {
  constructor() {
    this.templates = new Map();
  }

  async initialize() {
    console.log('TemplateRenderer initialized');
  }

  render(template, data) {
    // Rendering logic
    return template.replace(/{{(\\w+)}}/g, (match, key) => data[key] || '');
  }
}

export default TemplateRenderer;
`;

// ============================================
// 3. package.json 수정
// ============================================

const packageJsonContent = {
  "name": "calcoverse-global",
  "version": "2.0.0",
  "description": "AI-powered math education system for global middle school students",
  "type": "module",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "build": "webpack --config webpack.config.js",
    "test": "jest",
    "modularize": "node modularize-app.js",
    "consolidate": "node consolidate-html.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sy-lee-kr/calcoverse-global.git"
  },
  "keywords": [
    "math",
    "education",
    "AI",
    "animation",
    "youtube"
  ],
  "author": "sy-lee-kr",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  }
};

// ============================================
// 4. webpack.config.js 생성
// ============================================

const webpackConfig = `const path = require('path');

module.exports = {
  mode: 'production',
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
  target: 'node'
};
`;

// ============================================
// 5. 모든 모듈에 export 추가 확인 스크립트
// ============================================

const fixExportsJs = `/**
 * 모든 모듈 파일에 적절한 export 추가
 */

const fs = require('fs');
const path = require('path');

function ensureExports(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.js');
  const className = fileName.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join('');
  
  // export가 없으면 추가
  if (!content.includes('export')) {
    content += \`\\n\\nexport default \${className};\\n\`;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(\`✅ Export added to \${filePath}\`);
    return true;
  }
  return false;
}

// 모든 모듈 파일 확인
const modulePaths = [
  'src/core/problem-manager.js',
  'src/services/data-loader.js',
  'src/utils/logger.js',
  'src/modules/template-renderer.js'
];

modulePaths.forEach(ensureExports);
`;

// ============================================
// 6. Git 설정 수정
// ============================================

const gitCommands = `#!/bin/bash
# Git upstream 설정 및 푸시

# upstream 설정
git push --set-upstream origin main

# 또는 기본 설정으로 변경
git config --global push.autoSetupRemote true
git push
`;

// ============================================
// 실행 함수
// ============================================

async function fixAllIssues() {
  console.log('=================================');
  console.log('Calcoverse 모듈 오류 수정');
  console.log('=================================\n');
  
  try {
    // 1. engine.js 생성
    console.log('1. engine.js 생성...');
    const enginePath = path.join('src', 'core', 'engine.js');
    fs.writeFileSync(enginePath, engineJs, 'utf8');
    console.log('   ✅ src/core/engine.js 생성 완료');
    
    // 2. 누락된 모듈들 생성
    console.log('\n2. 누락된 모듈 생성...');
    
    // AnimationController
    const animPath = path.join('src', 'modules', 'animation-controller.js');
    if (!fs.existsSync(animPath)) {
      fs.writeFileSync(animPath, animationControllerJs, 'utf8');
      console.log('   ✅ src/modules/animation-controller.js 생성 완료');
    }
    
    // YouTubeUploader  
    const ytPath = path.join('src', 'modules', 'youtube-uploader.js');
    if (!fs.existsSync(ytPath)) {
      fs.writeFileSync(ytPath, youtubeUploaderJs, 'utf8');
      console.log('   ✅ src/modules/youtube-uploader.js 생성 완료');
    }
    
    // 3. package.json 업데이트
    console.log('\n3. package.json 업데이트...');
    fs.writeFileSync('package.json', JSON.stringify(packageJsonContent, null, 2), 'utf8');
    console.log('   ✅ package.json 업데이트 완료');
    
    // 4. webpack.config.js 생성
    console.log('\n4. webpack.config.js 생성...');
    fs.writeFileSync('webpack.config.js', webpackConfig, 'utf8');
    console.log('   ✅ webpack.config.js 생성 완료');
    
    // 5. fix-exports.js 생성
    console.log('\n5. 모듈 export 수정 스크립트 생성...');
    fs.writeFileSync('fix-exports.js', fixExportsJs, 'utf8');
    console.log('   ✅ fix-exports.js 생성 완료');
    
    // 6. git-setup.sh 생성
    console.log('\n6. Git 설정 스크립트 생성...');
    fs.writeFileSync('git-setup.sh', gitCommands, 'utf8');
    console.log('   ✅ git-setup.sh 생성 완료');
    
    console.log('\n=================================');
    console.log('✨ 모든 오류 수정 완료!');
    console.log('=================================\n');
    
    console.log('다음 명령어를 실행하세요:\n');
    console.log('1. Export 수정:');
    console.log('   node fix-exports.js\n');
    
    console.log('2. Git push:');
    console.log('   git push --set-upstream origin main\n');
    
    console.log('3. 앱 실행 테스트:');
    console.log('   npm start\n');
    
    console.log('4. 빌드 테스트:');
    console.log('   npm run build\n');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

// 실행
if (require.main === module) {
  fixAllIssues();
}

module.exports = { fixAllIssues };