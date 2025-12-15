import React, { useState } from "react";
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

// --- Mock Data (나중에 API로 대체) ---
const MOCK_CHART = Array.from({ length: 20 }).map((_, i) => ({
  id: `chart-${i}`,
  title: `Chart Song ${i + 1}`,
  artist: `Singer ${i}`,
  date: "2024.01",
}));

const MOCK_DATABASE = [
  { 
    id: 'db-1', 
    title: 'Hype Boy', 
    artist: 'NewJeans', 
    date: '2022.08',
    imageUrl: '/mock_images/hypeboy.png',
    lyricSegment: "Cause I know what you like boy, You're my chemical hype boy",
    youtubeUrl: '11cta61wi0g' 
  },
  { id: "db-2", title: "손오공", artist: "SEVENTEEN", date: "2023.04",
    lyricSegment: "영웅본색 Like This 시간과 공간에 구애받지 않는 자세 힘을 다하고 쓰러져도 포기를 모르고 날뛰는 중 마치 된 것 같아 손오공",
    youtubeUrl: '-GQg25oP0S4',
    imageUrl: '/mock_images/sonogong.png'
  },
  { id: 'db-3', 
    title: 'Love Dive', 
    artist: 'IVE', 
    date: '2022.04',
    imageUrl: '/mock_images/lovedive.png',
    lyricSegment: "숨 참고 love dive",
    youtubeUrl: 'Y8JFxS1HlDo'
  },
  { id: "db-4", title: "After LIKE", artist: "IVE", date: "2022.08",
    lyricSegment: "조심해 두 심장에 핀 새파란 이 불꽃이저 태양보다 뜨거울 테니",
    youtubeUrl: 'F0B7HDiY-10',
    imageUrl: '/mock_images/afterlike.png'
   },
  { id: "db-5", title: "Dynamite", artist: "BTS", date: "2020.08",
    lyricSegment: "Cause I, I, I'm in the stars tonight So watch me bring the fire and set the night alight",
    imageUrl: '/mock_images/dynamite.png',
    youtubeUrl: 'gdZLi9oWNZg'
   },
  { id: "db-6", title: "버스안에서", artist: "자자", date: "2007.07",
    lyricSegment: "나는 매일 학교가는 버스 안에서 항상 같은 자리에 앉아 있는 그녈 보곤해",
    imageUrl: '/mock_images/버스안에서.png',
    youtubeUrl: 'ElQOGND2EKw'
   },
  { id: "db-7", title: "Gangnam Style", artist: "PSY", date: "2012.07",
    lyricSegment: "낮에는 따사로운 인간적인 여자, 커피 한 잔의 여유를 아는 품격있는 여자",
    imageUrl: '/mock_images/gangnamstyle.png',
    youtubeUrl: '9bZkp7q19f0'
   },
  { id: "db-8", title: "Gee", artist: "Girls Generation", date: "2009.01", 
    lyricSegment: "두근 두근거려 밤엔 잠도 못 이루죠 나는 나는 바본가봐요 그대 그대밖에 모르는 바보 그래요 그댈 보는 난 너무 반짝 반짝 눈이 부셔" 
    ,imageUrl: '/mock_images/gee.png'
    ,youtubeUrl: 'U7mPqycQ0tQ' },
  { id: "db-9", title: "Blue Valentine", artist: "NMIXX", date: "2025.10", lyricSegment: "You’ll always be my blue valentine You’ll always be my blue valentine 식어도 타오르는 얼음 속 불꽃 아무 겁도 없이 뻗어버린 손 Hot and icy But I like it It’s so you?",
    imageUrl: '/mock_images/bluevalentine.png',
    youtubeUrl: 'EmeW6li6bbo'
  },
  { id: "db-10", title: "SPAGHETTI", artist: "LE SERAFIM", date: "2025.10", lyricSegment: "이빨 사이 낀 SPAGHETTI 빼고 싶니 bon appétit 그냥 포기해 어차피 Eat it up eat it eat it up",
    youtubeUrl: 'TvVtYaqCni8',
    imageUrl: '/mock_images/spaghetti.png'
   },
];

const MOCK_PRESETS = [
  {
    id: 'p-1',
    title: '2023 K-POP 명곡 모음',
    description: '작년 한 해를 뜨겁게 달군 히트곡',
    songs: [
      { id: 'db-1', title: 'Hype Boy', artist: 'NewJeans', date: '2022.08' },
      { id: 'db-3', title: 'Love Dive', artist: 'IVE', date: '2022.04' },
    ]
  },
  {
    id: 'p-2',
    title: '월드 스타 BTS 스페셜',
    description: '전 세계가 사랑한 그들의 노래',
    songs: [
      { id: 'db-5', title: 'Dynamite', artist: 'BTS', date: '2020.08' },
      { id: 'db-6', title: 'Spring Day', artist: 'BTS', date: '2017.02' },
    ]
  },
  {
    id: 'p-3',
    title: '추억의 싸이월드 BGM',
    description: '도토리로 샀던 그 노래들',
    songs: [
      { id: 'db-8', title: 'Gee', artist: 'Girls Generation', date: '2009.01' },
    ]
  }
];

const Custom = () => {
    const navigate = useNavigate();

    // --- State: 데이터 목록 ---
    const [playlist, setPlaylist] = useState([]); // 왼쪽: 선택된 곡들
    const [chartList] = useState(MOCK_CHART); // 오른쪽 1: 차트 데이터
    const [searchList, setSearchList] = useState([]); // 오른쪽 2: 검색 결과 (유지됨)

    // --- State: UI 및 선택 상태 ---
    const [rightMode, setRightMode] = useState("chart"); // 'chart' or 'search'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPresetOpen, setIsPresetOpen] = useState(false); // ✨ 프리셋 모달 상태
    const [isAlertOpen, setIsAlertOpen] = useState(false); // ✨ 경고 모달 상태
    
    // 다중 선택을 위한 ID 배열
    const [selectedLeft, setSelectedLeft] = useState([]);
    const [selectedRight, setSelectedRight] = useState([]);

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
      // TODO: API 호출 로직
      const filtered = MOCK_DATABASE.filter((song) => {
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
        } else {
        // 10곡 이상이면 바로 진행
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
        const availableSongs = MOCK_DATABASE.filter(song => !currentIds.includes(song.id));

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
                        presets={MOCK_PRESETS}
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
