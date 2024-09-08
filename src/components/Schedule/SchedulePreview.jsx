import React from 'react';
import '../../styles/Main/SchedulePreview.css';

const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
  
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${year}년 ${month}월 ${day}일 ${ampm} ${formattedHours}시 ${formattedMinutes}분`;
  };
  
  const SchedulePreview = ({ formData }) => {
    const {
      categoryId, title, content, scheduleAt, repeatType, repeatCycle, customRepeat,
      noticeYn, noticeAt, priority, petId
    } = formData;
  
    const formattedStartDate = formatDateTime(scheduleAt);
    const formattedEndDate = customRepeat?.endDate ? formatDateTime(customRepeat.endDate) : '';
    const priorityText = {
      LOW: '낮음',
      MEDIUM: '중간',
      HIGH: '높음'
    }[priority] || '낮음';
  
    const repeatDescription = () => {
        if (repeatType === 'BASIC') {
          switch (repeatCycle) {
            case 'DAILY':
              return '매일 해당 시각에 일정이 반복됩니다.';
            case 'WEEKLY':
              return '매주 해당 시각에 일정이 반복됩니다.';
            case 'MONTHLY':
              return '매달 해당 시각에 일정이 반복됩니다.';
            default:
              return '반복 주기 없음';
          }
        } else if (repeatType === 'CUSTOM') {
          const { frequency, interval, daysOfWeek, daysOfMonth } = customRepeat;
          if (frequency === 'WEEK') {
            return `${interval}주 간격으로 ${daysOfWeek.join(', ')} 요일마다 일정이 반복됩니다.`;
          } else if (frequency === 'MONTH') {
            return `${interval}개월 간격으로 매달 ${daysOfMonth.join(', ')}일에 일정이 반복됩니다.`;
          } else if (frequency === 'YEAR') {
            return `${interval}년 간격으로 일정이 반복됩니다.`; 
          }
        }
        return '';
      };
  
    return (
      <div className="schedule-preview">
        <h3>일정 생성 미리보기</h3>
        <div className="schedule-preview-content"> 
        <h5>카테고리</h5>
        <p>{categoryId ? categoryId : '카테고리가 선택되지 않았습니다.'}</p>
        <h5>제목</h5>
        <p>{title}</p>
        <h5>내용</h5>
        <p>{content}</p>
        <h5>선택 반려동물</h5>
        <p>{petId.length > 0 ? `선택된 반려동물: ${petId.join(', ')}` : '반려동물이 선택되지 않았습니다.'}</p>
        <h5>일정 시작</h5>
        <p>{formattedStartDate}</p>
        <h5>반복 주기</h5>
        <p>{repeatDescription()}</p>
        <h5>일정 종료</h5>
        <p>{formattedEndDate}</p>
        <h5>알림 설정</h5>          
        <p>{noticeYn ? `해당 일정 ${noticeAt} 분 전에 알림을 설정` : ''}</p>
        <h5>우선 순위</h5>
        <p>{priorityText}</p>
        </div>
      </div>
    );
  };

  export default SchedulePreview;