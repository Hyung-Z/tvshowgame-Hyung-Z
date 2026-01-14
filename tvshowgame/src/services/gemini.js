// src/services/gemini.js
import { GoogleGenAI } from "@google/genai"; 

// API 클라이언트 초기화 (여기서 한 번만 하면 됩니다)
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY 
});

const STYLE = [
// 1. 애니메이션 & 만화
  "Disney animation style, 3D render, highly detailed textures, cinematic lighting", 
  "Studio Ghibli animation style, hand-painted watercolor backgrounds, cel shading", 
  "90s Japanese manga style, retro aesthetic, grain texture, ink lines", 
  "American comic book style, bold black outlines, vibrant colors, halftone dots", 
  "Modern webtoon style, clean lines, digital coloring, soft shading", 

  // 2. 예술 기법
  "Vincent van Gogh style oil painting, thick impasto brushstrokes, swirling patterns", 
  "Abstract Cubism style, geometric shapes, fragmented perspective, artistic", 
  "Impressionist painting style, loose brushwork, soft focus, play of light", 
  "Pop Art style, high contrast, bold solid colors, repetitive patterns", 
  "Ukiyo-e traditional woodblock print style, flat perspective, textured paper",

  // 3. 독특한 질감
  "Cyberpunk aesthetic, neon lighting, glossy reflections, futuristic textures", 
  "Steampunk style, brass and copper textures, mechanical details, sepia tone",
  "Claymation style, plasticine texture, soft rounded edges, depth of field"
]

/**
 * 🧠 1단계: 가사 분석 및 프롬프트 생성 (Gemini 2.0 Flash-Lite)
 * 노래 정보를 주면 { 한글가사, 영어프롬프트 } 객체를 반환합니다.
 */
export const analyzeLyricsAndGetPrompt = async (fullLyrics) => {

  const randomStyle = STYLE[Math.floor( Math.random() * STYLE.length )]

  try {
    const inputPrompt = `
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

    const result = await ai.models.generateContent({
        model : 'gemini-2.5-flash-lite',
        contents : inputPrompt
    });

    const response = result.text
    
    const cleanedText = response.replace(/```json|```/g, "").trim();

    const candidates = JSON.parse(cleanedText);
    // 🎲 3개 중 하나 랜덤 선택

    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];

  } catch (error) {
    console.error("가사 분석 실패 (Fallback 사용):", error);
    return null; 
  }
};

/**
 * 🎨 2단계: 이미지 생성 (gemini2.5-flash-img)
 * 프롬프트를 주면 Base64 이미지를 반환합니다.
 */
export const generateImage = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", 
      contents: prompt,
    });

    // 응답 파싱 (복잡한 로직을 여기서 숨김)
    let b64Data = null;
    let imageUrl = null;

    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
            // 이미지 데이터 발견!
            b64Data = part.inlineData.data;
            // 브라우저에서 바로 보여줄 수 있는 URL 포맷으로 변경
            imageUrl = `data:${part.inlineData.mimeType};base64,${b64Data}`;
            break; // 이미지를 찾았으면 루프 종료
        }
        }
    }

    if (!imageUrl) {
        throw new Error("이미지 생성 응답에 이미지 데이터가 없습니다.");
    }

    return {
      imageUrl: imageUrl,
      b64Data: b64Data
    };

  } catch (error) {
    console.error("❌ 이미지 생성 API 실패:", error);
    throw error; // 에러를 UI로 던져서 멈추거나 재시도하게 함
  }
};