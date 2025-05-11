import React from 'react';
import dayjs from 'dayjs';
import type { Assignment, Staff } from '../../models/schedule';

interface TagInfo {
  color: string;
  bg: string;
  text: string;
}

interface CardDetailsModalProps {
  modalAssignment: Assignment | null;
  staff: Staff | undefined;
  tags: { [key: string]: TagInfo };
  onClose: () => void;
  toggleTag: (assignment: Assignment, tag: string) => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  modalAssignment,
  staff,
  tags,
  onClose,
  toggleTag
}) => {
  if (!modalAssignment) return null;
  
  return (
    <div className="event-details-popup" style={{zIndex: 9999}}>
      <div className="event-details-content" style={{
        minWidth: 340,
        maxWidth: 480,
        padding: 0,
        overflow: 'hidden',
        boxShadow: '0 10px 32px rgba(0,0,0,0.18)'
      }}>
        <div className="event-details-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          background: '#19979c',
          color: '#fff'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 0.5
          }}>Card Details</h3>
          <button 
            onClick={onClose} 
            className="close-button" 
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 28,
              cursor: 'pointer',
              padding: 0,
              marginLeft: 12
            }}
          >
            &times;
          </button>
        </div>
        
        <div className="event-details-body" style={{padding: '24px 24px 18px'}}>
          <p><strong>Staff:</strong> {staff?.name}</p>
          <p><strong>Shift:</strong> {modalAssignment.title || 'Shift'}</p>
          <p><strong>Date:</strong> {dayjs(modalAssignment.shiftStart).format('DD.MM.YYYY')}</p>
          <p>
            <strong>Time:</strong> {dayjs(modalAssignment.shiftStart).format('HH:mm')} - {dayjs(modalAssignment.shiftEnd).format('HH:mm')}
          </p>
          <p><strong>Description:</strong> {modalAssignment.description || 'No description available.'}</p>
          
          <div style={{margin: '12px 0'}}>
            <strong>Tags:</strong>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6}}>
              {Object.entries(tags).map(([tag, {color, bg, text}]) => (
                <span 
                  key={tag}
                  onClick={() => toggleTag(modalAssignment, tag)}
                  style={{
                    background: modalAssignment.tags?.includes(tag) ? bg : '#f5f7fa',
                    color: modalAssignment.tags?.includes(tag) ? color : '#888',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 13,
                    cursor: 'pointer',
                    border: `1px solid ${modalAssignment.tags?.includes(tag) ? color : '#e0e0e0'}`
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
          
          <div style={{margin: '12px 0'}}>
            <strong>Comments:</strong>
            <div style={{
              background: '#f5f7fa',
              borderRadius: 6,
              padding: '6px 10px',
              marginTop: 4,
              fontSize: 13
            }}>
              <b>Manager:</b> Please try to arrive on time.<br/>
              <b>Staff:</b> Understood, thank you.
            </div>
          </div>
          
          <div style={{margin: '12px 0'}}>
            <strong>File:</strong> <input type="file" style={{marginLeft: 8}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal; 