import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  Music,
  ListMusic
} from "lucide-react"; // ChevronDown 추가import SongList from './SongList';
import SearchModal from "./SearchModal";
import SongList from "./SongList";
import PresetModal from './PresetModal'; 
import SongCountAlert from './SongCountAlert'; 
import { useSongData } from '../../hooks/useSongdata';


const Custom = () => {
    const navigate = useNavigate();

    // --- State: 데이터 목록 ---
    const [playlist, setPlaylist] = useState([]); // 왼쪽: 선택된 곡들
    const [chartList, setChartList] = useState([]);
    const [isChartLoading, setIsChartLoading] = useState(true);
    const [searchList, setSearchList] = useState([]); // 오른쪽 2: 검색 결과 (유지됨)
    const [presets, setPresets] = useState([]); // 프리셋 목록 상태

    // --- State: UI 및 선택 상태 ---
    const [rightMode, setRightMode] = useState("chart"); // 'chart' or 'search'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPresetOpen, setIsPresetOpen] = useState(false); // ✨ 프리셋 모달 상태
    const [isAlertOpen, setIsAlertOpen] = useState(false); // ✨ 경고 모달 상태

    const { data: songData, isLoading, error } = useSongData(); // 커스텀 훅 사용

    // 다중 선택을 위한 ID 배열
    const [selectedLeft, setSelectedLeft] = useState([]);
    const [selectedRight, setSelectedRight] = useState([]);

    // 로드 시 차트 가져오기
    useEffect(() => {
      const fetchChartAndMap = async () => {
        if (isLoading || songData.length === 0) return;
        
        try {
          setIsChartLoading(true);
          const response = await fetch('charts/chart202601.json')
          const chartTitles = await response.json();
          const mappedChart = chartTitles.map((title) => {
            return songData.find(song => 
              song.title.toLowerCase().trim() === title.toLowerCase().trim()
            );
          }).filter(item => item !== undefined);
          setChartList(mappedChart);
        }
        catch (e) {
          console.error('차트로딩실패', e);
        }
        finally {
          setIsChartLoading(false);
        }
      }
      fetchChartAndMap();


    }, [songData,isLoading])

    useEffect(() => {
      const fetchPresets = async () => {
        if (isLoading || songData.length === 0) return;

        try {
          const response = await fetch('/charts/presets.json');
          const data = await response.json();


          // ✨ 모달 UI가 깨지지 않게 데이터 모양 예쁘게 만들기
          const presetArray = Object.keys(data).map((key, index) => ({
            id: `preset-${index}`,
            title: key,             // "🔥 2023 K-POP 명곡"
            description: data[key][0], 
            songTitles: data[key][1],  // 실제 로직에 쓸 제목 리스트
            songCount: data[key][1].length // (선택사항) 곡 수 표시용
          }));

          const finalPresets = presetArray.map((preset) => { 
            // (1) 제목들을 가지고 실제 노래 찾기
            const foundSongs = preset.songTitles.map((title) => {
              return songData.find(song => 
                song.title.toLowerCase().trim() === title.toLowerCase().trim()
              );
            }).filter(item => item !== undefined); // DB에 없는 노래는 제외
            
            // (2) ✨ [핵심] 기존 프리셋 정보에 찾은 노래들을 합쳐서 반환
            return {
              ...preset,    // id, title, description 등 기존 정보 유지!
              songs: foundSongs, // 실제 노래 객체들로 교체
              songCount: foundSongs.length // (혹시 못 찾은 곡이 있을 수 있으니 개수 갱신)
            };
          });

          setPresets(finalPresets);
        } catch (error) {
          console.error("프리셋 로딩 실패:", error);
        }
      };
      fetchPresets();
    }, [songData,isLoading]);

    // --- Helper: 선택 토글 함수 ---
    const toggleSelection = (id, currentSelected, setFn) => {
        if (currentSelected.includes(id)) {
        setFn(currentSelected.filter((item) => item !== id));
        } else {
        setFn([...currentSelected, id]);
        }
    };

    // --- Action 1: 오른쪽 -> 왼쪽 (추가) ---
    const handleAdd = () => {
        const currentRightList = rightMode === "chart" ? chartList : searchList;
        // 선택된 아이템 객체 찾기
        const itemsToAdd = currentRightList.filter((song) =>
        selectedRight.includes(song.id)
        );

        // 중복 제거 후 추가 (이미 플레이리스트에 있는 ID는 제외)
        const newItems = itemsToAdd.filter(
        (item) => !playlist.some((p) => p.id === item.id)
        );

        setPlaylist([...playlist, ...newItems]);
        setSelectedRight([]); // 오른쪽 선택 초기화
    };

  // --- Action 2: 왼쪽 -> 오른쪽 (제거) ---
    const handleRemove = () => {
        // 선택되지 않은 항목만 남김
        setPlaylist(playlist.filter((song) => !selectedLeft.includes(song.id)));
        setSelectedLeft([]); // 왼쪽 선택 초기화
    };

    // --- Action 3: 검색 실행 ---
    const handleSearch = (criteria) => {
      console.log("검색 실행:", criteria);
      const filtered = songData.filter((song) => {
            // 데이터의 연도 추출 ('2022.08' -> 2022)
            const songYear = parseInt(song.date.split(".")[0]);

            // 입력값 정규화 (대소문자 무시를 위해 소문자로 변환)
            const keywordTitle = criteria.title.toLowerCase();
            const keywordArtist = criteria.artist.toLowerCase();
            const targetTitle = song.title.toLowerCase();
            const targetArtist = song.artist.toLowerCase();

            // 조건 1: 곡명 (입력값이 없으면 통과, 있으면 포함 여부 확인)
            const matchTitle = !keywordTitle || targetTitle.includes(keywordTitle);

            // 조건 2: 가수명
            const matchArtist =
            !keywordArtist || targetArtist.includes(keywordArtist);

            // 조건 3: 연도 범위 (입력값이 없으면 통과)
            const matchYearFrom =
            !criteria.yearFrom || songYear >= parseInt(criteria.yearFrom);
            const matchYearTo =
            !criteria.yearTo || songYear <= parseInt(criteria.yearTo);

            // 모든 조건(AND) 충족 시 true
            return matchTitle && matchArtist && matchYearFrom && matchYearTo;
        });
        setSearchList(filtered);
        setRightMode("search"); // 검색 결과 탭으로 전환
        setIsModalOpen(false); // 모달 닫기
    };

    // ✨ '직접 검색' 버튼 클릭 핸들러
    const handleSearchModeClick = () => {
        if (rightMode !== "search") {
        // 1. 현재 검색 모드가 아니면 -> 모드로 전환만 함
        setRightMode("search");
        } else {
        // 2. 이미 검색 모드라면 -> 모달 띄우기 (상세 조건 설정)
        setIsModalOpen(true);
        }

    };

    // ✨ 프리셋 모달 열기 핸들러
    const handleLoadPreset = (presetSongs) => {
        // confirm 창을 띄울 수도 있음 (선택 사항)
        if (playlist.length > 0) {
            if(!window.confirm("현재 목록이 초기화되고 선택한 리스트로 변경됩니다. 진행하시겠습니까?")) return;
        }

        // 리스트 교체
        setPlaylist(presetSongs);
        // 선택 상태 초기화
        setSelectedLeft([]);
    };

    //생성하기 버튼 핸들러
    const handleCreateClick = () => {
        if (playlist.length === 0) return; // 0곡은 버튼 disable이라 실행 안됨

        if (playlist.length < 10) {
        // 10곡 미만이면 경고 모달 오픈
        setIsAlertOpen(true);
        }
        else if (playlist.length > 10) {
          setIsAlertOpen(true);
        }
        else {
        // 10곡 이면 바로 진행
        console.log("게임 생성:", playlist);
        navigate('/generation', { state: { songs: playlist } });
        }
    };

    // "이대로 진행하기" 핸들러
    const handleJustStart = () => {
        setIsAlertOpen(false);
        console.log("적은 곡수로 진행:", playlist);
        navigate('/generation', { state: { songs: playlist } });
    };    

    // "랜덤으로 채워서 진행하기" 핸들러
    const handleFillAndStart = () => {
        const neededCount = 10 - playlist.length;
        
        // 전체 DB(MOCK_DATABASE + MOCK_CHART 등 가용 자원)에서 
        // 현재 playlist에 없는 곡들만 필터링
        const currentIds = playlist.map(s => s.id);
        // 예시로 MOCK_CHART를 풀(Pool)로 사용하겠습니다. (실제론 전체 DB 사용)
        const availableSongs = songData.filter(song => !currentIds.includes(song.id));

        // 랜덤 섞기 후 필요한 만큼 자르기
        const randomFills = availableSongs
        .sort(() => 0.5 - Math.random())
        .slice(0, neededCount);

        const newPlaylist = [...playlist, ...randomFills];
        
        setPlaylist(newPlaylist); // (선택사항) 화면 업데이트
        setIsAlertOpen(false);
        navigate('/generation', { state: { songs: newPlaylist } });
    };

return (
    <div className="h-[calc(100vh-3rem)] flex flex-col p-4 max-w-7xl mx-auto">
      {/* 상단 영역: 모드 전환 버튼들 (우측 리스트 제어) */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setRightMode("chart")}
          className={`flex items-center px-4 py-2 rounded-lg border font-medium transition-colors
            ${
              rightMode === "chart"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
        >
          <Music size={18} className="mr-2" /> 음원 차트
        </button>

        <div className="relative">
          {" "}
          {/* relative 컨테이너 추가 */}
          <button
            onClick={handleSearchModeClick}
            className={`flex items-center px-4 py-2 rounded-lg border font-medium transition-colors group
              ${
                rightMode === "search"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
          >
            <Search size={18} className="mr-2" />
            직접 검색
            {rightMode === "search" && (
              <ChevronDown
                size={16}
                className="ml-2 opacity-80 group-hover:translate-y-0.5 transition-transform"
              />
            )}
          </button>
          {/* ✨ 모달 위치 이동: 버튼 바로 아래에 렌더링 ✨ */}
          {/* 이제 SearchModal의 'absolute top-full'이 이 relative div를 기준으로 잡힙니다 */}
          <SearchModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* 메인 컨텐츠: 3단 레이아웃 (좌 - 중 - 우) */}
      <div className="flex-1 flex gap-4 min-h-0">
        {" "}
        {/* 1. 왼쪽: 플레이리스트 */}
        <div className="w-[500px] flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-2">
            
                {/* 타이틀과 곡 수 표시 */}
                <h3 className="font-bold text-lg text-gray-700 flex items-center">
                Custom Playlist
                <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {playlist.length}곡
                </span>
                </h3>

                {/* ✨ 3. 추천 목록 버튼 (Relative 컨테이너) */}
                <div className="relative">
                    <button 
                        onClick={() => setIsPresetOpen(!isPresetOpen)}
                        className={`flex items-center text-sm px-3 py-1.5 rounded-lg border transition-colors
                        ${isPresetOpen 
                            ? 'bg-gray-800 text-white border-gray-800' 
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                    >
                        <ListMusic size={16} className="mr-1.5" />
                        추천 목록
                        <ChevronDown size={14} className="ml-1 opacity-70" />
                    </button>

                 {/* ✨ 프리셋 모달 (버튼 아래에 위치) */}
                    <PresetModal 
                        isOpen={isPresetOpen}
                        onClose={() => setIsPresetOpen(false)}
                        presets={presets}
                        onSelect={handleLoadPreset}
                    />
                </div>
            </div>
        
            <SongList 
                songs={playlist} 
                selectedIds={selectedLeft} 
                onToggleSelect={(id) => {
                  if (selectedLeft.includes(id)) {
                    setSelectedLeft(selectedLeft.filter(item => item !== id));
                  } 
                  // 선택 안 된 ID라면 추가 (spread)
                  else {
                    setSelectedLeft([...selectedLeft, id]);
                  }
                }
                }
                emptyMessage="곡을 추가하거나 추천 목록을 불러오세요." // 메시지 살짝 수정
            />
        </div>
        {/* 2. 중앙: 이동 버튼 */}
        <div className="w-16 flex flex-col justify-center gap-4 items-center">
          <button
            onClick={handleAdd}
            disabled={selectedRight.length === 0}
            className="p-3 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white transition"
            title="목록에 추가"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleRemove}
            disabled={selectedLeft.length === 0}
            className="p-3 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-white transition"
            title="목록에서 제거"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        {/* 3. 오른쪽: 노래 목록 (차트 or 검색결과) */}
        <div className="w-[500px] flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-2 text-gray-700">
            {rightMode === "chart" ? "Top 100 Chart" : "Search Results"}
          </h3>
          <SongList
            songs={rightMode === "chart" ? chartList : searchList}
            selectedIds={selectedRight}
            onToggleSelect={(id) =>
              toggleSelection(id, selectedRight, setSelectedRight)
            }
            emptyMessage={isChartLoading ? "차트 불러오는 중..." : "목록이 없습니다."}
          />
        </div>
      </div>

      {/* 하단: 생성하기 버튼 */}
      <div className="mt-6 flex justify-center">
        <button 
            onClick={handleCreateClick} // ✨ 핸들러 연결
            disabled={playlist.length === 0}
            className="bg-gray-900 text-white text-lg font-bold py-4 px-12 rounded-xl shadow-lg 
                        hover:bg-blue-600 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
            {playlist.length}곡으로 게임 생성하기
        </button>
      </div>
      
      <SongCountAlert 
        isOpen={isAlertOpen}
        currentCount={playlist.length}
        onClose={() => setIsAlertOpen(false)}      // 1. 뒤로 가기
        onProceed={handleJustStart}                // 2. 이대로 진행
        onFillRandom={handleFillAndStart}          // 3. 랜덤 채우기
      />
    </div>
  );
};

export default Custom;
