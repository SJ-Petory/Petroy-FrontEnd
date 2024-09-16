import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Calendar.css';

const ScheduleComponent = ({ selectedDate, schedules }) => {
    const getSchedulesForDate = (date) => {
        return schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.scheduleAt).toDateString();
            return scheduleDate === date.toDateString();
        });
    };

    return (
        <div className="schedule-container">
            <ul className="schedule-list2">
                {getSchedulesForDate(selectedDate).map(schedule => (
                    <div key={schedule.scheduleId} className="schedule-item2">
                        {schedule.title}
                    </div>
                ))}
            </ul>
        </div>
    );
};

const CalendarComponent = ({ selectedDates, schedules }) => {
    const [date, setDate] = useState(new Date()); // 현재 달력에서 선택된 날짜
    const [selectedDate, setSelectedDate] = useState(null); // 사용자가 선택한 날짜

    useEffect(() => {
        // 컴포넌트가 마운트될 때 오늘 날짜를 선택된 날짜로 설정
        setSelectedDate(new Date());
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSelectedDate(newDate);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (date.toDateString() === new Date().toDateString()) {
                return 'highlight-today';
            }
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const schedulesForDate = schedules.filter(schedule => {
                const scheduleDate = new Date(schedule.scheduleAt).toDateString();
                return scheduleDate === date.toDateString();
            });
            return (
                <div className="tile-content">
                    {schedulesForDate.length > 0 && (
                        <div className="tile-schedules">
                            {schedulesForDate.map(schedule => (
                                <div key={schedule.scheduleId} className="tile-schedule-item">
                                    {schedule.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
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
                    tileContent={tileContent} // 각 날짜에 일정 표시
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
            {selectedDate && <ScheduleComponent selectedDate={selectedDate} schedules={schedules} />}
        </div>
    );
};

export default CalendarComponent;