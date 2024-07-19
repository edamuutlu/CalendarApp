import React, { useEffect, useReducer, useState } from 'react';
import { Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import EventModal from '../EventModal/EventModal';
import "./CalendarContext.css"

interface EventData {
    id: number;
    title: string;
    description: string;
    label: string;
    day: number;
}

type Action = 
    | { type: 'push', payload: EventData }
    | { type: 'update', payload: EventData }
    | { type: 'delete', payload: EventData };

const savedEventsReducer = (state: EventData[], action: Action): EventData[] => {
    switch (action.type) {
        case 'push':
            return [...state, action.payload];
        case 'update':
            return state.map(evt => evt.id === action.payload.id ? action.payload : evt);
        case 'delete':
            return state.filter(evt => evt.id !== action.payload.id);
        default:
            throw new Error();
    }
};

const initEvents = (): EventData[] => {
    const storageEvents = localStorage.getItem('savedEvents');
    let parsedEvents: EventData[] = [];
    try {
        parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
    } catch (e) {
        console.error('Failed to parse savedEvents from localStorage', e);
        parsedEvents = [];
    }
    return parsedEvents;
};

export const CalendarContext: React.FC = () => {
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>(undefined);
    const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, [], initEvents);

    useEffect(() => {
        localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
    }, [savedEvents]);

    const handleSelect = (date: Dayjs) => {
        setSelectedDay(date);
        setShowEventModal(true);
    };

    const handleSaveEvent = (eventData: EventData) => {
        if (selectedEvent) {
            dispatchCalEvent({ type: 'update', payload: eventData });
        } else {
            dispatchCalEvent({ type: 'push', payload: eventData });
        }
        setShowEventModal(false);
    };

    const dateCellRender = (value: Dayjs) => {
        const dayEvents = savedEvents.filter(event => dayjs(event.day).isSame(value, 'day'));
        return (
            <ul>
                {dayEvents.map(event => (
                    <li className="cell-style" key={event.id}>{event.title}</li>
                ))}
            </ul>
        );
    };

    /* const handlePanelChange = (date: Dayjs, mode: string) => {
        console.log('Selected Date:', date);
        console.log('Current Mode:', mode);
    }; */

    return (
        <div>
            <Calendar
                onSelect={handleSelect}
                cellRender={dateCellRender}
                /* onPanelChange={handlePanelChange} */
            />
            {selectedDay &&  (
                <EventModal 
                    visible={showEventModal}
                    onClose={() => setShowEventModal(false)}
                    onSave={handleSaveEvent}
                    selectedEvent={selectedEvent}
                    daySelected={selectedDay}
                />
            )}
        </div>
    );
};

export default CalendarContext;
