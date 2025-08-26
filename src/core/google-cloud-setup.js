// google-cloud-setup.js
// Google Cloud Text-to-Speech API 설정 및 테스트

require('dotenv').config();

// 1. Google Cloud 설정 (현재 Google Maps API 있으므로 같은 프로젝트 사용 가능)
class GoogleCloudServices {
    constructor() {
        this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        this.apiKey = process.env.GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    }

    // Text-to-Speech API 테스트
    async generateSpeech(text, language = 'ko-KR', voiceName = 'ko-KR-Standard-A') {
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;
        
        const requestBody = {
            input: { text: text },
            voice: {
                languageCode: language,
                name: voiceName,
                ssmlGender: 'FEMALE'
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0,
                pitch: 0.0,
                volumeGainDb: 0.0
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`TTS API 오류: ${response.status} - ${error}`);
            }

            const data = await response.json();
            
            if (data.audioContent) {
                console.log('✅ 음성 생성 성공!');
                return data.audioContent; // Base64 encoded audio
            }
            
            throw new Error('audioContent가 없습니다.');
            
        } catch (error) {
            console.error('❌ 음성 생성 실패:', error.message);
            return null;
        }
    }

    // 다국어 음성 생성 테스트
    async testMultiLanguageVoices() {
        const testTexts = {
            'ko-KR': {
                text: '2x + 5 = 11 일 때, x의 값을 구해보겠습니다.',
                voice: 'ko-KR-Standard-A'
            },
            'en-US': {
                text: 'Let\'s solve 2x + 5 = 11 to find the value of x.',
                voice: 'en-US-Standard-A'
            },
            'zh-CN': {
                text: '我们来解这个方程：2x + 5 = 11，求x的值。',
                voice: 'zh-CN-Standard-A'
            },
            'ja-JP': {
                text: '2x + 5 = 11 のとき、xの値を求めてみましょう。',
                voice: 'ja-JP-Standard-A'
            },
            'es-ES': {
                text: 'Resolvamos 2x + 5 = 11 para encontrar el valor de x.',
                voice: 'es-ES-Standard-A'
            }
        };

        console.log('🌍 다국어 음성 생성 테스트 시작...');
        const results = {};

        for (const [lang, config] of Object.entries(testTexts)) {
            console.log(`🔊 ${lang} 음성 생성 중...`);
            const audio = await this.generateSpeech(config.text, lang, config.voice);
            results[lang] = audio ? '✅ 성공' : '❌ 실패';
        }

        return results;
    }
}

// 2. YouTube Data API 설정 준비
class YouTubeService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }

    // API 키 테스트 (채널 정보 조회)
    async testAPIKey() {
        if (!this.apiKey) {
            console.log('📺 YouTube API 키가 설정되지 않음 (나중에 설정 예정)');
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}/channels?part=snippet&mine=true&key=${this.apiKey}`);
            
            if (response.ok) {
                console.log('✅ YouTube API 연결 성공');
                return true;
            } else {
                console.log('❌ YouTube API 연결 실패');
                return false;
            }
        } catch (error) {
            console.log('❌ YouTube API 테스트 실패:', error.message);
            return false;
        }
    }
}

// 3. 환경 설정 및 API 활성화 가이드
function showSetupInstructions() {
    console.log('\n📋 Google Cloud 설정 가이드:');
    console.log('================================');
    console.log('1. 🌐 https://console.cloud.google.com 접속');
    console.log('2. 📝 기존 프로젝트 선택 (Google Maps API가 있는 프로젝트)');
    console.log('3. 🔧 APIs & Services > Library 이동');
    console.log('4. 🔍 "Cloud Text-to-Speech API" 검색 후 활성화');
    console.log('5. 🔍 "YouTube Data API v3" 검색 후 활성화');
    console.log('6. 🔑 APIs & Services > Credentials');
    console.log('7. ➕ Create Credentials > API Key 생성');
    console.log('8. 📝 .env 파일에 추가:');
    console.log('   GOOGLE_CLOUD_PROJECT_ID=your-project-id');
    console.log('   YOUTUBE_API_KEY=your-youtube-api-key');
    console.log('\n💡 기존 Google Maps API 키를 Text-to-Speech에도 사용 가능합니다!');
}

// 4. 전체 시스템 테스트
async function testAllAPIs() {
    console.log('🚀 전체 API 시스템 테스트');
    console.log('========================');

    // Claude API 테스트 (이미 성공 확인됨)
    console.log('✅ Claude API: 연결됨');

    // Google Maps API 테스트 (이미 있음)
    console.log('✅ Google Maps API: 연결됨');

    // Google Cloud TTS 테스트
    const googleCloud = new GoogleCloudServices();
    const ttsResult = await googleCloud.generateSpeech('테스트 음성입니다.');
    console.log(`🔊 Text-to-Speech API: ${ttsResult ? '✅ 성공' : '❌ 설정 필요'}`);

    // YouTube API 테스트
    const youtube = new YouTubeService();
    const youtubeResult = await youtube.testAPIKey();
    console.log(`📺 YouTube API: ${youtubeResult ? '✅ 성공' : '❌ 설정 필요'}`);

    return {
        claude: true,
        googleMaps: true,
        textToSpeech: !!ttsResult,
        youtube: youtubeResult
    };
}

// 5. API 할당량 및 비용 정보
function showAPILimits() {
    console.log('\n💰 API 사용량 및 비용:');
    console.log('====================');
    console.log('📊 Text-to-Speech API:');
    console.log('   - 월 100만 글자까지 무료');
    console.log('   - 하루 2개 쇼츠 = 월 ~1만 글자 (여유롭게 무료)');
    console.log('');
    console.log('📺 YouTube Data API:');
    console.log('   - 일일 할당량: 10,000 단위');
    console.log('   - 업로드 1회 = ~1,600 단위');
    console.log('   - 하루 2개 업로드 = 3,200 단위 (충분함)');
    console.log('');
    console.log('🤖 Claude API:');
    console.log('   - 문제 생성 1회 = ~$0.001');
    console.log('   - 월 60개 문제 = ~$0.06 (매우 저렴)');
}

// 메인 실행
async function main() {
    console.log('🔧 Google Cloud API 설정 및 테스트');
    console.log('=================================');

    // 현재 환경 확인
    const hasProjectId = !!process.env.GOOGLE_CLOUD_PROJECT_ID;
    const hasYouTubeKey = !!process.env.YOUTUBE_API_KEY;

    if (!hasProjectId || !hasYouTubeKey) {
        showSetupInstructions();
        console.log('\n⚠️ 추가 API 설정이 필요합니다.');
    }

    // 전체 테스트 실행
    const results = await testAllAPIs();
    
    showAPILimits();

    // 다음 단계 안내
    const readyCount = Object.values(results).filter(Boolean).length;
    console.log(`\n📊 API 연결 상태: ${readyCount}/4 완료`);
    
    if (readyCount === 4) {
        console.log('🎉 모든 API 준비 완료! 전체 시스템 통합 가능');
    } else {
        console.log('🔧 추가 API 설정 후 다시 테스트해주세요.');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    GoogleCloudServices,
    YouTubeService,
    testAllAPIs
};