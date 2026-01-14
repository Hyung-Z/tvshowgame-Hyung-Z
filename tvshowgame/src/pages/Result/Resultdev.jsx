import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Music,
  Film,
  X,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import JSZip from 'jszip';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Game.jsx에서 전달받은 데이터 (없으면 기본값 처리)
  const { score = 0, total = 0, songs = [] } = location.state || {};
  const shareCardRef = useRef(null);
  const [shareTarget, setShareTarget] = useState(null);

  const [generatedCardImage, setGeneratedCardImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); // 로딩 상태

  const handleShowCardModal = async (song) => {
    setIsGenerating(true);
    setShareTarget(song); // 숨겨진 템플릿에 데이터 주입

    // 렌더링 대기 (0.1초)
    setTimeout(async () => {
      if (!shareCardRef.current) return;

      try {
        // html2canvas로 캡처
        const canvas = await html2canvas(shareCardRef.current, {
          useCORS: true,
          scale: 2, // 고화질
          backgroundColor: null,
        });

        // 캔버스를 이미지 URL(base64 문자열)로 변환
        const imgDataUrl = canvas.toDataURL("image/png");

        // ✨ 모달에 띄울 이미지 state 설정
        setGeneratedCardImage(imgDataUrl);
      } catch (error) {
        console.error("카드 생성 실패:", error);
        alert("이미지 카드를 만드는데 실패했습니다.");
      } finally {
        // 정리 작업
        setShareTarget(null); // 템플릿 데이터 초기화
        setIsGenerating(false); // 로딩 끝
      }
    }, 100);
  };

  const handleDownloadCard = () => {
    if (!generatedCardImage) return;
    const link = document.createElement("a");
    link.href = generatedCardImage;
    link.download = `kpop_card_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✨ 이미지 다운로드 헬퍼 함수
  const downloadBase64 = (base64Data, fileName) => {
    const linkSource = `data:image/png;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `${fileName}.png`;
    downloadLink.click();
  };

  // ✨ 전체 다운로드 버튼 핸들러
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("My_Songs"); // 압축 파일 내 폴더 생성

    songs.forEach((song) => {
      if (song.b64Data) {
        // 파일명 정리
        const safeTitle = song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const safeSeg = song.lyricsSeg.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${safeTitle}_${safeSeg}.png`;

        // Base64 데이터에서 'data:image/png;base64,' 헤더 제거
        const imgData = song.b64Data.replace(/^data:image\/(png|jpg);base64,/, "");
        
        // zip에 파일 추가
        folder.file(fileName, imgData, { base64: true });
      }
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

      // 3. 브라우저 다운로드 트리거 (file-saver 대체 코드)
    const url = URL.createObjectURL(zipBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "All_Songs.zip"; // 다운로드될 압축 파일 이름
    document.body.appendChild(downloadLink); // 파이어폭스 등 호환성을 위해 추가
    downloadLink.click();
    
    // 4. 뒷정리 (메모리 해제 및 링크 삭제)
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-3rem)] flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
      {isGenerating && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <p className="text-gray-800 font-bold">공유 카드 만드는 중...</p>
          </div>
        </div>
      )}

      {/* 1. 결과 헤더 & 총점 */}
      <div className="text-center mb-8 animate-fadeIn">
        <p className="text-gray-500 font-medium mb-2">GAME OVER</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">최종 스코어</h1>

        <div className="bg-blue-50 px-10 py-6 rounded-3xl border-2 border-blue-100 shadow-sm inline-block">
          <span className="text-6xl font-extrabold text-blue-600">{score}</span>
          <span className="text-2xl text-gray-400 ml-2 font-medium">
            / {total}
          </span>
        </div>
      </div>

      {/* 2. 문제 리스트 (스크롤 가능 영역) */}
      <div className="w-full flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col min-h-0 mb-6 animate-fadeInUp">
        {/* 리스트 헤더 */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="font-bold text-gray-700">플레이 리스트</span>
          <span className="text-xs text-gray-400">{songs.length}곡</span>
        </div>

        {/* 스크롤 가능한 리스트 본문 */}
        <div className="overflow-y-auto p-2 space-y-2 flex-1 scrollbar-hide">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
            >
              {/* 썸네일 (이미지 or 아이콘) */}
              <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center mr-3">
                {song.imageUrl ? (
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                ) : // 이미지가 없으면 타입에 따라 아이콘 표시
                song.videoId ? (
                  <Film size={20} className="text-gray-400" />
                ) : (
                  <Music size={20} className="text-gray-400" />
                )}
              </div>

              {/* 곡 정보 */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">
                  <span className="text-blue-500 mr-2 font-mono">
                    #{index + 1}
                  </span>
                  {song.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
              </div>

              {/* (선택 사항) YouTube 링크가 있다면 바로가기 아이콘 표시 */}
              {song.youtubeUrl && (
                <a
                  href={`https://www.youtube.com/watch?v=${song.youtubeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Film size={18} />
                </a>
              )}
              <button
                onClick={() => handleShowCardModal(song)}
                className="p-2 bg-pink-600 rounded-full text-white shadow-lg hover:bg-pink-500 active:scale-95 transition"
                title="카드 보기 및 저장"
              >
                <ImageIcon size={18} /> {/* 아이콘 변경 */}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div 
      className="flex flex-col gap-8 w-full items-center justify-center">
        
        <button
          onClick={handleDownloadAll}
          className="w-full py-4 bg-gray-600 text-white rounded-xl font-bold text-lg hover:bg-gray-500 transition shadow-lg flex items-center justify-center"
        >
          <Download size={20} className="mr-2" /> 이미지 저장하기
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center"
        >
          <Home size={20} className="mr-2" /> 메인으로 돌아가기
        </button>
      </div>
      {/* 3. 홈으로 버튼 */}

      {generatedCardImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative flex flex-col items-center max-w-lg w-full">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setGeneratedCardImage(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition p-2"
            >
              <X size={32} />
            </button>

            {/* 생성된 이미지 표시 영역 */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 max-h-[70vh]">
              <img
                src={generatedCardImage}
                alt="Generated Share Card"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* 안내 문구 및 다운로드 버튼 */}
            <div className="mt-6 flex flex-col items-center gap-3 w-full">
              <p className="text-gray-300 text-sm">
                💡 이미지를 꾹 눌러 저장하거나, 캡처하세요!
              </p>
              <button
                onClick={handleDownloadCard}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
              >
                <Download size={20} />
                이미지 파일로 저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {shareTarget && (
          <div
            ref={shareCardRef}
            style={{
              width: "900px",
              height: "1000px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              color: "#ffffff", // 텍스트 색상도 확실하게 Hex로 지정
            }}
          >

            <img
              src={shareTarget.imageUrl}
              alt="bg"
              crossOrigin="anonymous"
              className="blur-sm"

              style={{
                position: "absolute",
                inset: 0, // 상하좌우 꽉 채우기
                width: "100%",
                height: "100%",
                objectFit: "cover", // 비율 유지하며 꽉 채우기
                transform: "scale(1.2)", // 중요: 블러 먹으면 테두리가 하얗게 뜨는 걸 방지하기 위해 20% 확대
                zIndex: 0, // 맨 뒤
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                // 위는 약간 투명, 아래로 갈수록 어두워지는 그라데이션 필터
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
                zIndex: 1, // 이미지 위에 덮음
              }}
            ></div>

            {/* 메인 콘텐츠 */}
            <div
              className="flex flex-col items-center gap-10 p-10 rounded-[60px] shadow-2xl"
              style={{
                position : "relative",
                border: "4px solid rgba(255, 255, 255, 0.2)",
                backgroundColor: "rgba(0, 0, 0, 0.7)", // bg-black/40 대체 // html2canvas 일부 버전에서 무시될 수 있음 (치명적이진 않음)
                zIndex: 10,
              }}
            >
              {/* 메인 그림 */}
              <div className="rounded-[40px] overflow-hidden">
                <img
                  src={shareTarget.imageUrl}
                  style={{
                    width: "400px",
                    height: "400px",
                    objectFit: "cover",
                  }}
                  alt="main art"
                />
              </div>

              {/* 노래 정보 */}
              <div className="text-center mt-4">
                <h2 className="text-7xl font-black mb-4 drop-shadow-lg">
                  {shareTarget.title}
                </h2>
                <p
                  className="text-4xl font-medium"
                  style={{ color: "#d1d5db" }}
                >
                  {shareTarget.artist}
                </p>
              </div>

              {/* 가사 힌트 */}
              <div className="mt-4 mb-4 px-10 py-10 rounded-3xl">
                <p
                  className="text-center text-2xl italic m-[0px]"
                  style={{ color: "#e5e7eb" }}
                >
                  "{shareTarget.lyricsSeg}"
                </p>
              </div>
              
              
              {/* 하단 로고/QR 등을 넣어도 좋음 */}
              <div
                className="text-right bottom-5 text-lg"
                style={{ 
                  color: "#acb2b9ff",
                  position : "relative",
                  zIndex: 10
                }}
              >
                @tvshowgame
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
