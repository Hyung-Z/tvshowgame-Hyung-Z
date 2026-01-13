import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useSongData } from "../../hooks/useSongdata";
import { extractLyricSegment } from "../../utils/textUtils";

const NewGame = () => {
  const navigate = useNavigate();


  return (
    // 메인 화면과 유사하게 중앙 배치 및 아래로 살짝 내리는 효과 유지
    <div className="flex-1 flex flex-col items-center justify-center pb-40 px-4">
      {/* 메인 화면의 큰 제목은 제거했습니다. */}
      {/* 3. 요소 2개 배치 */}
      <div className="text-center flex flex-col md:flex-row gap-6 w-[800px] max-w-4xl justify-center">
        {/* 요소 2: Custom */}
        <button
          className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-md 
                     hover:shadow-xl hover:border-green-500 hover:-translate-y-1 transition-all duration-300 group text-left"
          onClick={() => navigate("/custom")} // Custom 페이지로 이동
        >
          <div className="text-center text-[30px] font-bold mb-3 text-gray-900 group-hover:text-green-600">
            Custom
          </div>
          <p className="text-center leading-8 text-gray-900 text-m">
            AI가 랜덤한 가사를 골라 생성한 이미지를 보고, 제목을 유추하시면 됩니다. < br/> 
            본 게임은 원하시는 범위 내의 노래들로 구성되어, <strong>총 5문제</strong>로 진행됩니다. < br/>
            <strong>5곡을 꼭 맞추어 선택하지 않아도 됩니다!</strong> 안내를 잘 읽고 진행해주세요! < br/>
          </p>
        </button>
      </div>
    </div>
  );
};

export default NewGame;
