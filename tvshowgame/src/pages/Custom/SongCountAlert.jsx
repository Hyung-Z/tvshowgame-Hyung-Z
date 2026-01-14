import React from 'react';
import { AlertCircle } from 'lucide-react';

const SongCountAlert = ({ isOpen, onClose, currentCount, onProceed, onFillRandom, overStart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 transform transition-all scale-100">
        
        {/* 아이콘 및 메세지 */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-yellow-100 p-3 rounded-full mb-4">
            <AlertCircle size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            현재 선택 곡 수 : <span className="text-blue-600">{currentCount}개</span>
          </h2>
          <div className="text-center text-sm text-gray-600 my-4">
            {currentCount < 5 ? (
              // 5곡 미만일 때
              <span>
                선택된 곡이 5곡보다 적습니다.<br />
                <span className="text-blue-600 font-bold">부족한 곡은 랜덤으로 채워서 시작합니다.</span>
              </span>
            ) : (
              // 5곡 이상일 때
              <span>
                5곡을 초과했습니다.<br />
                <span className="text-blue-600 font-bold">선택하신 목록 중 5곡이 랜덤으로 출제됩니다.</span>
              </span>
            )}
          </div>
        </div>

        {/* 버튼 영역 (3개 Row) */}
        <div className="flex gap-3 justify-center">
          
          {/* 1. 뒤로 가기 */}
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            뒤로 가기
          </button>

          {/* 2. 이대로 진행하기 */}
          { currentCount < 5 ? (
            <button 
              onClick={onProceed}
              className="flex-1 py-3 px-4 bg-white border-2 border-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-50 hover:border-blue-200 transition"
            >
              이대로 진행
            </button>
          ):
          (
            <button 
              onClick={overStart}
              className="flex-1 py-3 px-4 bg-white border-2 border-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-50 hover:border-blue-200 transition"
            >
              5곡 진행 (랜덤)
            </button>
          )
          }

          {/* 3. 랜덤 채우기 */}
           { currentCount < 5 ? (          
            <button 
            onClick={onFillRandom}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition text-sm break-keep"
          >
            랜덤 채워서 진행
          </button>): null
           }


        </div>
      </div>
    </div>
  );
};

export default SongCountAlert;