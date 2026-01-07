// src/hooks/useSongData.js
import { useState, useEffect } from 'react';

export const useSongData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        // GitHub Raw URL (예시)
        const response = await fetch('https://raw.githubusercontent.com/Hyung-Z/tvshowgame/refs/heads/main/data.json');
        // const response = await fetch('/new.json');

        if (!response.ok) throw new Error('데이터 로딩 실패');

// JSON 형태 : "song-id" : [ 'mv_id', [song_name...], singer, lyrics, relase_date ]
        const jsonData = await response.json();
        const dataList = Object.values(jsonData);

        // ✨ 데이터 매핑 로직도 여기서 처리! (UI 컴포넌트는 깔끔해짐)
        const formattedData = dataList.map((item, index) => ({
          id: index,
          title: item[1][0],   // 예: JSON엔 song_name이라 되어있고
          artist: item[2],     // 예: JSON엔 singer라 되어있다면
          date: item[4], 
          lyrics: item[3],
          youtubeUrl: item[0],
        }));

        setData(formattedData);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // 컴포넌트에게 필요한 것만 리턴
  return { data, isLoading, error };
};