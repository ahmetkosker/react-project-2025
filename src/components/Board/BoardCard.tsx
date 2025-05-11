import React from 'react';
import dayjs from 'dayjs';
import type { Assignment } from '../../models/schedule';

interface TagInfo {
  color: string;
  bg: string;
  text: string;
}

interface BoardCardProps {
  assignment: Assignment;
  staffColor: string;
  onDragStart: (assignment: Assignment) => void;
  onCardClick: (assignment: Assignment) => void;
  onTagMenuOpen: (assignment: Assignment, e: React.MouseEvent) => void;
  tags: {[key: string]: TagInfo};
}

const BoardCard: React.FC<BoardCardProps> = ({
  assignment,
  staffColor,
  onDragStart,
  onCardClick,
  onTagMenuOpen,
  tags
}) => {
  return (
    <div
      key={assignment.id}
      draggable
      onDragStart={() => onDragStart(assignment)}
      onClick={() => onCardClick(assignment)}
      style={{
        background: '#f5f7fa',
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(25,151,156,0.07)',
        marginBottom: 12,
        padding: '12px 10px',
        borderLeft: `5px solid ${assignment.isUpdated ? '#ff8847' : staffColor}`,
        cursor: 'grab',
        transition: 'box-shadow .2s',
        fontWeight: 500
      }}
    >
      <div style={{fontSize: '1rem', marginBottom: 4}}>
        {assignment.title || 'Shift'}
      </div>
      
      <div style={{fontSize: '0.95rem', color: '#666'}}>
        {dayjs(assignment.shiftStart).format('DD.MM.YYYY HH:mm')} - {dayjs(assignment.shiftEnd).format('HH:mm')}
      </div>
      
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6}}>
        {assignment.tags?.map(tag => (
          <span key={tag} style={{
            background: tags[tag]?.bg || '#f5f7fa', 
            color: tags[tag]?.color || '#666',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
            {tags[tag]?.text || tag}
          </span>
        ))}
        
        <button 
          onClick={(e) => onTagMenuOpen(assignment, e)}
          style={{
            background: 'transparent',
            border: '1px dashed #ccc',
            borderRadius: 4,
            padding: '1px 6px',
            fontSize: 10,
            cursor: 'pointer',
            color: '#888'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BoardCard; 