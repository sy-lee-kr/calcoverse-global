// production-deployment.js
// 완전 자동화된 수학 쇼츠 생성 및 배포 시스템

require('dotenv').config();
const cron = require('node-cron');

// 기존 클래스들 통합
const { MathProblemGenerator } = require('./test-claude-api.js');
const { GoogleCloudServices } = require('./google-cloud-setup.js');
const { YouTubeUploader } = require('./youtube-api-setup.js');

class MathVerseProd {
    constructor() {
        this.problemGenerator = new MathProblemGenerator();
        this.ttsService = new GoogleCloudServices();
        this.youtubeUploader = new YouTubeUploader();
        
        // 교육과정 설정
        this.curriculum = this.initializeCurriculum();
        this.currentWeek = 1;
        this.isRunning = false;
        
        // 성과 추적
        this.stats = {
            totalProblems: 0,
            totalVideos: 0,
            successRate: 0,
            lastUpdate: new Date()
        };
    }

    // 52주 완전 교육과정 설정
    initializeCurriculum() {
        return {
            중1: [
                // 1-13주: 일차방정식
                ...Array(13).fill().map((_, i) => ({
                    week: i + 1,
                    topic: '일차방정식',
                    difficulty: Math.floor(i / 4) + 1, // 주차별 난이도 상승
                    subtopic: ['기본', '복잡한 계수', '괄호가 있는 식', '실생활 응용'][Math.floor(i / 4)] || '심화'
                })),
                // 14-26주: 연립방정식
                ...Array(13).fill().map((_, i) => ({
                    week: i + 14,
                    topic: '연립방정식',
                    difficulty: Math.floor(i / 4) + 1,
                    subtopic: ['기본', '대입법', '가감법', '실생활 응용'][Math.floor(i / 4)] || '심화'
                })),
                // 27-39주: 함수
                ...Array(13).fill().map((_, i) => ({
                    week: i + 27,
                    topic: '함수',
                    difficulty: Math.floor(i / 4) + 1,
                    subtopic: ['함수의 뜻', '일차함수', '그래프', '실생활 응용'][Math.floor(i / 4)] || '심화'
                })),
                // 40-52주: 기하와 통계
                ...Array(13).fill().map((_, i) => ({
                    week: i + 40,
                    topic: i < 7 ? '기하' : '통계',
                    difficulty: Math.floor(i / 4) + 1,
                    subtopic: i < 7 ? '도형의 성질' : '확률과 통계'
                }))
            ],
            중2: [
                // 비슷한 방식으로 중2 과정 52주 구성
                ...Array(52).fill().map((_, i) => ({
                    week: i + 1,
                    topic: ['유리수와 소수', '식의 계산', '일차부등식', '연립방정식 활용'][Math.floor(i / 13)] || '종합',
                    difficulty: Math.floor(i / 13) + 1
                }))
            ],
            중3: [
                // 중3 과정 52주 구성
                ...Array(52).fill().map((_, i) => ({
                    week: i + 1,
                    topic: ['이차방정식', '이차함수', '삼각비', '원과 직선'][Math.floor(i / 13)] || '종합',
                    difficulty: Math.floor(i / 13) + 1
                }))
            ]
        };
    }

    // 일일 쇼츠 생성 (아침 8시, 점심 1시)
    async generateDailyShorts() {
        if (this.isRunning) {
            console.log('⚠️ 이미 실행 중입니다. 중복 실행 방지.');
            return;
        }

        this.isRunning = true;
        const today = new Date();
        const timeSlot = today.getHours() < 12 ? 'morning' : 'afternoon';
        
        console.log(`🌅 ${timeSlot === 'morning' ? '아침' : '점심'} 쇼츠 생성 시작 (${today.toLocaleString('ko-KR')})`);
        
        try {
            // 오늘의 교육과정 선택
            const todaysCurriculum = this.selectTodaysCurriculum();
            
            // 5개 언어 동시 생성
            const languages = ['ko-KR', 'en-US', 'zh-CN', 'ja-JP', 'es-ES'];
            const results = {};
            
            for (const lang of languages) {
                console.log(`\n🌍 ${lang} 쇼츠 생성 중...`);
                
                const shorts = await this.generateShorts(
                    todaysCurriculum.grade,
                    todaysCurriculum.topic,
                    lang,
                    todaysCurriculum.difficulty
                );
                
                if (shorts) {
                    // 업로드 시뮬레이션 (실제로는 OAuth 연결 후 실제 업로드)
                    const uploadResult = await this.youtubeUploader.simulateUpload(
                        shorts, 
                        this.getChannelName(lang)
                    );
                    
                    results[lang] = {
                        shorts: shorts,
                        upload: uploadResult,
                        status: 'success'
                    };
                    
                    console.log(`✅ ${lang} 완료: ${uploadResult.url}`);
                    this.stats.totalVideos++;
                } else {
                    results[lang] = { status: 'failed' };
                    console.log(`❌ ${lang} 실패`);
                }
            }
            
            // 성과 업데이트
            const successCount = Object.values(results).filter(r => r.status === 'success').length;
            this.stats.successRate = (successCount / languages.length) * 100;
            this.stats.totalProblems++;
            this.stats.lastUpdate = new Date();
            
            // 선생님께 이메일 알림
            await this.sendTeacherNotification(results, todaysCurriculum);
            
            console.log(`\n📊 오늘 결과: ${successCount}/${languages.length} 성공`);
            console.log(`📈 전체 성공률: ${this.stats.successRate.toFixed(1)}%`);
            
            return results;
            
        } catch (error) {
            console.error('❌ 일일 쇼츠 생성 실패:', error);
            await this.sendErrorNotification(error);
        } finally {
            this.isRunning = false;
        }
    }

