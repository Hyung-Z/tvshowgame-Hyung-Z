export async function onRequestPost(context) {
  try {
    // 1. 프론트엔드에서 보낸 프롬프트 받기
    const { prompt } = await context.request.json();
    const apiKey = context.env.GOOGLE_API_KEY; // 환경변수에서 키 꺼내기

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key not configured" }), { status: 500 });
    }

    // 2. Google REST API 설정 (제공해주신 curl 기반)
    const model = "gemini-2.5-flash-image";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // 3. 요청 바디 구성
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt }
          ]
        }
      ],
      // ✨ 중요: 이미지 생성을 위한 설정 (curl 예시 참조)
      generationConfig: {
        responseModalities: ["IMAGE"] 
      }
    };

    // 4. Google API 호출
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // 5. 응답 파싱 (SDK가 하던 일을 여기서 수행)
    // JSON 구조: candidates[0].content.parts[].inlineData
    let b64Data = null;
    let imageUrl = null;

    const candidates = data.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        // inlineData가 있는지 확인 (이미지 데이터)
        if (part.inlineData && part.inlineData.data) {
          b64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || "image/png"; // 기본값 png
          imageUrl = `data:${mimeType};base64,${b64Data}`;
          break; 
        }
      }
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "이미지 데이터가 생성되지 않았습니다." }), { status: 500 });
    }

    // 6. 프론트엔드에 깔끔한 결과 반환
    return new Response(JSON.stringify({ imageUrl, b64Data }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("서버 함수 에러:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}