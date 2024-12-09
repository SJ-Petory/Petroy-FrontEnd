import React, { useState } from 'react';
import '../../styles/CalendarComponent.css';
import 'font-awesome/css/font-awesome.min.css';

const CalendarComponent = ({ schedules, selectedDates }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(1 - firstDayOfMonth.getDay());

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const endDay = new Date(lastDayOfMonth);
    endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

    const groupDatesByWeek = (startDay, endDay) => {
        const weeks = [];
        let currentWeek = [];
        let currentDate = new Date(startDay);

        while (currentDate <= endDay) {
            currentWeek.push(new Date(currentDate));
            if (currentWeek.length === 7 || currentDate.getDay() === 6) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    };

    const weeks = groupDatesByWeek(startDay, endDay);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const today = new Date();

    return (
        <div className="calendar">
            <div className="header">
                <button onClick={goToPreviousMonth} className="nav-button">
                    <i className="fa fa-chevron-left" aria-hidden="true"></i> {/* 이전 아이콘 */}
                </button>
                <h2>{year}년 {month + 1}월</h2>
                <button onClick={goToNextMonth} className="nav-button">
                    <i className="fa fa-chevron-right" aria-hidden="true"></i> {/* 다음 아이콘 */}
                </button>
            </div>
            <div className="weekdays">
                <div>일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div>토</div>
            </div>
            <div className="days">
                {weeks.map((week, index) => (
                    <div key={index} className="week">
                        {week.map((date, idx) => {
                            const dateStr = date.toDateString(); 
                            const isToday = dateStr === today.toDateString();
                            const hasSchedules = schedules.filter(schedule => new Date(schedule.date).toDateString() === dateStr);

                            return (
                                <div key={idx} className={`day ${isToday ? 'today' : ''}`}>
                                    {date.getDate()}
                                    {hasSchedules.length > 0 && (
                                        <div className="schedule-details">
                                            {hasSchedules.map(schedule => (
                                                <div key={schedule.scheduleId} className="Calendar-schedule-title">
                                                    {schedule.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarComponent;
