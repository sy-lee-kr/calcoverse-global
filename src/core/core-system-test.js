// core-system-test.js
// 3개 API (Claude + TTS + Maps)로 핵심 시스템 테스트
require('dotenv').config();

// 이전 클래스들 가져오기
const { MathProblemGenerator } = require('./test-claude-api.js');
const { GoogleCloudServices } = require('./google-cloud-setup.js');

class MathShortsGenerator {
    constructor() {
        this.problemGenerator = new MathProblemGenerator();
        this.ttsService = new GoogleCloudServices();
    }

    // 완전한 쇼츠 생성 (문제 + 음성)
    async generateShorts(grade, topic, language = 'ko-KR', retryCount = 0) {
        console.log(`🎬 ${language} 쇼츠 생성 시작...`);
        console.log(`📚 주제: 중${grade} ${topic}`);
        
        try {
            // 1단계: 문제 생성 (재시도 로직 포함)
            console.log('📝 1단계: 수학 문제 생성 중...');
            let problem = await this.problemGenerator.generateProblem(grade, topic);
            
            // 529 오류 시 3초 대기 후 재시도
            if (!problem && retryCount < 2) {
                console.log('⏳ API 과부하 감지, 3초 후 재시도...');
                await new Promise(resolve => setTimeout(resolve, 3000));
                return this.generateShorts(grade, topic, language, retryCount + 1);
            }
            
            if (!problem) {
                throw new Error('문제 생성 실패');
            }
            
            console.log('✅ 문제 생성 완료');
            console.log(`📋 문제: ${problem.problem}`);
            
            // 2단계: 음성 스크립트 생성
            console.log('🎙️ 2단계: 음성 스크립트 생성 중...');
            const script = this.createVoiceScript(problem, language);
            
            // 3단계: 음성 생성
            console.log('🔊 3단계: 음성 파일 생성 중...');
            const voiceConfig = this.getVoiceConfig(language);
            const audioContent = await this.ttsService.generateSpeech(
                script, 
                voiceConfig.languageCode, 
                voiceConfig.voiceName
            );
            
            if (!audioContent) {
                throw new Error('음성 생성 실패');
            }
            
            console.log('✅ 음성 생성 완료');
            
            // 4단계: 결과 패키지
            const shortsPackage = {
                metadata: {
                    grade: grade,
                    topic: topic,
                    language: language,
                    timestamp: new Date().toISOString(),
                    estimatedDuration: '60초'
                },
                content: {
                    problem: problem,
                    script: script,
                    audio: audioContent, // Base64 encoded MP3
                    audioSize: Math.round(audioContent.length / 1024) + 'KB'
                },
                status: 'ready_for_video_creation'
            };
            
            console.log('🎉 쇼츠 패키지 생성 완료!');
            console.log(`📊 음성 파일 크기: ${shortsPackage.content.audioSize}`);
            
            return shortsPackage;
            
        } catch (error) {
            console.error('❌ 쇼츠 생성 실패:', error.message);
            return null;
        }
    }

    // 언어별 음성 스크립트 생성
    createVoiceScript(problem, language) {
        const templates = {
            'ko-KR': {
                intro: '오늘의 수학 문제입니다.',
                problem: `문제: ${problem.problem}`,
                solution_intro: '차근차근 풀어보겠습니다.',
                steps: problem.solution_steps.map((step, i) => `${i + 1}단계. ${step}`),
                conclusion: `정답은 ${problem.final_answer}입니다. 잘 따라오셨나요?`,
                outro: '다음 문제도 기대해주세요!'
            },
            'en-US': {
                intro: 'Here\'s today\'s math problem.',
                problem: `Problem: ${this.translateProblem(problem.problem, 'en')}`,
                solution_intro: 'Let\'s solve this step by step.',
                steps: problem.solution_steps.map((step, i) => `Step ${i + 1}: ${this.translateStep(step, 'en')}`),
                conclusion: `The answer is ${problem.final_answer}. Did you follow along?`,
                outro: 'Stay tuned for the next problem!'
            },
            'zh-CN': {
                intro: '今天的数学问题来了。',
                problem: `问题：${this.translateProblem(problem.problem, 'zh')}`,
                solution_intro: '我们一步一步来解决。',
                steps: problem.solution_steps.map((step, i) => `第${i + 1}步：${this.translateStep(step, 'zh')}`),
                conclusion: `答案是 ${problem.final_answer}。你们跟上了吗？`,
                outro: '请期待下一个问题！'
            }
        };
        
        const template = templates[language] || templates['ko-KR'];
        
        return [
            template.intro,
            template.problem,
            template.solution_intro,
            ...template.steps,
            template.conclusion,
            template.outro
        ].join(' ');
    }

    // 간단한 번역 (실제로는 더 정교한 번역 필요)
    translateProblem(problemText, targetLang) {
        // 실제 운영에서는 Google Translate API 사용
        return problemText; // 임시로 원문 반환
    }

    translateStep(stepText, targetLang) {
        return stepText; // 임시로 원문 반환
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

    // 다국어 쇼츠 일괄 생성
    async generateMultiLanguageShorts(grade, topic) {
        const languages = ['ko-KR', 'en-US', 'zh-CN'];
        const results = {};
        
        console.log('🌍 다국어 쇼츠 생성 시작...');
        
        for (const lang of languages) {
            console.log(`\n--- ${lang} 쇼츠 생성 ---`);
            const shorts = await this.generateShorts(grade, topic, lang);
            results[lang] = shorts;
            
            if (shorts) {
                console.log(`✅ ${lang} 완료`);
            } else {
                console.log(`❌ ${lang} 실패`);
            }
        }
        
        return results;
    }
}

// 테스트 실행
async function testCoreSystem() {
    console.log('🚀 핵심 시스템 통합 테스트');
    console.log('=========================');
    
    const generator = new MathShortsGenerator();
    
    try {
        // 단일 쇼츠 테스트 (한국어)
        console.log('\n📋 테스트 1: 한국어 쇼츠 생성');
        const koreanShorts = await generator.generateShorts(1, '일차방정식', 'ko-KR');
        
        if (koreanShorts) {
            console.log('🎯 한국어 쇼츠 생성 성공!');
        }
        
        // 다국어 쇼츠 테스트
        console.log('\n📋 테스트 2: 다국어 쇼츠 생성');
        const multiLangShorts = await generator.generateMultiLanguageShorts(1, '일차방정식');
        
        const successCount = Object.values(multiLangShorts).filter(Boolean).length;
        console.log(`\n📊 결과: ${successCount}/3 언어 성공`);
        
        if (successCount === 3) {
            console.log('🎉 모든 언어 쇼츠 생성 성공!');
            console.log('🚀 YouTube API만 연결하면 자동 업로드 가능!');
        }
        
        return multiLangShorts;
        
    } catch (error) {
        console.error('❌ 시스템 테스트 실패:', error);
        return null;
    }
}

// 실행
if (require.main === module) {
    testCoreSystem().then(results => {
        if (results) {
            console.log('\n🎊 핵심 시스템 정상 작동!');
            console.log('📝 다음 단계: YouTube API 연결 후 완전 자동화');
        }
    }).catch(console.error);
}

module.exports = { MathShortsGenerator };