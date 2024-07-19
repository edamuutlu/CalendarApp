import React, { useContext, useState } from 'react';
import './App.css';

import { Button, Calendar, Row } from 'antd';
import Sidebar from './components/Sidebar/Sidebar';
import CalendarHeader from './components/CalenderHeader/CalendarHeader';
import dayjs from 'dayjs';
import CalendarContext from './components/CalenderContext/CalendarContext';
import EventModal from './components/EventModal/EventModal';
import GlobalContext from './context/GlobalContext';

const App: React.FC = () => {
    const [date, setDate] = useState(dayjs());
    const {showEventModal} = useContext(GlobalContext);

    return (
        <div>
            <CalendarHeader date={date} setDate={setDate} />
            <div className='hero'>
                <Sidebar />
                <CalendarContext/>
            </div>
        </div>
    );
}

export default App;
