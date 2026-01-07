import React from 'react';

// emptyMessage prop 추가 (기본값 설정)
const SongList = ({ songs, selectedIds, onToggleSelect, onDragStart, onDragEnter, emptyMessage = "목록이 비어있습니다." }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-inner h-full">
      {songs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          {emptyMessage} {/* 전달받은 메시지 출력 */}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {songs.map((song) => {
            const isSelected = selectedIds.includes(song.id);
            return (
              <li
                key={song.id}
                onMouseDown={() => onDragStart && onDragStart(song.id)}
                onMouseEnter={() => onDragEnter && onDragEnter(song.id)}
                className={`p-3 cursor-pointer select-none transition-colors flex justify-between items-center
                  ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'}`}
              >
                <div className="flex flex-col ">
                  <span className="font-bold text-gray-800">{song.title}</span>
                  <div className="text-sm text-gray-500">
                    <span>{song.artist}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>{song.date}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SongList;