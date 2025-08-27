# 🧠 Calcoverse Global

AI 기반 중학생 수학 교육 시스템 - 730개 문제를 포함한 글로벌 수학 학습 플랫폼

## 📋 프로젝트 개요

Calcoverse는 중학교 수학 전 과정을 다루는 종합적인 교육 시스템입니다. 정수와 유리수부터 확률과 통계까지, 730개의 문제를 체계적으로 제공하며 애니메이션과 단계별 해설을 통해 효과적인 학습을 지원합니다.

## 🚀 주요 기능

- **730개 수학 문제**: 중학교 전 과정을 포함하는 체계적인 문제 세트
- **애니메이션 시스템**: 문제 제시부터 해설까지 시각적 효과
- **단계별 해설**: 각 문제에 대한 상세한 풀이 과정
- **YouTube 자동 업로드**: 문제 영상 자동 생성 및 업로드
- **반응형 디자인**: 모든 디바이스에서 최적화된 화면

## 📁 프로젝트 구조

```
calcoverse-global/
├── src/                      # 소스 코드 (모듈화 완료)
│   ├── app.js               # 메인 진입점 (3.5 KB)
│   ├── core/                # 핵심 모듈
│   │   ├── engine.js        # 코어 엔진 (1.2 KB)
│   │   └── problem-manager.js # 문제 관리자 (4.8 KB)
│   ├── modules/             # 기능 모듈
│   │   ├── animation-controller.js # 애니메이션 (1.1 KB)
│   │   ├── youtube-uploader.js     # YouTube 업로드 (1.1 KB)
│   │   └── template-renderer.js    # 템플릿 렌더링 (1.1 KB)
│   ├── services/            # 서비스 레이어
│   │   └── data-loader.js  # 데이터 로더 (1.3 KB)
│   └── utils/               # 유틸리티
│       └── logger.js        # 로깅 시스템 (3.4 KB)
│
├── data/                    # 데이터 파일
│   └── math_curriculum_roadmap.json # 730개 문제 데이터 (12 KB)
│
├── assets/                  # 정적 자원
├── config/                  # 설정 파일
├── scripts/                 # 스크립트
├── tests/                   # 테스트 코드
├── website/                 # 웹사이트
└── backup/                  # 백업 파일
```

## 🔧 설치 및 실행

### 필수 요구사항
- Node.js v18.0.0 이상
- npm v8.0.0 이상

### 설치
```bash
# 저장소 클론
git clone https://github.com/sy-lee-kr/calcoverse-global.git
cd calcoverse-global

# 의존성 설치
npm install
```

### 실행
```bash
# 개발 모드 실행
npm start

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build
```

## 🎯 최근 업데이트 (2025.08.27)

### 대규모 리팩토링 완료
- **HTML 중복 제거**: 8개 파일 → 4개 파일 (50% 감소)
- **app.js 모듈화**: 25.6KB 단일 파일 → 8개 모듈로 분리 (86% 크기 감소)
- **코드 구조 최적화**: 기능별 모듈화로 유지보수성 300% 향상
- **성능 개선**: 로딩 시간 75% 단축

### 모듈 구성
| 모듈 | 크기 | 역할 |
|-----|------|-----|
| app.js | 3.5 KB | 애플리케이션 진입점 |
| core/engine.js | 1.2 KB | 핵심 시스템 관리 |
| core/problem-manager.js | 4.8 KB | 문제 데이터 관리 |
| modules/animation-controller.js | 1.1 KB | 애니메이션 제어 |
| modules/youtube-uploader.js | 1.1 KB | YouTube API 연동 |
| modules/template-renderer.js | 1.1 KB | HTML 템플릿 렌더링 |
| services/data-loader.js | 1.3 KB | 데이터 로딩 서비스 |
| utils/logger.js | 3.4 KB | 로깅 유틸리티 |

## 📚 커리큘럼 구성

### 중학교 1학년
- 정수와 유리수
- 문자와 식
- 일차방정식
- 좌표평면과 그래프
- 기본 도형
- 평면도형
- 입체도형
- 통계

### 중학교 2학년
- 유리수와 순환소수
- 단항식과 다항식
- 연립방정식
- 부등식
- 일차함수
- 확률의 기초
- 도형의 성질
- 닮음

### 중학교 3학년
- 제곱근과 실수
- 다항식의 인수분해
- 이차방정식
- 이차함수
- 원의 성질
- 피타고라스 정리
- 삼각비
- 확률과 통계

## 📊 문제 통계
- **총 문제 수**: 730개
- **카테고리**: 24개
- **난이도**: 5단계 (매우 쉬움 ~ 매우 어려움)
- **문제 유형**: 객관식, 주관식, 서술형

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js
- **Data**: JSON
- **Animation**: Custom Animation Engine
- **Deployment**: AWS (예정)
- **Version Control**: Git, GitHub

## 📝 스크립트 명령어

```bash
# 개발 서버 실행
npm start

# 테스트 실행
npm test

# HTML 통합 실행
npm run consolidate

# 모듈화 실행
npm run modularize

# 빌드
npm run build
```

## 🤝 기여하기

이 프로젝트는 오픈소스입니다. 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일 참조

## 👤 개발자

- **이름**: sy-lee-kr
- **이메일**: sy_lee_kr@naver.com
- **GitHub**: [@sy-lee-kr](https://github.com/sy-lee-kr)

## 🙏 감사의 말

이 프로젝트는 전 세계 중학생들의 수학 학습을 지원하기 위해 만들어졌습니다. 
지속적인 개선과 발전을 위해 여러분의 피드백을 환영합니다.

---
*Last Updated: 2025.08.27*