import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, SkipForward, ArrowRight, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const songs = location.state?.songs || [];

  // --- State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  
  const [showResult, setShowResult] = useState(false); 
  const [isCorrectLast, setIsCorrectLast] = useState(false);

  const currentSong = songs[currentIndex];
  const totalRounds = songs.length;

  useEffect(() => {
    if (songs.length === 0) {
      alert("데이터가 없습니다.");
      navigate('/');
    }
  }, [songs, navigate]);


  // --- Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const cleanUser = userAnswer.replace(/\s+/g, '').toLowerCase();
    const cleanAnswer = currentSong.title.replace(/\s+/g, '').toLowerCase();
    const isCorrect = cleanUser === cleanAnswer;

    setIsCorrectLast(isCorrect);
    if (isCorrect) setScore(prev => prev + 1);
    
    setShowResult(true);
  };

  const handleSkip = () => {
    setIsCorrectLast(false);
    setShowResult(true);
  };

  const handleNextProblem = () => {
    setShowResult(false);
    setUserAnswer('');
    
    if (currentIndex + 1 < totalRounds) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigate('/result', { state: { score, total: totalRounds, songs } });
    }
  };

  if (!currentSong) return null;

  return (
    <div className="flex h-[calc(100vh-5rem)] lg:h-[calc(100vh-3rem)] flex-col lg:flex-row">
      
      {/* 1. 상방/좌측 패널 (미디어 영역) */}
      <div className="min-h-[100vw] lg:min-h-auto flex-1 bg-gray-900 flex items-center justify-center relative overflow-scroll lg:overflow-hidden mb-5 lg:mb-0">
        
        {/* ✨ videoId가 있는지 확인 */}
        {showResult && currentSong.youtubeUrl ? (
          <div className='relative w-full flex flex-col m-auto gap-5 lg:py-0 lg:gap-5'>
          <iframe
            className="h-[100vw] lg:h-[40vh]"
            // ✨ ID를 직접 주입 (로직이 매우 간단해짐)
            src={`https://www.youtube.com/embed/${currentSong.youtubeUrl}?autoplay=1&rel=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
            <img 
              src={currentSong.imageUrl} 
              alt="Quiz" 
              className="h-full w-full lg:h-[40vh] object-contain mr-auto ml-auto" 
            />
            </div>
        ) : (
          // 문제 풀이 중: AI 이미지 표시
          currentSong.imageUrl ? (
            <img 
              src={currentSong.imageUrl} 
              alt="Quiz" 
              className="w-full h-full object-contain my-auto" 
            />
          ) : (
            <div className="text-center opacity-50">
               <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
               <p className="text-gray-400">No Image</p>
            </div>
          )
        )}
      </div>

      {/* 2. 우측 패널 (기존과 동일) */}
      <div className="flex-1 bg-white flex flex-col justify-center px-8 md:px-16 lg:px-24 transition-all">

         <div className="mb-8 text-center">
           {!showResult ? (
             <>
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-sm mb-2">
                  Question {currentIndex + 1} / {totalRounds}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">이 그림은 어떤 노래일까요?</h2>
             </>
           ) : (
             <div className="flex flex-col items-center animate-fadeIn">
                {isCorrectLast ? (
                  <div className="flex items-center text-green-600 mb-2">
                    <CheckCircle2 size={32} className="mr-2" />
                    <span className="text-2xl font-bold">정답입니다!</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500 mb-2">
                    <XCircle size={32} className="mr-2" />
                    <span className="text-2xl font-bold">아쉽네요!</span>
                  </div>
                )}
             </div>
           )}
        </div>

        {!showResult ? (
          <form onSubmit={handleSubmit} className="w-full space-y-8 animate-fadeIn">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="정답을 입력하세요"
                className="flex-1 px-5 py-4 text-sm sm:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white"
                autoFocus
              />
              <button type="submit" className="px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md flex items-center justify-center font-bold">
                <span className="hidden sm:inline">제출</span> <Send size={20} className="sm:ml-2" />
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full space-y-6 animate-fadeInUp">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
              <p className="text-sm text-gray-500 font-semibold mb-1">정답</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{currentSong.title}</h3>
              <p className="text-gray-600">{currentSong.artist}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
              <p className="text-sm text-blue-500 font-semibold mb-2">AI 그림 생성에 활용된 가사</p>
              <p className="text-lg text-gray-800 font-medium break-keep italic">
                " {currentSong.lyricsSeg} "
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 my-8"></div>

        <div className="flex justify-between items-center mb-16">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium">CURRENT SCORE</span>
              <span className="text-4xl font-extrabold text-gray-900">
                {score} <span className="text-lg text-gray-400 font-normal">pts</span>
              </span>
            </div>

            {!showResult ? (
              <button 
                type="button"
                onClick={handleSkip}
                className="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 hover:text-gray-700 transition-colors font-medium"
              >
                건너뛰기 <SkipForward size={20} className="ml-2" />
              </button>
            ) : (
              <button 
                onClick={handleNextProblem}
                className="flex items-center px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 hover:-translate-y-1 transition-all shadow-lg font-bold text-lg"
              >
                다음<span className="hidden sm:block">문제</span> <ArrowRight size={20} className="ml-2" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Game;