    // 오늘의 교육과정 선택
    selectTodaysCurriculum() {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const weekOfYear = Math.floor(dayOfYear / 7) + 1;
        const weekInCycle = weekOfYear % 52 || 52;
        
        // 요일별 학년 순환 (월:중1, 화:중2, 수:중3, 목:중1, 금:중2, 토:중3, 일:복습)
        const dayOfWeek = new Date().getDay();
        const grades = [3, 1, 2, 3, 1, 2, 'review']; // 일요일부터 시작
        const grade = grades[dayOfWeek];
        
        if (grade === 'review') {
            // 일요일은 지난 주 복습
            return {
                grade: 1 + (weekInCycle % 3),
                topic: '복습',
                difficulty: 2,
                week: weekInCycle
            };
        }
        
        const curriculum = this.curriculum[`중${grade}`];
        const weekData = curriculum[weekInCycle - 1] || curriculum[0];
        
        return {
            grade: grade,
            topic: weekData.topic,
            difficulty: weekData.difficulty,
            week: weekInCycle,
            subtopic: weekData.subtopic
        };
    }

    // 개별 쇼츠 생성
    async generateShorts(grade, topic, language, difficulty) {
        try {
            // 1. 문제 생성 (재시도 로직 포함)
            const problem = await this.generateProblemWithRetry(grade, topic, difficulty);
            if (!problem) return null;
            
            // 2. 음성 스크립트 생성
            const script = this.createLocalizedScript(problem, language);
            
            // 3. 음성 생성
            const voiceConfig = this.getVoiceConfig(language);
            const audioContent = await this.ttsService.generateSpeech(
                script, 
                voiceConfig.languageCode, 
                voiceConfig.voiceName
            );
            
            if (!audioContent) return null;
            
            // 4. 쇼츠 패키지 생성
            return {
                id: `shorts_${Date.now()}_${language}`,
                metadata: {
                    grade: grade,
                    topic: topic,
                    language: language,
                    difficulty: difficulty,
                    timestamp: new Date().toISOString(),
                    estimatedDuration: '60초'
                },
                content: {
                    problem: problem,
                    script: script,
                    audio: audioContent,
                    audioSize: Math.round(audioContent.length / 1024) + 'KB'
                },
                status: 'ready_for_upload'
            };
            
        } catch (error) {
            console.error(`쇼츠 생성 실패 (${language}):`, error.message);
            return null;
        }
    }

