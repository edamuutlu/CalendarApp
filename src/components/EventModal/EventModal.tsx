import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Modal, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

interface EventModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (eventData: EventData) => void;
    selectedEvent?: EventData;
    daySelected: Dayjs;
}

interface EventData {
    id: number;
    title: string;
    description: string;
    label: string;
    day: number;
}

const EventModal: React.FC<EventModalProps> = ({ visible, onClose, onSave, selectedEvent, daySelected }) => {
    const [title, setTitle] = useState<string>(selectedEvent?.title || '');
    const [description, setDescription] = useState<string>(selectedEvent?.description || '');
    const [selectedLabel, setSelectedLabel] = useState<string>(selectedEvent?.label || '');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'title') setTitle(value);
        if (name === 'description') setDescription(value);
    };

    const handleSaveEvent = (e: FormEvent) => {
        e.preventDefault();
        const calendarEvent: EventData = {
            title,
            description,
            label: selectedLabel,
            day: daySelected.valueOf(),
            id: selectedEvent ? selectedEvent.id : Date.now(),
        };
        onSave(calendarEvent);
        //setShowEventModal(false);
    };

    return (
        <Modal
            title="Add Event"
            visible={visible}
            onCancel={onClose}
            onOk={handleSaveEvent}
            okText="Save"
            cancelText="Cancel"
        >
            <form onSubmit={handleSaveEvent}>
                <Input
                    placeholder="Event Title"
                    name="title"
                    value={title}
                    onChange={handleInputChange}
                    style={{ marginBottom: '10px' }}
                />
                <Input.TextArea
                    placeholder="Event Description"
                    name="description"
                    value={description}
                    onChange={handleInputChange}
                />
            </form>
        </Modal>
    );
};

export default EventModal;
