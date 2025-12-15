import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Music, Film } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Game.jsx에서 전달받은 데이터 (없으면 기본값 처리)
  const { score = 0, total = 0, songs = [] } = location.state || {};

  return (
    <div className="h-[calc(100vh-3rem)] flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
      
      {/* 1. 결과 헤더 & 총점 */}
      <div className="text-center mb-8 animate-fadeIn">
        <p className="text-gray-500 font-medium mb-2">GAME OVER</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">최종 스코어</h1>
        
        <div className="bg-blue-50 px-10 py-6 rounded-3xl border-2 border-blue-100 shadow-sm inline-block">
          <span className="text-6xl font-extrabold text-blue-600">{score}</span>
          <span className="text-2xl text-gray-400 ml-2 font-medium">/ {total}</span>
        </div>
      </div>

      {/* 2. 문제 리스트 (스크롤 가능 영역) */}
      <div className="w-full flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col min-h-0 mb-6 animate-fadeInUp">
        
        {/* 리스트 헤더 */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="font-bold text-gray-700">플레이 리스트</span>
          <span className="text-xs text-gray-400">{songs.length}곡</span>
        </div>

        {/* 스크롤 가능한 리스트 본문 */}
        <div className="overflow-y-auto p-2 space-y-2 flex-1 scrollbar-hide">
          {songs.map((song, index) => (
            <div key={song.id} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              
              {/* 썸네일 (이미지 or 아이콘) */}
              <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center mr-3">
                {song.imageUrl ? (
                  <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                ) : (
                  // 이미지가 없으면 타입에 따라 아이콘 표시
                  song.videoId ? <Film size={20} className="text-gray-400" /> : <Music size={20} className="text-gray-400" />
                )}
              </div>

              {/* 곡 정보 */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">
                  <span className="text-blue-500 mr-2 font-mono">#{index + 1}</span>
                  {song.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
              </div>

              {/* (선택 사항) YouTube 링크가 있다면 바로가기 아이콘 표시 */}
              {song.videoId && (
                 <a 
                   href={`https://www.youtube.com/watch?v=${song.videoId}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                 >
                   <Film size={18} />
                 </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 홈으로 버튼 */}
      <button 
        onClick={() => navigate('/')}
        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center"
      >
        <Home size={20} className="mr-2" /> 메인으로 돌아가기
      </button>

    </div>
  );
};

export default Result;