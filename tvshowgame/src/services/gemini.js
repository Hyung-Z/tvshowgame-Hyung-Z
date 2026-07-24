/**
 * 🧠 1단계: 가사 분석 및 프롬프트 생성 (Gemini 2.5 Flash-Lite)
 * 노래 정보를 주면 { 한글가사, 영어프롬프트 } 객체를 반환합니다.
 */
export const analyzeLyricsAndGetPrompt = async (fullLyrics, title, artist) => {
  try {
    console.log("📝 가사 분석 요청 중...");

    // 1. 내 Cloudflare 서버 함수 호출
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullLyrics, title, artist }),
    });

    if (!response.ok) {
      throw new Error("가사 분석 서버 오류");
    }

    // 2. 결과 받기
    const result = await response.json();

    // { korean_lyric: "...", english_prompt: "...", usedStyle: "..." }
    console.log("✅ 분석 완료:", result);
    
    return result;

  } catch (error) {
    console.error("❌ 가사 분석 실패:", error);
    return null; // 실패 시 null 반환 (기존 로직 유지)
  }
  
};

/**
 * 🎨 2단계: 이미지 생성 (Gemini 3.1 Flash Lite Image)
 * 프롬프트를 주면 Base64 이미지를 반환합니다.
 */
export const generateImage = async (prompt) => {
  try {
    console.log("🎨 이미지 생성 요청 시작...");

    // 1. 내 Cloudflare 서버 함수 호출
    const response = await fetch('/api/draw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }), // 프롬프트 전달
    });

    // 2. 서버 응답 확인
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "이미지 생성 서버 오류");
    }

    // 3. 결과 받기 (이미 파싱된 깔끔한 데이터)
    const { imageUrl, b64Data } = await response.json();

    if (!imageUrl) {
      throw new Error("서버에서 이미지를 받지 못했습니다.");
    }

    // 4. 리턴
    return {
      imageUrl: imageUrl,
      b64Data: b64Data
    };

  } catch (error) {
    console.error("❌ 이미지 생성 실패:", error);
    throw error; // UI에서 에러 처리하도록 던짐
  }
};
