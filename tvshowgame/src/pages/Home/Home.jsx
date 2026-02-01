import React from "react";
import { useNavigate } from "react-router-dom";
import { useHeartContext } from "../../components/common/HeartContent";
import { Heart, Gamepad2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const { isLimitReached } = useHeartContext(); // 👈 제한 여부 확인
  const { hearts } = useHeartContext(); // 👈 하트 개수 가져오기

  const handleStart = () => {
    if (isLimitReached) {
      alert("오늘 하트를 다 썼어요! 내일 또 만나요 👋");
      return;
    }
    navigate("/new");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center pb-40 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center break-keep mt-8" >
        하루에 3판, AI 생성 이미지를 보고, 노래 제목을 맞혀보세요
      </h2>

      <div className="flex flex-col gap-6 w-[30%] max-w-4xl min-w-[250px] justify-center">
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
                    ? "fill-red-500 text-red-500" // 남은 하트 (빨강)
                    : "fill-gray-200 text-gray-200" // 쓴 하트 (회색)
                }`}
              />
            ))}
          </div>
        </button>

        <button
          onClick={() => window.open("https://tvshowgame.pages.dev", "_blank")}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-500 transition shadow-lg flex items-center justify-center mb-3"
        >
          <Gamepad2 size={20} className="mr-2" /> 예능게임 더 둘러보기
        </button>
      </div>
      <div className="mt-16 px-6 py-10 bg-white/80 rounded-2xl max-w-2xl mx-auto text-left shadow-sm">
        <article className="prose prose-sm md:prose-base text-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            🎨 AI로 그린 가사 퀴즈란?
          </h2>
          <p className="mb-4 text-sm md:text-base">
            이 웹 게임은 최신 생성형 인공지능(Generative AI) 기술인{" "}
            <strong>Google Gemini Pro</strong>을 활용하여 개발되었습니다.
            노래 제목을 AI에게 제공하면, AI는 그 가사 중 의미있는 부분을 골라
            해석하여 독창적인 그림으로 그려냅니다.
          </p>
            <div className="my-8 text-center">
            <p className="text-sm text-gray-500 mb-2 font-bold">AI가 그린 'SPAGHETTI' 예시</p>
            <img 
            src="/demo.png" 
            alt="AI가 그린 르세라핌 SPAGHETTI 가사 그림" 
            className="rounded-lg shadow-md mx-auto w-64 h-64 object-cover"
            />
            <p className="text-xs text-gray-400 mt-2">이런 식으로 가사를 그림으로 표현해줍니다.</p>
            </div>
          <p className="mb-4 text-sm md:text-base">
            플레이어는 AI가 그린 그림을 보고, 그것이 어떤 노래인지 맞히는 퀴즈
            게임입니다. 단순한 텍스트 퀴즈를 넘어, 인공지능이 가사를 어떻게
            시각적으로 재해석하는지 감상하는 재미를 느낄 수 있습니다.
          </p>

          <h3 className="text-lg font-bold mb-3 mt-6 text-gray-900">
            🤖 기술적 원리 (How it works)
          </h3>
          <ul className="list-disc pl-5 mb-4 space-y-2 text-sm md:text-base" >
            <li>
              <strong>프롬프트 엔지니어링:</strong> K-POP 가사의 감정과 상황을
              AI가 이해하기 쉽도록 최적화된 프롬프트로 변환하여 요청합니다.
            </li>
            <li>
              <strong>실시간 생성:</strong> 미리 저장된 이미지가 아닌, 매
              게임마다 새로운 이미지를 실시간으로 생성하여 항상 새로운 경험을
              제공합니다.
            </li>
          </ul>

          <h3 className="text-lg font-bold mb-3 mt-6 text-gray-900 ">
            🎵 제공되는 모드
          </h3>
          <p className="text-sm md:text-base">
            현재 상세한 검색을 통한 커스텀 모드와 월간 차트를 활용한 랜덤 모드를
            제공하고 있습니다.
          </p>
        </article>
      </div>
    </div>
  );
};

export default Home;
