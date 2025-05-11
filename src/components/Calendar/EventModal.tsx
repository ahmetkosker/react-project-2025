import React from 'react';
import dayjs from 'dayjs';
import type { Assignment, Staff, Shift } from '../../models/schedule';

interface TagInfo {
  color: string;
  bg: string;
  text: string;
}

interface TagsMap {
  [key: string]: TagInfo;
}

interface EventModalProps {
  visible: boolean;
  event: Assignment | null;
  position: { x: number; y: number };
  onClose: () => void;
  getStaffById: (id: string) => Staff | undefined;
  getShiftById: (id: string) => Shift | undefined;
  onEventUpdate?: (updatedEvent: Assignment) => void;
}

const TAGS: TagsMap = {
  morning: { color: '#ffd700', bg: '#fff8bf', text: 'Morning' },
  afternoon: { color: '#ff8847', bg: '#fff2ea', text: 'Afternoon' },
  evening: { color: '#4c6ef5', bg: '#eef0ff', text: 'Evening' },
  important: { color: '#ff4444', bg: '#ffefef', text: 'Important' },
  meeting: { color: '#20c997', bg: '#e6f9f3', text: 'Meeting' },
  training: { color: '#a980f0', bg: '#f2e9fd', text: 'Training' },
};

const EventModal: React.FC<EventModalProps> = ({ 
  visible, 
  event, 
  position, 
  onClose,
  getStaffById,
  getShiftById,
  onEventUpdate
}) => {
  if (!visible || !event) return null;

  const staff = getStaffById(event.staffId);
  const shift = getShiftById(event.shiftId);

  const handleTagToggle = (tag: string) => {
    if (!event || !onEventUpdate) return;
    
    const newTags = event.tags ? [...event.tags] : [];
    const tagIndex = newTags.indexOf(tag);
    
    if (tagIndex >= 0) {
      newTags.splice(tagIndex, 1);
    } else {
      newTags.push(tag);
    }
    
    onEventUpdate({ ...event, tags: newTags });
  };

  const modalStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div 
        className="event-modal" 
        style={modalStyle}
        onClick={e => e.stopPropagation()}
      >
        <div className="event-modal-header">
          <h3>{event.title || (shift ? shift.name : 'Untitled Event')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="event-modal-body">
          <div className="event-detail">
            <span className="detail-label">Staff:</span>
            <span className="detail-value">{staff ? staff.name : 'Unknown'}</span>
          </div>
          
          <div className="event-detail">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{dayjs(event.shiftStart).format('DD MMMM YYYY')}</span>
          </div>
          
          <div className="event-detail">
            <span className="detail-label">Time:</span>
            <span className="detail-value">
              {dayjs(event.shiftStart).format('HH:mm')} - {dayjs(event.shiftEnd).format('HH:mm')}
            </span>
          </div>
          
          {event.location && (
            <div className="event-detail">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{event.location}</span>
            </div>
          )}
          
          {event.description && (
            <div className="event-detail">
              <span className="detail-label">Description:</span>
              <div className="detail-value">{event.description}</div>
            </div>
          )}
          
          <div className="event-tags">
            <span className="detail-label">Tags:</span>
            <div className="tags-container">
              {Object.entries(TAGS).map(([tag, { color, bg, text }]) => (
                <span 
                  key={tag}
                  className={`tag ${event.tags?.includes(tag) ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: event.tags?.includes(tag) ? bg : '#f5f5f5',
                    color: event.tags?.includes(tag) ? color : '#666',
                    borderColor: event.tags?.includes(tag) ? color : '#ddd'
                  }}
                  onClick={() => handleTagToggle(tag)}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="event-modal-footer">
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal; 