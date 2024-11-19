import { CONSTANTS } from '../constants/bookingIndex';

// 시간 옵션 생성 유틸리티 함수
export const generateTimeOptions = () => 
    Array.from({ length: 24 }, (_, i) => ({
      value: `${i.toString().padStart(2, '0')}:00`,
      label: `${i.toString().padStart(2, '0')}:00`
    }));

    
export const calculatePrice 
= (start, end) => {
    if (!start || !end) return 0;
    const [startHour, endHour] = [start, end].map(time => 
        parseInt(time.split(':')[0]));
    return Math.max(0, endHour - startHour) * CONSTANTS.HOURLY_RATE;
    };