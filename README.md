# 📺 TVSHOWGAME (AI Image Quiz)

**TVSHOWGAME**은 AI가 생성한 이미지를 보고 노래 제목을 맞히는 신개념 퀴즈 게임입니다.
사용자는 다양한 모드로 게임을 즐길 수 있으며, 직접 플레이리스트를 구성하여 나만의 문제를 만들 수도 있습니다.



## ✨ 주요 기능 (Key Features)

### 1. 🎮 다양한 게임 모드
- **랜덤 모드 (Random):** 전체 곡 라이브러리에서 무작위로 10곡을 뽑아 빠르게 게임을 즐길 수 있습니다.
- **커스텀 모드 (Custom):** 원하는 곡을 직접 검색하거나 추천 플레이리스트를 불러와 나만의 게임을 만들 수 있습니다.

### 2. 🎵 강력한 커스텀 기능
- **음원 차트 & 검색:** 최신 차트 목록을 보거나, 제목/가수/연도별 상세 검색이 가능합니다.
- **플레이리스트 관리:** '담기/빼기' 기능을 통해 직관적으로 리스트를 구성할 수 있습니다.
- **추천 프리셋:** '2023 K-POP 명곡', '싸이월드 감성' 등 테마별로 준비된 리스트를 한 번에 불러올 수 있습니다.
- **자동 채우기:** 선택한 곡이 10곡 미만일 경우, 부족한 개수만큼 랜덤으로 채워서 시작할 수 있습니다.

### 3. 🧩 몰입감 넘치는 게임 플레이
- **AI 이미지 퀴즈:** 가사의 핵심 내용을 표현한 AI 생성 이미지가 문제로 출제됩니다.
- **YouTube 연동:** 정답을 맞히거나 건너뛰면, 해당 곡의 뮤직비디오나 무대 영상이 자동으로 재생됩니다.
- **스마트 채점:** 띄어쓰기나 대소문자에 상관없이 정답을 유연하게 인식합니다.
- **가사 힌트:** 정답 공개 시, AI 그림 생성에 활용된 '핵심 가사'를 함께 보여주어 재미를 더합니다.

### 4. 📊 결과 리포트
- 게임이 종료되면 최종 점수와 함께 내가 플레이한 곡들의 리스트를 한눈에 확인할 수 있습니다.
- 리스트에서 바로 YouTube 링크로 이동하여 원곡을 감상할 수 있습니다.

## 🛠 기술 스택 (Tech Stack)

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router Dom
- **Icons:** Lucide React
- **Media:** YouTube Iframe API
- **State Management:** React useState, useEffect, useLocation

## 🚀 설치 및 실행 방법 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 Node.js가 필요합니다.

```bash
# 1. 저장소 클론 (Clone the repo)
git clone [https://github.com/your-username/tvshowgame.git](https://github.com/your-username/tvshowgame.git)

# 2. 프로젝트 폴더로 이동
cd tvshowgame

# 3. 패키지 설치
npm install

# 4. 개발 서버 실행
npm run dev