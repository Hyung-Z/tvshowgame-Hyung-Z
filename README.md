# 🎨 K-POP AI Quiz (AI K-POP Illustrator)

**"AI가 그린 가사만 보고 노래를 맞혀보세요!"**

K-POP 가사의 특정 부분을 Google Gemini AI를 이용해 그림으로 변환하고, 사용자가 해당 그림을 보고 노래 제목을 맞히는 인터랙티브 웹 게임입니다.


## ✨ 주요 기능 (Key Features)

- **🤖 AI 이미지 생성**: Google Gemini API를 활용하여 노래 가사를 실시간/사전 생성된 픽셀 아트 및 일러스트로 보여줍니다.
- **🎵 유튜브 뮤직비디오 연동**: 정답을 맞히거나 게임이 끝나면 해당 곡의 뮤직비디오가 자동으로 재생됩니다.
- **📱 모바일 최적화 (Responsive)**: PC는 물론 모바일 환경에서도 완벽한 UI/UX를 제공합니다 (100dvh, 터치 최적화).
- **💾 PWA 지원 (Installable)**: 앱스토어 설치 없이 홈 화면에 추가하여 네이티브 앱처럼 전체 화면으로 즐길 수 있습니다.
- **⚡ Serverless Architecture**: Cloudflare Pages와 Functions를 사용하여 별도의 서버 구축 없이 빠르고 안전하게 동작합니다.

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend & Deployment
- **Platform**: Cloudflare Pages
- **Serverless**: Cloudflare Functions (API Proxy)
- **Runtime**: Node.js / Edge Runtime

### APIs
- **AI Model**: Google Gemini-2.5-flash-lite / Gemini-2.5-flash-preview-image
- **Video**: YouTube Embed API

## 🚀 설치 및 실행 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계가 필요합니다.

### 1. 레포지토리 클론
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 .dev.vars 파일을 생성하고 Google API Key를 입력하세요. (Cloudflare Functions는 로컬 개발 시 .env 대신 .dev.vars를 사용합니다.)
```bash
# .dev.vars
GOOGLE_API_KEY=your_google_gemini_api_key
## 주의: .dev.vars, .wrangler/ 폴더는 절대 GitHub에 업로드하지 마세요. (.gitignore에 포함 필수)
```

### 4. 로컬 개발 서버 실행
Cloudflare Functions(백엔드)와 React(프론트엔드)를 함께 테스트하려면 wrangler를 사용해야 합니다.

```bash
# 일반 React 개발 (API 호출 제외 UI만 확인 시)
npm run dev

# 전체 기능 테스트 (추천)
npx wrangler pages dev -- npm run dev
```


## 📂 프로젝트 구조 (Structure)

```
/
├── functions/          # Cloudflare Functions (서버리스 백엔드 로직)
│   └── api/
│       ├── draw.js     # Gemini 이미지 생성 API 호출 핸들러
│       └── analyze.js  # Gemini 가사 분석 API 호출 핸들러
│
├── public/             # 정적 파일 (파비콘, 아이콘 등등)
├── src/                # React 프론트엔드 소스
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/          # 게임, 결과 등 페이지 단위
│   │   ├── Custom/     # 커스텀 페이지 (모달, 경고창 등등)
│   │   ├── Generation/ # 생성 로직 및 로딩 페이지
│   │   ├── Home/       # 메인 페이지
│   │   ├── NewGame/    # 설명 페이지
│   │   ├── Result/     # 결과 페이지
│   │   └── InGame/     # 인게임 페이지
│   │
│   ├── services/       # 실제 Gemini 호출 관리
│   ├── utils/          # 유틸함수 (기계적 가사 추출)
│   ├── hooks/          # 커스텀 훅
│   └── App.jsx         # 메인 라우팅 및 레이아웃
│
├── .gitignore          # Git 제외 설정
├── vite.config.js      # Vite 설정
└── README.md           # 프로젝트 설명서
```

## 🔒 보안 및 배포 (Security & Deployment)
- API Key 보안: Google API Key는 클라이언트에 노출되지 않고 Cloudflare Edge 서버에서 안전하게 처리됩니다.

- 배포: GitHub Main 브랜치에 Push 하면 Cloudflare Pages가 자동으로 빌드 및 배포를 수행합니다.

- Production 환경 변수: 실제 배포 시에는 Cloudflare Dashboard의 [Settings] -> [Environment variables]에 GOOGLE_API_KEY를 등록해야 합니다.


## FAMILY SITE 
https://tvshogame.pages.dev