import React, { useContext, useEffect, useState } from 'react';
import logo from '../../assets/logo.jpg'
import './CalendarHeader.css';
import dayjs from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface CalendarHeaderProps {
    date: dayjs.Dayjs;
    setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}

export default function CalendarHeader({ date, setDate }: CalendarHeaderProps) {
    const [monthIndex, setMonthIndex] = useState(0);

    /* function handlePrevMonth(){       
        setMonthIndex(monthIndex-1);   
        setDate(date.add(2, 'months'));
      }
      function handleNextMonth(){
        setMonthIndex(monthIndex+1);
        setDate(date.add(-2, 'months'));
      } */
      function handleReset(){
        setMonthIndex(monthIndex === dayjs().month() 
        ? monthIndex + Math.random() 
        : dayjs().month())
      } 

    return (
        <header className="calendar-header">
            <div className="calendar-header-operations">
                <img src={logo} alt="calendar" className="calendar-logo" />
                <h1 className="calendar-title">Baykar Calendar</h1>
                <button onClick={handleReset} className="calendar-button">
                    Today
                </button>
                <button onClick={() => setDate(date.add(2, 'months'))} className='calendar-button'>
                    <LeftOutlined />
                </button>
                <button onClick={() => setDate(date.add(-2, 'months'))} className='calendar-button'>
                    <RightOutlined />
                </button>
                <h2 className="calendar-month">
                    {dayjs(new Date(dayjs().year(), monthIndex)).format("MMM YYYY")}
                </h2>
            </div>
            <div className="right-buttons">
                <button className="calendar-button">Login</button>
                <button className="calendar-button">Register</button>
            </div>
        </header>
    );
}
