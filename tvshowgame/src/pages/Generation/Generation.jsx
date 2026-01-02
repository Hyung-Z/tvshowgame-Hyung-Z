import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const Generation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Custom 페이지에서 넘겨준 노래 목록
  const initialSongs = location.state?.songs || [];

  // --- State ---
  const [songsWithImages, setSongsWithImages] = useState([]); // 이미지가 생성된 노래 목록
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState(0); // 현재 생성 중인 순번
  const [errorMsg, setErrorMsg] = useState(null);

  // 중복 실행 방지를 위한 Ref
  const hasStartedRef = useRef(false);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY, // .env에 키가 있어야 합니다
  });

  // --- API 호출 함수 ---
  const generateImages = async () => {
    if (initialSongs.length === 0) return;
    
    let completedList = [];
    try {
      // 한 곡씩 순차적으로 생성 (Promise.all은 Rate Limit 걸릴 수 있어서 순차 처리 권장)
      for (let i = 0; i < initialSongs.length; i++) {
        const song = initialSongs[i];
        setCurrentGeneratingIndex(i + 1); // 현재 n번째 생성 중 표시

        // 1. 프롬프트 생성 (가사 + 스타일)
        // DALL-E 2는 영어 프롬프트를 더 잘 알아듣지만, DALL-E 3는 한글도 꽤 잘 합니다.
        // 혹시 퀄리티가 낮다면 가사를 번역해서 넣는 것이 좋습니다.
        const prompt = `
          A digital art illustration representing the following K-pop song lyrics: "${song.lyricSegment}".
          The mood should match the song "${song.title}" by "${song.artist}".
          Style: High quality, anime style, vibrant colors, dreamy atmosphere.
          No text inside the image.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image", // ✨ 요청하신 모델 사용
          contents: prompt,
        });

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

        // 3. 결과 저장
        completedList.push({
          ...song,
          imageUrl: imageUrl, // 화면 표시용
          b64Data: b64Data    // 다운로드용 (Base64 원본)
        });

        // 4. 진행률 업데이트
        setProgress(Math.round(((i + 1) / initialSongs.length) * 100));
      }

      setSongsWithImages(completedList);
      setIsReady(true);

    } catch (error) {
      console.error("이미지 생성 중 오류 발생:", error);
      setErrorMsg("이미지 생성에 실패했습니다. API Key나 크레딧을 확인해주세요.");
    }
  };

  // ✨ 이미지 다운로드 헬퍼 함수
  const downloadBase64 = (base64Data, fileName) => {
    const linkSource = `data:image/png;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `${fileName}.png`;
    downloadLink.click();
  };

  // ✨ 전체 다운로드 버튼 핸들러
  const handleDownloadAll = () => {
    songsWithImages.forEach((song, index) => {
      if (song.b64Data) {
        // 파일명 안전하게 변환
        const safeTitle = song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        downloadBase64(song.b64Data, `${safeTitle}_${index}`);
      }
    });
  };

  // --- Effect: 페이지 진입 시 1회 실행 ---
  useEffect(() => {
    if (!hasStartedRef.current && initialSongs.length > 0) {
      hasStartedRef.current = true;
      generateImages();
    } else if (initialSongs.length === 0) {
      setErrorMsg("노래 데이터가 없습니다.");
    }
  }, []);


  // --- Handler: 게임 시작 ---
  const handlePlay = () => {
    if (!isReady) return;
    // 이미지가 포함된 새 리스트를 넘겨줌
    navigate('/game', { state: { songs: songsWithImages } });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
      
      {/* 1. 중앙 애니메이션 영역 */}
      <div className="flex flex-col items-center mb-16 relative">
        <div className="relative">
          {errorMsg ? (
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
               <AlertTriangle size={48} className="text-red-500" />
             </div>
          ) : isReady ? (
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-short">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full border-4 border-gray-100"></div>
              <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 size={32} className="text-blue-600 animate-spin" />
              </div>
            </>
          )}
        </div>

        {/* 텍스트 메시지 */}
        <h2 className="mt-8 text-2xl font-bold text-gray-800 text-center">
          {errorMsg 
            ? "오류가 발생했습니다" 
            : isReady 
              ? "이미지 생성 완료!" 
              : `AI가 그림을 그리고 있어요... (${currentGeneratingIndex} / ${initialSongs.length})`
          }
        </h2>
        
        <p className="mt-2 text-gray-500 font-medium">
          {errorMsg ? errorMsg : isReady ? "Ready to Play" : `${progress}% 완료`}
        </p>

        {/* 진행 중일 때만 보이는 팁 */}
        {!isReady && !errorMsg && (
           <p className="mt-4 text-xs text-gray-400 animate-pulse text-center max-w-sm break-keep">
             현재 <span className="font-bold text-blue-500">"{initialSongs[currentGeneratingIndex-1]?.title}"</span>의 가사를 바탕으로 이미지를 생성 중입니다.
             <br/>(곡당 약 5~10초 소요)
           </p>
        )}
      </div>

      {/* 2. 하단 PLAY 버튼 */}
      <div className="w-full max-w-md">
        <button
          onClick={handlePlay}
          disabled={!isReady}
          className={`
            w-full py-4 rounded-xl font-bold text-xl flex items-center justify-center transition-all duration-300 shadow-lg
            ${isReady 
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }
          `}
        >
          {isReady ? (
            <> <Play fill="currentColor" className="mr-2" /> GAME START </>
          ) : (
            "생성 중..."
          )}
        </button>

        {/* ✨ [추가] 개발용: 이미지 저장 버튼 */}
        {isReady && (
          <button 
            onClick={handleDownloadAll}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200"
          >
            📥 이미지 저장하기 (개발용)
          </button>
        )}
      </div>

    </div>
  );
};

export default Generation;