import React, { useState } from 'react';
import type { Staff, Assignment } from '../../models/schedule';

interface CreateEventModalProps {
  visible: boolean;
  initialData: {
    date: string;
    startTime: string;
    endTime: string;
  };
  newEvent: Partial<Assignment> & {
    startTime?: string;
    endTime?: string;
  };
  staffs: Staff[];
  onClose: () => void;
  onEventCreate: (event: Partial<Assignment>) => void;
  setNewEvent: (event: Partial<Assignment> & { startTime?: string; endTime?: string }) => void;
  onShowReminders: () => void;
}

interface TagInfo {
  color: string;
  bg: string;
  text: string;
}

const TAGS: {[key: string]: TagInfo} = {
  morning: { color: '#ffd700', bg: '#fff8bf', text: 'Morning' },
  afternoon: { color: '#ff8847', bg: '#fff2ea', text: 'Afternoon' },
  evening: { color: '#4c6ef5', bg: '#eef0ff', text: 'Evening' },
  important: { color: '#ff4444', bg: '#ffefef', text: 'Important' },
  meeting: { color: '#20c997', bg: '#e6f9f3', text: 'Meeting' },
  training: { color: '#a980f0', bg: '#f2e9fd', text: 'Training' },
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  initialData,
  newEvent,
  staffs,
  onClose,
  onEventCreate,
  setNewEvent,
  onShowReminders
}) => {
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  
  if (!visible) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleTimeChange = () => {
    const startDateTime = `${initialData.date}T${newEvent.startTime || initialData.startTime}:00`;
    const endDateTime = `${initialData.date}T${newEvent.endTime || initialData.endTime}:00`;
    
    setNewEvent({ 
      ...newEvent, 
      shiftStart: startDateTime,
      shiftEnd: endDateTime
    });
  };

  const handleRecurringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, isRecurring: e.target.checked });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = newEvent.tags ? [...newEvent.tags] : [];
    const tagIndex = newTags.indexOf(tag);
    
    if (tagIndex >= 0) {
      newTags.splice(tagIndex, 1);
    } else {
      newTags.push(tag);
    }
    
    setNewEvent({ ...newEvent, tags: newTags });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.staffId) {
      setTouched({
        title: true,
        staffId: true
      });
      return;
    }
    
    onEventCreate(newEvent);
  };

  return (
    <div className="create-event-modal-overlay">
      <div className="create-event-modal">
        <div className="create-event-modal-header">
          <h3>Create Event</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="create-event-modal-body">
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newEvent.title || ''}
                onChange={handleInputChange}
                className={touched.title && !newEvent.title ? 'error' : ''}
              />
              {touched.title && !newEvent.title && <span className="error-message">Title is required</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="staffId">Staff:</label>
              <select
                id="staffId"
                name="staffId"
                value={newEvent.staffId || ''}
                onChange={handleInputChange}
                className={touched.staffId && !newEvent.staffId ? 'error' : ''}
              >
                <option value="">Select staff</option>
                {staffs.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
              {touched.staffId && !newEvent.staffId && <span className="error-message">Staff must be selected</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="startTime">Start:</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={newEvent.startTime || initialData.startTime}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleTimeChange();
                  }}
                />
              </div>
              
              <div className="form-group half">
                <label htmlFor="endTime">End:</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={newEvent.endTime || initialData.endTime}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleTimeChange();
                  }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={newEvent.location || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newEvent.description || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <div className="form-row">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    name="isRecurring"
                    checked={newEvent.isRecurring || false}
                    onChange={handleRecurringChange}
                  />
                  <label htmlFor="isRecurring">Recurring Event</label>
                </div>
                
                <button 
                  type="button" 
                  className="reminder-btn"
                  onClick={onShowReminders}
                >
                  Reminders
                </button>
              </div>
            </div>
            
            {newEvent.isRecurring && (
              <div className="form-group">
                <label htmlFor="recurrenceRule">Recurrence Rule:</label>
                <select
                  id="recurrenceRule"
                  name="recurrenceRule"
                  value={newEvent.recurrenceRule || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select recurrence</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label>Tags:</label>
              <div className="tags-container">
                {Object.entries(TAGS).map(([tag, { color, bg, text }]) => (
                  <span 
                    key={tag}
                    className={`tag ${newEvent.tags?.includes(tag) ? 'active' : ''}`}
                    style={{ 
                      backgroundColor: newEvent.tags?.includes(tag) ? bg : '#f5f5f5',
                      color: newEvent.tags?.includes(tag) ? color : '#666',
                      borderColor: newEvent.tags?.includes(tag) ? color : '#ddd'
                    }}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="create-event-modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="create-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal; 