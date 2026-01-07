import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-40 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center break-keep">
        AI 생성 이미지를 보고, 노래 제목을 맞혀보세요
      </h2>

      <div className="flex flex-col md:flex-row gap-6 w-[30%] max-w-4xl justify-center">
        {/* 새로 만들기 버튼 */}
        <button 
          className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-md 
                     hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group text-left"
          onClick={() => navigate('/new')} 
        >
          <div className="text-center text-[30px] font-bold mb-3 text-gray-900 group-hover:text-blue-600">
            READY?
          </div>
          <p className="text-center text-gray-500 text-sm leading-relaxed">
            준비되셨나요?
          </p>
        </button>
      </div>
    </div>
  );
};

export default Home;