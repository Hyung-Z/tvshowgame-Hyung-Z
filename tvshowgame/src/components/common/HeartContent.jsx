// src/context/HeartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// 1. 컨텍스트(데이터 방송국) 생성
const HeartContext = createContext();

export const HeartProvider = ({ children }) => {
  const MAX_HEARTS = 3;
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // 오늘 날짜 가져오기 (YYYY-MM-DD)
  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  // 초기화 및 로드
  useEffect(() => {
    const today = getTodayDate();
    const savedData = localStorage.getItem('kpop_quiz_limit');

    if (savedData) {
      const { date, count } = JSON.parse(savedData);
      if (date !== today) {
        resetHearts(); // 날짜 다르면 리셋
      } else {
        const remaining = MAX_HEARTS - count;
        setHearts(remaining);
        setIsLimitReached(remaining <= 0);
      }
    } else {
      resetHearts(); // 기록 없으면 리셋
    }
  }, []);

  const resetHearts = () => {
    const today = getTodayDate();
    localStorage.setItem('kpop_quiz_limit', JSON.stringify({ date: today, count: 0 }));
    setHearts(MAX_HEARTS);
    setIsLimitReached(false);
  };

  // 하트 사용 함수
  const useHeart = () => {
    if (hearts <= 0) return false; // 하트 없으면 사용 불가

    const today = getTodayDate();
    const currentUsage = MAX_HEARTS - hearts + 1;
    localStorage.setItem('kpop_quiz_limit', JSON.stringify({ date: today, count: currentUsage }));
    
    setHearts((prev) => prev - 1);
    if (currentUsage >= MAX_HEARTS) setIsLimitReached(true);
    return true; // 성공적으로 사용함
  };

  return (
    <HeartContext.Provider value={{ hearts, isLimitReached, useHeart }}>
      {children}
    </HeartContext.Provider>
  );
};

// 쉽게 쓰기 위한 커스텀 훅
export const useHeartContext = () => useContext(HeartContext);