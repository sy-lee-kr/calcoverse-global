const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs').promises;
const path = require('path');

class GlobalVoiceGenerator {
  constructor() {
    // Google TTS 클라이언트 (실제 키가 있을 때만)
    this.ttsClient = null;
    this.initializeTTS();
    
    // 언어별 음성 설정
    this.voiceConfig = {
      ko: { 
        languageCode: 'ko-KR', 
        voice: 'ko-KR-Wavenet-A', 
        gender: 'FEMALE',
        name: '한국어'
      },
      en: { 
        languageCode: 'en-US', 
        voice: 'en-US-Wavenet-F', 
        gender: 'FEMALE',
        name: 'English'
      },
      zh: { 
        languageCode: 'cmn-CN', 
        voice: 'cmn-CN-Wavenet-A', 
        gender: 'FEMALE',
        name: '中文'
      },
      ja: { 
        languageCode: 'ja-JP', 
        voice: 'ja-JP-Wavenet-A', 
        gender: 'FEMALE',
        name: '日本語'
      },
      es: { 
        languageCode: 'es-ES', 
        voice: 'es-ES-Wavenet-C', 
        gender: 'FEMALE',
        name: 'Español'
      }
    };
  }

  async initializeTTS() {
    try {
      // Google Cloud 키가 있으면 실제 TTS 사용
      if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_PROJECT_ID !== 'test-project') {
        this.ttsClient = new textToSpeech.TextToSpeechClient();
        console.log('✅ Google TTS 클라이언트 초기화 완료');
      } else {
        console.log('⚠️ Google TTS: 테스트 모드 (실제 음성 생성 안됨)');
      }
    } catch (error) {
      console.log('⚠️ Google TTS 초기화 실패, 시뮬레이션 모드:', error.message);
    }
  }

  async generateVoiceForProblem(problemData, language = 'ko') {
    console.log(`🎤 ${language} 음성 생성 시작...`);
    
    const voiceScript = this.createVoiceScript(problemData, language);
    
    if (this.ttsClient) {
      return await this.generateRealVoice(voiceScript, language);
    } else {
      return await this.simulateVoiceGeneration(voiceScript, language);
    }
  }

  createVoiceScript(problemData, language) {
    const scripts = {
      ko: {
        intro: "안녕하세요! 오늘의 수학 문제를 함께 풀어보겠습니다.",
        problemIntro: "문제를 읽어드릴게요.",
        problem: problemData.problem,
        solutionIntro: "이제 단계별로 풀어보겠습니다.",
        steps: problemData.solution.steps,
        conclusion: `정답은 ${problemData.solution.answer}입니다. 잘하셨어요!`,
        timing: {
          intro: 2000,
          problemIntro: 1000,
          problem: 4000,
          solutionIntro: 1000,
          steps: 5000,
          conclusion: 2000
        }
      },
      en: {
        intro: "Hello! Let's solve today's math problem together.",
        problemIntro: "Here is the problem.",
        problem: this.translateToEnglish(problemData.problem),
        solutionIntro: "Now let's solve this step by step.",
        steps: problemData.solution.steps,
        conclusion: `The answer is ${problemData.solution.answer}. Well done!`,
        timing: {
          intro: 2000,
          problemIntro: 1000,
          problem: 4000,
          solutionIntro: 1000,
          steps: 5000,
          conclusion: 2000
        }
      }
    };

    return scripts[language] || scripts.ko;
  }

  translateToEnglish(koreanText) {
    // 간단한 번역 (실제로는 Google Translate API 사용)
    const translations = {
      '지민이가 피자를 3개 주문했습니다. 배송비 5원을 포함해서 총 20원을 지불했다면, 피자 한 개의 가격은?': 
        'Jimin ordered 3 pizzas. Including 5 won for delivery, he paid 20 won total. What is the price of one pizza?'
    };
    
    return translations[koreanText] || koreanText;
  }

  async generateRealVoice(voiceScript, language) {
    const config = this.voiceConfig[language];
    
    // SSML로 고급 음성 제어
    const ssml = this.createSSML(voiceScript);
    
    const request = {
      input: { ssml: ssml },
      voice: {
        languageCode: config.languageCode,
        name: config.voice,
        ssmlGender: config.gender
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: 0.0,
        volumeGainDb: 2.0
      }
    };

    try {
      const [response] = await this.ttsClient.synthesizeSpeech(request);
      
      // 오디오 파일 저장
      const fileName = `voice_${language}_${Date.now()}.mp3`;
      const filePath = path.join('public', 'audio', fileName);
      
      await fs.writeFile(filePath, response.audioContent, 'binary');
      
      console.log(`✅ ${config.name} 음성 생성 완료: ${fileName}`);
      
      return {
        success: true,
        language: config.name,
        fileName: fileName,
        filePath: filePath,
        duration: this.estimateAudioDuration(voiceScript),
        script: voiceScript
      };
      
    } catch (error) {
      console.error(`❌ ${config.name} 음성 생성 실패:`, error);
      return await this.simulateVoiceGeneration(voiceScript, language);
    }
  }

  async simulateVoiceGeneration(voiceScript, language) {
    const config = this.voiceConfig[language];
    
    // 시뮬레이션된 결과
    const fileName = `voice_${language}_simulated_${Date.now()}.mp3`;
    
    console.log(`🎭 ${config.name} 음성 시뮬레이션 완료: ${fileName}`);
    
    return {
      success: true,
      language: config.name,
      fileName: fileName,
      filePath: `public/audio/${fileName}`,
      duration: this.estimateAudioDuration(voiceScript),
      script: voiceScript,
      simulated: true,
      note: '실제 Google TTS API 키가 연결되면 진짜 음성이 생성됩니다.'
    };
  }

  createSSML(voiceScript) {
    return `
<speak>
  <prosody rate="medium" pitch="+2st">
    ${voiceScript.intro}
  </prosody>
  
  <break time="1s"/>
  
  <prosody rate="slow" volume="loud">
    ${voiceScript.problemIntro}
  </prosody>
  
  <break time="0.5s"/>
  
  <prosody rate="medium">
    ${voiceScript.problem}
  </prosody>
  
  <break time="2s"/>
  
  <prosody rate="slow" pitch="+1st">
    ${voiceScript.solutionIntro}
  </prosody>
  
  <break time="0.5s"/>
  
  ${voiceScript.steps.map(step => `
    <prosody rate="slow">
      ${step}
    </prosody>
    <break time="1s"/>
  `).join('')}
  
  <break time="1s"/>
  
  <prosody rate="medium" pitch="+3st" volume="loud">
    ${voiceScript.conclusion}
  </prosody>
</speak>`;
  }

  estimateAudioDuration(voiceScript) {
    // 대략적인 음성 길이 계산 (초)
    const totalText = Object.values(voiceScript.timing || {}).reduce((sum, time) => sum + time, 0);
    return Math.round(totalText / 1000);
  }

  async generateMultiLanguageVoices(problemData) {
    console.log('🌍 다국어 음성 생성 시작...');
    
    const languages = Object.keys(this.voiceConfig);
    const results = [];
    
    for (const lang of languages) {
      try {
        const voiceResult = await this.generateVoiceForProblem(problemData, lang);
        results.push(voiceResult);
      } catch (error) {
        console.error(`❌ ${lang} 음성 생성 실패:`, error);
        results.push({
          success: false,
          language: lang,
          error: error.message
        });
      }
    }
    
    console.log(`✅ 다국어 음성 생성 완료: ${results.length}개 언어`);
    return results;
  }
}

module.exports = GlobalVoiceGenerator;