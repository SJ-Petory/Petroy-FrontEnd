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
        <div className="custom-schedule-container">
            <ul className="custom-schedule-list">
                {getSchedulesForDate(selectedDate).map(schedule => (
                    <div key={schedule.scheduleId} className="custom-schedule-item">
                        {schedule.title}
                    </div>
                ))}
            </ul>
        </div>
    );
};

const CalendarComponent = ({ selectedDates, schedules }) => {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSelectedDate(newDate);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (date.toDateString() === new Date().toDateString()) {
                return 'custom-highlight-today';
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const schedulesForDate = schedules.filter(schedule => {
                const scheduleDate = new Date(schedule.scheduleAt).toDateString();
                return scheduleDate === date.toDateString();
            });
            return (
                <div className="custom-tile-content">
                    {schedulesForDate.length > 0 && (
                        <div className="custom-tile-schedules">
                            {schedulesForDate.map(schedule => (
                                <div key={schedule.scheduleId} className="custom-tile-schedule-item">
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
        <div className="custom-calendar-wrapper">
            <div className="custom-calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    view="month"
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    navigationLabel={({ date }) => {
                        return (
                            <div>
                                <span>{date.toLocaleString('default', { month: 'long' })}</span>
                                <span> {date.getFullYear()}</span>
                            </div>
                        );
                    }}
                />
            </div>
            {selectedDate && <ScheduleComponent selectedDate={selectedDate} schedules={schedules} />}
        </div>
    );
};

export default CalendarComponent;