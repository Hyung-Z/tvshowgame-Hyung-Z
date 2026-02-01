import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react'; // 뒤로가기 아이콘 사용 (npm install lucide-react 필요)


const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 메인 페이지가 아닐 때만 뒤로가기 버튼을 표시
  const showBackButton = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* --- 공통 헤더 시작 --- */}
      <header className="w-full h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm shrink-0 sticky top-0 z-10">
        
        {/* 2. 뒤로가기 버튼 (좌측 상단) */}
        <div className="w-12"> {/* 크기를 고정하여 로고 중앙 정렬을 도움 */}
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)} // 이전 페이지로 이동
              className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        {/* 1. 로고 (중앙) - 클릭 시 메인으로 */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="text-sm font-bold tracking-widest text-gray-900 cursor-pointer">
              TVSHOWGAME
            </Link>

        </div>
        
        {/* 우측 빈 공간 (중앙 정렬 균형을 위해 필요) */}
        <div className="w-12">

        </div> 
      </header>
      {/* --- 공통 헤더 끝 --- */}

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;