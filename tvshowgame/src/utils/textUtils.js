/**
 * 전체 가사에서 AI 이미지 생성에 적합한 하이라이트 구간을 추출합니다.
 * @param {string} fullLyrics - 전체 가사 문자열
 * @returns {string} - 추출된 가사 세그먼트
 */
export const extractLyricSegment = (fullLyrics) => {
  if (!fullLyrics) return "K-pop song illustration"; // 가사가 없을 경우 기본값

  // 1. 줄바꿈(\n) 기준으로 가사를 배열로 나눕니다.
  const lines = fullLyrics
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 5);
  // (길이가 너무 짧은 'Yeah', 'Oh' 같은 추임새는 제외하기 위해 길이 5 이상만 필터링)

  if (lines.length === 0) return fullLyrics.slice(0, 50); // 필터링 후 남은게 없으면 앞에서 자름

  // 2. 랜덤한 시작 위치를 잡습니다. (전체 라인 수 - 뽑을 라인 수 범위 내에서)
  const lineCountToPick = 2; // 2줄 정도 뽑기 (너무 길면 AI가 헷갈려함)

  // 가사가 짧으면 처음부터, 길면 중간 랜덤 위치에서
  const maxStartIndex = Math.max(0, lines.length - lineCountToPick);
  const randomIndex = Math.floor(Math.random() * maxStartIndex);

  // ✨ [수정 1] 재할당을 위해 const 대신 let 사용
  let segment = lines
    .slice(randomIndex, randomIndex + lineCountToPick)
    .join(", ");

  // 현재 마지막으로 사용한 줄의 다음 인덱스
  let currentEndIndex = randomIndex + lineCountToPick;

  // ✨ [수정 2] 길이가 50자가 안 되고, 아직 뒤에 남은 줄이 있다면 계속 붙이기
  while (segment.length < 50 && currentEndIndex < lines.length) {
    // 다음 줄 가져오기
    const nextLine = lines[currentEndIndex];

    // 기존 가사에 이어 붙이기
    segment += ", " + nextLine;

    // 인덱스 증가 (다음 줄로 이동)
    currentEndIndex++;
  }
  console.log(segment);
  return segment;
};
