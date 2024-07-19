import React, { useEffect, useReducer, useState } from 'react';
import { Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import EventModal from '../EventModal/EventModal';

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
        setSelectedEvent(undefined);
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
        return (
            <div>
                {/* Burada her gün için etkinlikleri render edebilirsiniz */}
            </div>
        );
    };

    const handlePanelChange = (date: Dayjs, mode: string) => {
        console.log('Selected Date:', date);
        console.log('Current Mode:', mode);
    };

    return (
        <div>
            <Calendar
                onSelect={handleSelect}
                dateCellRender={dateCellRender}
                onPanelChange={handlePanelChange}
            />
            {selectedDay && (
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
