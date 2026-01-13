import React, { useState } from 'react';
import { X } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [inputs, setInputs] = useState({ title: '', artist: '', yearFrom: '', yearTo: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputs);
    // onClose(); // 검색 후 닫고 싶으면 주석 해제
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleReset = (e) => {
    setInputs({ title: '', artist: '', yearFrom: '', yearTo: '' });
  }

  return (
    <>
      {/* 1. 투명한 배경 (외부 클릭 시 닫기용) */}
      <div 
        className="fixed inset-0 z-40 cursor-default" 
        onClick={onClose}
      />

      {/* 2. 팝오버 본문 (버튼 바로 아래 위치) */}
      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-5">
        
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h3 className="text-lg font-bold text-gray-800">상세 조건 설정</h3>
          {/* 닫기 버튼 (선택 사항) */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">곡명</label>
            <input name="title" value={inputs.title} onChange={handleChange}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
              placeholder="예: 하얀 그리움" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">가수</label>
            <input name="artist" value={inputs.artist} onChange={handleChange}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" 
              placeholder="예: 프로미스나인" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">시작 연도</label>
              <input name="yearFrom" type="number" placeholder="2018" value={inputs.yearFrom} onChange={handleChange}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">종료 연도</label>
              <input name="yearTo" type="number" placeholder="2026" value={inputs.yearTo} onChange={handleChange}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
            </div>
          </div>
          
          <div className='flex gap-2'>
            <button 
            type="button" 
            onClick={handleReset}
            className="w-full bg-gray-200 text-gray py-2.5 rounded-lg text-sm font-bold hover:bg-gray-300 transition mt-2 shadow-md">
              초기화
            </button>

            <button type="submit" 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition mt-2 shadow-md">
              검색 적용
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchModal;