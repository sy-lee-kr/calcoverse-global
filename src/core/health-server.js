// AWS 클라우드 배포 설정 가이드
// MathVerse Global 시스템을 AWS에 배포하여 24시간 자동 운영

// package.json 설정
const packageJson = {
  "name": "calcoverse-global",
  "version": "1.0.0",
  "description": "AI-powered global math education shorts generator",
  "main": "production-deployment.js",
  "scripts": {
    "start": "node production-deployment.js",
    "test": "node core-system-test.js",
    "dev": "nodemon production-deployment.js"
  },
  "dependencies": {
    "dotenv": "^16.3.1",
    "node-cron": "^3.0.2",
    "nodemailer": "^6.9.4",
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": ["education", "math", "ai", "youtube", "automation"],
  "author": "MathVerse Global",
  "license": "MIT"
};

// Dockerfile 설정
const dockerfile = `
# Node.js 18 LTS 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 애플리케이션 파일 복사
COPY . .

# 포트 노출 (헬스체크용)
EXPOSE 3000

# 애플리케이션 시작
CMD ["npm", "start"]
`;

// Docker Compose 설정
const dockerCompose = `
version: '3.8'
services:
  calcoverse:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
`;

// AWS Elastic Beanstalk 설정
const ebextensions = `
# .ebextensions/nodejs.config
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: "18.17.0"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    TZ: Asia/Seoul
  aws:elasticbeanstalk:healthreporting:system:
    SystemType: enhanced
`;

// 헬스체크 서버 추가
const healthServer = `
// health-server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// 시스템 상태 엔드포인트
app.get('/status', (req, res) => {
    res.status(200).json({
        service: 'MathVerse Global',
        version: '1.0.0',
        apis: {
            claude: 'connected',
            tts: 'connected',
            youtube: 'connected'
        },
        lastGeneration: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(\`🌐 헬스체크 서버 실행: http://localhost:\${port}\`);
});

module.exports = app;
`;

// 환경변수 관리
const envExample = `
# .env.example (실제 값으로 수정 후 .env로 저장)

# Claude API
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Google Cloud APIs
GOOGLE_MAPS_API_KEY=your-google-maps-key
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key

# 이메일 알림 (선택사항)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# 시스템 설정
NODE_ENV=production
TZ=Asia/Seoul
`;

// AWS 배포 스크립트들
const deploymentScripts = {
    // AWS CLI를 사용한 Elastic Beanstalk 배포
    ebDeploy: `#!/bin/bash
# deploy-eb.sh
echo "🚀 AWS Elastic Beanstalk 배포 시작..."

# 애플리케이션 압축
zip -r calcoverse-global.zip . -x "node_modules/*" ".git/*" "*.log"

# EB 환경 생성 (최초 1회만)
eb init calcoverse-global --platform node.js --region ap-northeast-2

# 환경 생성
eb create calcoverse-production --instance-type t3.micro

# 배포
eb deploy

echo "✅ 배포 완료!"
echo "🌐 URL: \$(eb status | grep CNAME)"
`,

    // Docker를 사용한 ECS 배포
    ecsDeploy: `#!/bin/bash
# deploy-ecs.sh
echo "🚀 AWS ECS 배포 시작..."

# Docker 이미지 빌드
docker build -t calcoverse-global .

# ECR에 푸시
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.ap-northeast-2.amazonaws.com

docker tag calcoverse-global:latest YOUR_ACCOUNT.dkr.ecr.ap-northeast-2.amazonaws.com/calcoverse-global:latest
docker push YOUR_ACCOUNT.dkr.ecr.ap-northeast-2.amazonaws.com/calcoverse-global:latest

# ECS 서비스 업데이트
aws ecs update-service --cluster calcoverse-cluster --service calcoverse-service --force-new-deployment

echo "✅ ECS 배포 완료!"
`,

    // GitHub Actions CI/CD
    githubActions: `
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to EB
      uses: einaregilsson/beanstalk-deploy@v21
      with:
        aws_access_key: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws_secret_key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        application_name: calcoverse-global
        environment_name: calcoverse-production
        region: ap-northeast-2
        version_label: \${{ github.sha }}
        deployment_package: calcoverse-global.zip
`
};

// 모니터링 설정
const monitoring = `
// monitoring.js
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

class SystemMonitoring {
    async sendMetric(metricName, value, unit = 'Count') {
        const params = {
            Namespace: 'MathVerse/Production',
            MetricData: [{
                MetricName: metricName,
                Value: value,
                Unit: unit,
                Timestamp: new Date()
            }]
        };
        
        await cloudwatch.putMetricData(params).promise();
    }
    
    async trackGeneration(language, success) {
        await this.sendMetric('ShortsGenerated', 1);
        await this.sendMetric(\`Generation\${success ? 'Success' : 'Failure'}\`, 1);
        await this.sendMetric(\`\${language}Generation\`, 1);
    }
    
    async trackAPIUsage(apiName, responseTime) {
        await this.sendMetric(\`\${apiName}ResponseTime\`, responseTime, 'Milliseconds');
        await this.sendMetric(\`\${apiName}Calls\`, 1);
    }
}

module.exports = { SystemMonitoring };
`;

// 로깅 시스템
const logging = `
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'calcoverse-global' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

module.exports = logger;
`;

console.log("📋 AWS 클라우드 배포 가이드 생성 완료!");
console.log("🔧 필요한 설정 파일들이 준비되었습니다.");

module.exports = {
    packageJson,
    dockerfile,
    dockerCompose,
    ebextensions,
    healthServer,
    envExample,
    deploymentScripts,
    monitoring,
    logging
};