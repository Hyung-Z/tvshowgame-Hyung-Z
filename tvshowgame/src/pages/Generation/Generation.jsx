import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { extractLyricSegment } from '../../utils/textUtils';
import {analyzeLyricsAndGetPrompt, generateImage} from '../../services/gemini'
import { useHeartContext } from '../../components/common/HeartContent';

const Generation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { useHeart } = useHeartContext();

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

  // --- API 호출 함수 ---
  const generateImages = async () => {
    if (initialSongs.length === 0) return;
    
    let completedList = [];
    try {
      // 한 곡씩 순차적으로 생성 (Promise.all은 Rate Limit 걸릴 수 있어서 순차 처리 권장)
      for (let i = 0; i < initialSongs.length; i++) {
        const song = initialSongs[i];
        setCurrentGeneratingIndex(i + 1); // 현재 n번째 생성 중 표시        
        let promptdata;
        let lyricsSeg;
        let prompt;

        promptdata = await analyzeLyricsAndGetPrompt(song.lyrics)
        
        console.log(promptdata)
        
        if (!promptdata) {
          console.error("가사 추출 실패")
          lyricsSeg = extractLyricSegment(song.lyrics)
          prompt = `make a image describe the lyrics : ${lyricsSeg}. 
          if lyrics have some inappropriate words, omit it. then make it.
          No text inside, image style except realistic. And other conditions follow the mood of lyrics.`
        }
        else {
          lyricsSeg = promptdata['korean_lyric']
          prompt = promptdata['english_prompt']
        }

        const {b64Data, imageUrl} = await generateImage(prompt)

        // 3. 결과 저장
        completedList.push({
          ...song,
          lyricsSeg : lyricsSeg,
          imageUrl: imageUrl, // 화면 표시용
          b64Data: b64Data    // 다운로드용 (Base64 원본)
        });
        
        window.BACKUP_DATA = completedList;
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


  // --- Effect: 페이지 진입 시 1회 실행 ---
  useEffect(() => {
    if (!hasStartedRef.current && initialSongs.length > 0) {
      hasStartedRef.current = true;
      useHeart();
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
             현재 가사를 바탕으로 이미지를 생성 중입니다.
             <br/>(곡당 약 10~20초 소요)
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
        {/* {isReady && (
          <button 
            onClick={handleDownloadAll}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200"
          >
            📥 이미지 저장하기
          </button>
        )} */}
      </div>

    </div>
  );
};

export default Generation;