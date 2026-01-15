// 🎨 스타일 리스트를 서버 쪽에 정의해야 합니다.
const STYLES = [
  "Disney animation style, 3D render, expressive characters, magical lighting",
  "Studio Ghibli animation style, hand-painted watercolor backgrounds, cel shading",
  "90s Japanese manga style, retro aesthetic, grain texture, ink lines",
  "Cyberpunk aesthetic, neon lighting, glossy reflections, futuristic textures",
  "Vincent van Gogh style oil painting, thick impasto brushstrokes, swirling patterns",
  "Modern webtoon style, clean lines, digital coloring, soft shading",
  "Impressionist painting style, loose brushwork, soft focus, play of light"
];

export async function onRequestPost(context) {
  try {
    // 1. 프론트에서 가사 받기
    const { fullLyrics } = await context.request.json();
    const apiKey = context.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key not configured" }), { status: 500 });
    }

    // 2. 서버에서 스타일 랜덤 선택
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];

    // 3. 프롬프트 구성 (기존 로직 동일)
    const systemPrompt = `
      You are an expert AI art prompter.

      Lyrics: """${fullLyrics.slice(0, 1500)}..."""
      
      Task:
      1. Find **3 distinct parts** of the lyrics that are visually descriptive.
      2. Pick from different sections.
      3. Create a high-quality English image prompt for each.
      
      Conditions:
      0. if lyrics includes action, include it in prompt if possible.
      1. No Text inside
      2. Required Style : ${randomStyle}
      3. resolution default setting

      Output format (JSON Array):
      [
        { "korean_lyric": "...", "english_prompt": "..." },
        { "korean_lyric": "...", "english_prompt": "..." },
        { "korean_lyric": "...", "english_prompt": "..." }
      ]
    `;

    // 4. Google REST API 호출 설정
    // 참고: JSON 파싱을 위해 stream 대신 generateContent 사용
    const model = "gemini-2.5-flash-lite";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          }
        ],
        // ✨ 꿀팁: 모델에게 JSON으로만 뱉으라고 강제하면 파싱 에러가 줄어듭니다.
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(`Google API Error: ${errData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // 5. 응답 텍스트 추출
    // REST API 구조: candidates[0].content.parts[0].text
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("AI 응답에 텍스트가 없습니다.");
    }

    // 6. 마크다운 제거 및 JSON 파싱
    // (responseMimeType을 썼지만 혹시 모를 마크다운이 있을 수 있으니 안전장치 유지)
    const cleanedText = rawText.replace(/```json|```/g, "").trim();
    const candidates = JSON.parse(cleanedText);

    // 7. 3개 중 하나 랜덤 선택 (기존 로직)
    if (Array.isArray(candidates) && candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const selected = candidates[randomIndex];
      
      // 프론트엔드에 스타일 정보도 같이 주면 좋습니다 (선택사항)
      return new Response(JSON.stringify({ ...selected}), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: "유효한 후보를 찾지 못했습니다." }), { status: 500 });

  } catch (error) {
    console.error("서버 함수(Analyze) 에러:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}