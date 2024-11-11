export const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      
      // 날짜가 유효하지 않으면 원본 문자열 반환
      if (isNaN(date.getTime())) {
        return dateString;
      }
  
      // 한국어 날짜 포맷
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
      
      // 또는 더 간단한 포맷
      // return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };
  
  // 필요한 경우 추가 유틸리티 함수들
  export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  export const getRelativeTimeString = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
      if (diffDays === 0) return '오늘';
      if (diffDays === 1) return '어제';
      if (diffDays <= 7) return `${diffDays}일 전`;
      
      return formatDate(dateString);
    } catch (error) {
      console.error('Relative time calculation error:', error);
      return dateString;
    }
  };