import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar.css';

const ScheduleComponent = ({ selectedDate }) => {
    return (
        <div className="schedule-container">
            <h3>일정표</h3>
            {/* 날짜를 문자열 형태로 표시 */}
            <p>{selectedDate.toDateString()}</p> 
        </div>
    );
};

const CalendarComponent = () => {
    const [date, setDate] = useState(new Date()); // 현재 달력에서 선택된 날짜
    const [selectedDate, setSelectedDate] = useState(null); // 사용자가 선택한 날짜

    // 날짜 상태변경 업데이트 핸들러 함수
    const handleDateChange = (newDate) => {
        setDate(newDate); // 현재 날짜 업데이트
        setSelectedDate(newDate); // 사용자 선택 날짜 업데이트
    };

    // 현재 날짜에 하이라이트 클래스를 추가
    const tileClassName = ({ date, view }) => {
        if (view === 'month') { // 월 보기일 때만
            if (date.toDateString() === new Date().toDateString()) { // 오늘 날짜와 비교
                return 'highlight-today'; // 오늘 날짜에 하이라이트 
            }
        }
    };

    return (
        <div className="calendar-wrapper">
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange} // 날짜 변경 시 호출되는 함수
                    value={date} // 현재 선택된 날짜를 달력에 전달
                    view="month" // 달력의 뷰를 월 단위로 설정
                    tileClassName={tileClassName} 
                    navigationLabel={({ date }) => {
                        return (
                            <div>
                                {/* 달력 상단 내비게이션 바 */}
                                <span>{date.toLocaleString('default', { month: 'long' })}</span>
                                <span> {date.getFullYear()}</span>
                            </div>
                        );
                    }}
                />
            </div>
            {/* 선택된 날짜 일정표 표시 */}
            {selectedDate && <ScheduleComponent selectedDate={selectedDate} />}
        </div>
    );
};

export default CalendarComponent;
