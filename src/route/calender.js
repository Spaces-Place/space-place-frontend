import React, { useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import '../css/mycalender.css'

export default function MyCalendar() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  
  // 예시 출석일
  const attendDays = ["2024-11-03", "2024-11-13"]; 

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setActiveStartDate(today);
    setDate(today);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        className="react-calendar"
        value={date}
        onChange={handleDateChange}
        formatDay={(locale, date) => moment(date).format("D")}
        formatYear={(locale, date) => moment(date).format("YYYY")}
        formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => 
          setActiveStartDate(activeStartDate)
        }
        tileContent={({ date, view }) => {
          const html = [];
          
          if (
            view === "month" &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          ) {
            html.push(<div className="today-label" key="today">오늘</div>);
          }
          
          if (attendDays.includes(moment(date).format("YYYY-MM-DD"))) {
            html.push(<div className="attendance-dot" key={moment(date).format("YYYY-MM-DD")} />);
          }
          
          return html;
        }}
      />
      <button className="today-button" onClick={handleTodayClick}>오늘</button>
    </div>
  );
};