    // Claude API 재시도 로직
    async generateProblemWithRetry(grade, topic, difficulty, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const problem = await this.problemGenerator.generateProblem(
                    grade, 
                    topic, 
                    ['easy', 'medium', 'hard'][difficulty - 1] || 'medium'
                );
                
                if (problem) return problem;
                
            } catch (error) {
                if (error.message.includes('529') && i < maxRetries - 1) {
                    console.log(`⏳ API 과부하 감지, ${3 * (i + 1)}초 후 재시도...`);
                    await new Promise(resolve => setTimeout(resolve, 3000 * (i + 1)));
                    continue;
                }
                
                console.error(`문제 생성 실패 (시도 ${i + 1}/${maxRetries}):`, error.message);
            }
        }
        
        return null;
    }

    // 언어별 채널명
    getChannelName(language) {
        const channels = {
            'ko-KR': 'MathVerse Korea',
            'en-US': 'MathVerse Global',
            'zh-CN': 'MathVerse 中文',
            'ja-JP': 'MathVerse 日本',
            'es-ES': 'MathVerse Español'
        };
        return channels[language] || 'MathVerse Global';
    }

    // 언어별 음성 설정
    getVoiceConfig(language) {
        const configs = {
            'ko-KR': { languageCode: 'ko-KR', voiceName: 'ko-KR-Standard-A' },
            'en-US': { languageCode: 'en-US', voiceName: 'en-US-Standard-A' },
            'zh-CN': { languageCode: 'cmn-CN', voiceName: 'cmn-CN-Standard-A' },
            'ja-JP': { languageCode: 'ja-JP', voiceName: 'ja-JP-Standard-A' },
            'es-ES': { languageCode: 'es-ES', voiceName: 'es-ES-Standard-A' }
        };
        return configs[language] || configs['ko-KR'];
    }

    // 현지화된 스크립트 생성
    createLocalizedScript(problem, language) {
        // 언어별 템플릿 (간소화 버전)
        const templates = {
            'ko-KR': `오늘의 수학 문제입니다. ${problem.problem} 차근차근 풀어보겠습니다. ${problem.solution_steps.join(' ')} 정답은 ${problem.final_answer}입니다.`,
            'en-US': `Today's math problem: ${problem.problem} Let's solve step by step. ${problem.solution_steps.join(' ')} The answer is ${problem.final_answer}.`,
            'zh-CN': `今天的数学问题：${problem.problem} 我们一步一步解决。${problem.solution_steps.join(' ')} 答案是 ${problem.final_answer}。`,
            'ja-JP': `今日の数学問題です。${problem.problem} 順番に解いていきましょう。${problem.solution_steps.join(' ')} 答えは ${problem.final_answer} です。`,
            'es-ES': `Problema de matemáticas de hoy: ${problem.problem} Resolvamos paso a paso. ${problem.solution_steps.join(' ')} La respuesta es ${problem.final_answer}.`
        };
        
        return templates[language] || templates['ko-KR'];
    }

    // 선생님 알림 시스템
    async sendTeacherNotification(results, curriculum) {
        const successCount = Object.values(results).filter(r => r.status === 'success').length;
        
        console.log('\n📧 선생님 알림 시뮬레이션:');
        console.log('=======================');
        console.log(`📚 오늘의 주제: 중${curriculum.grade} ${curriculum.topic}`);
        console.log(`📊 생성 결과: ${successCount}/5 언어 성공`);
        console.log(`🎬 총 영상: ${this.stats.totalVideos}개`);
        console.log(`📈 성공률: ${this.stats.successRate.toFixed(1)}%`);
        console.log(`⏰ 시간: ${new Date().toLocaleString('ko-KR')}`);
        
        // 실제로는 이메일 발송
        // await this.emailService.send(teacherEmail, subject, content);
    }

    // 오류 알림
    async sendErrorNotification(error) {
        console.log('\n🚨 오류 알림:');
        console.log(`❌ 오류: ${error.message}`);
        console.log(`⏰ 시간: ${new Date().toLocaleString('ko-KR')}`);
    }

    // 크론 작업 설정
    startAutomation() {
        console.log('🚀 24시간 자동화 시스템 시작!');
        console.log('==============================');
        
        // 매일 아침 8시
        cron.schedule('0 8 * * *', () => {
            console.log('🌅 아침 쇼츠 생성 시작...');
            this.generateDailyShorts();
        }, {
            timezone: "Asia/Seoul"
        });
        
        // 매일 점심 1시
        cron.schedule('0 13 * * *', () => {
            console.log('🌞 점심 쇼츠 생성 시작...');
            this.generateDailyShorts();
        }, {
            timezone: "Asia/Seoul"
        });
        
        // 매주 일요일 밤 11시 - 주간 리포트
        cron.schedule('0 23 * * 0', () => {
            this.generateWeeklyReport();
        }, {
            timezone: "Asia/Seoul"
        });
        
        console.log('✅ 크론 작업 설정 완료');
        console.log('📅 스케줄: 매일 오전 8시, 오후 1시');
        console.log('📊 주간 리포트: 일요일 밤 11시');
    }

    // 주간 리포트
    async generateWeeklyReport() {
        console.log('\n📊 주간 성과 리포트');
        console.log('==================');
        console.log(`📈 성공률: ${this.stats.successRate.toFixed(1)}%`);
        console.log(`🎬 총 영상: ${this.stats.totalVideos}개`);
        console.log(`📚 총 문제: ${this.stats.totalProblems}개`);
        console.log(`📅 현재 주차: ${this.currentWeek}/52`);
    }

    // 수동 테스트 실행
    async runTest() {
        console.log('🧪 수동 테스트 실행');
        await this.generateDailyShorts();
    }
}

// 메인 시스템 시작
async function startMathVerseProduction() {
    console.log('🚀 MathVerse Global 프로덕션 시작!');
    console.log('====================================');
    
    const system = new MathVerseProd();
    
    // 테스트 모드 실행
    console.log('🧪 테스트 모드로 1회 실행...');
    await system.runTest();
    
    // 자동화 시작 여부 확인
    console.log('\n❓ 24시간 자동화를 시작하시겠습니까?');
    console.log('💡 실제 운영에서는 system.startAutomation() 호출');
    
    // system.startAutomation(); // 실제 운영시 활성화
    
    return system;
}

// 패키지 설치 안내
function showPackageRequirements() {
    console.log('📦 필요한 패키지 설치:');
    console.log('npm install node-cron');
    console.log('npm install nodemailer (이메일 알림용)');
}

if (require.main === module) {
    showPackageRequirements();
    startMathVerseProduction().catch(console.error);
}

module.exports = { MathVerseProd };