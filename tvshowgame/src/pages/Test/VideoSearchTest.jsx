import React, { useState } from 'react';

const VideoSearchTest = () => {
  // 테스트용 기본값 (뉴진스 - Hype Boy)
  const [inputs, setInputs] = useState({
    artist: 'NewJeans',
    title: 'Hype Boy'
  });
  
  // 실제 iframe에 들어갈 주소
  const [embedUrl, setEmbedUrl] = useState('');

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleTest = () => {
    if (!inputs.artist || !inputs.title) {
      alert('가수와 제목을 모두 입력해주세요.');
      return;
    }

    // ✨ [핵심 로직] 검색 쿼리 생성
    // "가수 제목 official audio" 형태로 검색하면 정확도가 높아집니다.
    const query = `${inputs.artist} ${inputs.title} official audio`;
    
    // URL 인코딩 (한글, 띄어쓰기 처리)
    const encodedQuery = encodeURIComponent(query);

    // ✨ listType=search 방식을 사용한 임베드 URL
    const url = `https://www.youtube.com/embed?listType=search&list=${encodedQuery}&autoplay=1`;
    
    setEmbedUrl(url);
    console.log("생성된 검색 URL:", url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          📺 유튜브 자동 검색 재생 테스트
        </h2>

        {/* 입력 폼 */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">가수 (Artist)</label>
            <input 
              name="artist"
              value={inputs.artist}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="예: IVE"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">곡명 (Title)</label>
            <input 
              name="title"
              value={inputs.title}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="예: I AM"
            />
          </div>
        </div>

        {/* 실행 버튼 */}
        <button 
          onClick={handleTest}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition mb-8 shadow-md"
        >
          검색 및 재생 확인
        </button>

        {/* 영상 재생 영역 */}
        <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-inner border border-gray-300">
          {embedUrl ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-500 flex-col">
              <span className="text-4xl mb-2">🎬</span>
              <p>버튼을 누르면 여기서 영상이 재생됩니다.</p>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-400">
          * 이 방식은 API Key가 필요 없으며, 유튜브의 검색 결과 첫 번째 목록을 자동 재생합니다.<br/>
          * 모바일이나 일부 브라우저 정책에 따라 자동 재생(autoplay)이 막힐 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default VideoSearchTest;