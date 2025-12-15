import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout'; // 경로 확인
import Home from './pages/Home/Home'; 
import NewGame from './pages/NewGame/NewGame'; // NewGame 추가
import Custom from './pages/Custom/Custom'; // Custom 페이지도 미리 준비
import Game from './pages/InGame/Game'; 
import Generation from './pages/Generation/Generation'; // Generation 페이지 추가
import Result from './pages/Result/Resultdev'; // 결과 페이지 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />           {/* 메인 화면 */}
          <Route path="/new" element={<NewGame />} />     {/* ✨ 새로운 모드 선택 화면 */}
          <Route path="/custom" element={<Custom />} />   {/* 커스텀 설정 화면 */}
          <Route path="/Game" element={<Game />} />       {/* 게임 플레이 화면 */}
          <Route path="/generation" element={<Generation />} /> {/* 생성 화면 */}
          <Route path='/result' element={ <Result/>} /> {/* 결과 화면  */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;