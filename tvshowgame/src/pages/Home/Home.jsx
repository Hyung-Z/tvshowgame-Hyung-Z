import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeartContext } from '../../components/common/HeartContent';
import { Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const { isLimitReached } = useHeartContext(); // 👈 제한 여부 확인
  const { hearts } = useHeartContext(); // 👈 하트 개수 가져오기

  const handleStart = () => {
    if (isLimitReached) {
      alert("오늘 하트를 다 썼어요! 내일 또 만나요 👋");
      return;
    }
    navigate('/new');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-40 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center break-keep">
        하루에 3판, AI 생성 이미지를 보고, 노래 제목을 맞혀보세요
      </h2>

      <div className="flex flex-col md:flex-row gap-6 w-[30%] max-w-4xl min-w-[250px] justify-center">
        {/* 새로 만들기 버튼 */}
        <button 
          className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-md 
                     hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group text-left"
          onClick={handleStart}
        >
          <div className="text-center text-[30px] font-bold mb-3 text-gray-900 group-hover:text-blue-600">
            READY?
          </div>
          <p className="text-center text-gray-500 text-sm leading-relaxed">
            준비되셨나요?
          </p>
          <div className="flex gap-1 items-center bg-gray-100 px-3 py-1 rounded-full justify-center mt-3">
            {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  size={20}
                  className={`transition-colors duration-300 ${
                    i < hearts 
                      ? "fill-red-500 text-red-500"   // 남은 하트 (빨강)
                      : "fill-gray-200 text-gray-200" // 쓴 하트 (회색)
                  }`}
                />
              ))}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;