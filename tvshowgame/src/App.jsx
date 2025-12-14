import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* 1. 헤더: TVSHOWGAME */}
      {/* h-12는 약 48px입니다. 15px 느낌을 내기 위해 아주 심플하게 구성했습니다. */}
      <header className="w-full h-12 bg-white border-b border-gray-200 flex items-center justify-center shadow-sm shrink-0">
        <h1 className="text-sm font-bold tracking-widest text-gray-900">TVSHOWGAME</h1>
      </header>

      {/* 메인 컨텐츠 영역 */}
      {/* pb-40을 주어 컨텐츠가 화면 정중앙보다 '살짝 위'에 위치하도록 조정했습니다. */}
      <main className="flex-1 flex flex-col items-center justify-center pb-40 px-4">
        
        {/* 2. 메인 타이틀 */}
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center break-keep">
          AI 생성 이미지를 보고, 노래 제목을 맞혀보세요
        </h2>

        {/* 3. 두 개의 요소 (Row 방향 정렬) */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
          
          {/* 요소 1: 새로 만들기 */}
          <button 
            className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-md 
                       hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group text-left"
            onClick={() => console.log("새로 만들기 클릭")}
          >
            <div className="text-xl text-center font-bold mb-3 text-gray-900 group-hover:text-blue-600">
              새로 만들기
            </div>
            <p className="text-center text-gray-500 text-sm leading-relaxed">
              문제를 새로 생성합니다.<br />
              (시간이 다소 소요됩니다.)
            </p>
          </button>

          {/* 요소 2: 게임 하기 */}
          <button 
            className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-md 
                       hover:shadow-xl hover:border-green-500 hover:-translate-y-1 transition-all duration-300 group text-left"
            onClick={() => console.log("게임 하기 클릭")}
          >
            <div className="text-center text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600">
              게임 하기
            </div>
            <p className="text-center text-gray-500 text-sm leading-relaxed">
              기존 문제들로 진행합니다.<br />
              &nbsp; {/* 줄맞춤을 위한 공백 문자 */}
            </p>
          </button>

        </div>
      </main>
    </div>
  );
}

export default App;